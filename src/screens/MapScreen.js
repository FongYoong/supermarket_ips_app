import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Spinner, Layout, Divider, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { PanGestureHandler, PinchGestureHandler, TapGestureHandler, State } from "react-native-gesture-handler";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
THREE.suppressMetroWarnings();
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import {
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { NavigationBackIcon } from "../components/Icons";
import BottomSheet from '../components/map/BottomSheet';
import { FloorMesh } from "../meshes/FloorMesh";
import { ShelfMesh } from "../meshes/ShelfMesh";
import { CurrentLocationSprite, TargetLocationSprite } from "../meshes/LocationSprites";
import { threeDimensions, cameraParameters, sections } from '../lib/supermarket_layout';
import { searchGraph, gridToThreeCoordinates, getGraphNode, findNearestNode, physicalCoordinatesToThreeCoordinates } from '../lib/supermarket_grid';
import { TrolleysContext } from "../lib/trolleys";
import { MapContext } from "../lib/map_context";
import { FadeIn } from "../lib/transitions";

const raycaster = new THREE.Raycaster();
const touchPoint = new THREE.Vector2();
// const gridPointGeometry = new THREE.BoxGeometry(1, 1, 1);
// const gridPointMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
// const gridPointHighlightMaterial = new THREE.MeshBasicMaterial( {color: 0xff0019} );
const pathLineMaterial = new MeshLineMaterial({
	color: 0x0000ff,
  lineWidth: 1,
});
const zIndex = 10;

export default function MapScreen() {

  const { trolleyConnected, trolleyData } = useContext(TrolleysContext);
  const { mapState, showMap, hideMap } = useContext(MapContext);

  const sceneRequestRef = useRef();

  useEffect(() => {
    return () => {
      if (sceneRequestRef.current) {
        cancelAnimationFrame(sceneRequestRef.current)
      }
    };
  }, []);

  const [sceneLoading, setSceneLoading] = useState(true);
  const canvasDimensions = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const lastTappedObject = useRef(null);
  const selectedBoundingBoxRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const startPointRef = useRef();
  const pathLineRef = useRef();
  const startMarkerRef = useRef();
  const targetMarkerRef = useRef();
  const startCircleRef = useRef();
  const targetCircleRef = useRef();

  // useEffect(() => {
  //   if (route.params && route.params.productInfo) {
  //     const { productInfo } = route.params;
  //     // setSelectedProduct(productInfo);
  //     setTarget({
  //       type: 'product',
  //       ...productInfo
  //     });
  //   }
  // }, [route.params])
  
  useEffect(() => {
    if (!sceneLoading) {
      if (trolleyConnected === true && trolleyData.values.coordinates) {
        const physicalCoords = trolleyData.values.coordinates;
        const threeCoords = physicalCoordinatesToThreeCoordinates(physicalCoords.x, physicalCoords.y);
        const nearestNode = findNearestNode(threeCoords.x, threeCoords.z);
        const startNode = getGraphNode(nearestNode.x, nearestNode.y);
        const startCoord = gridToThreeCoordinates(startNode.y, startNode.x);
        const startPoint = new THREE.Vector3(startCoord.x, zIndex, startCoord.z);
        startPointRef.current = startPoint;
        startMarkerRef.current.position.set(startPoint.x, zIndex + 2, startPoint.z - 3);
        startMarkerRef.current.visible = true;
        startCircleRef.current.position.set(startPoint.x, zIndex + 1, startPoint.z);
        startCircleRef.current.visible = true;
        if (mapState.target) {
          const targetPin = mapState.target.mapPin;
          const endNode = getGraphNode(targetPin.x, targetPin.y);
          const points = searchGraph(startNode, endNode).map((position) => {
            const coordinate = gridToThreeCoordinates(position.x, position.y);
            return new THREE.Vector3(coordinate.x, zIndex, coordinate.z);
          });
          pathLineRef.current.setPoints(points);
          const targetPoint = points[points.length - 1];
          targetMarkerRef.current.position.set(targetPoint.x, zIndex + 2, targetPoint.z - 3);
          targetMarkerRef.current.visible = true;
          targetCircleRef.current.position.set(targetPoint.x, zIndex + 1, targetPoint.z);
          targetCircleRef.current.visible = true;
        }
        else {
          pathLineRef.current.setPoints([]);
          targetMarkerRef.current.visible = false;
          targetCircleRef.current.visible = false;
        }
      }
      else {
        startMarkerRef.current.visible = false;
        startCircleRef.current.visible = false;
      }
    }
  }, [sceneLoading, trolleyConnected, trolleyData.values.coordinates, mapState.target]);

  const recenterCamera = () => {
    if (startPointRef.current) {
      cameraPosX.value = withTiming(startPointRef.current.x, { duration: 500 });
      cameraPosZ.value = withTiming(startPointRef.current.z, { duration: 500 });
    }
  }

  // Camera parameters
  const oldScale = useSharedValue(0);
  const fov = useSharedValue(cameraParameters.initialFov);

  const pinchStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      oldScale.value = 0;
    }
  };
  const pinchGestureEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const scale = event.nativeEvent.scale - 1;
      const diff = oldScale.value - scale;
      if (Math.abs(diff) > 0.005) {
        oldScale.value = scale;
        const newFOV = fov.value + 200 * diff;
        if (newFOV >= cameraParameters.minFov && newFOV <= cameraParameters.maxFov) {
          fov.value = withSpring(newFOV, { damping: 15, stiffness: 120 });
        }
      }
    }
  };

  const cameraPosX = useSharedValue(cameraParameters.initialX);
  const cameraPosZ = useSharedValue(cameraParameters.initialZ);
  const oldTransX = useSharedValue(0);
  const oldTransY = useSharedValue(0);

  const panStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      oldTransX.value = 0;
      oldTransY.value = 0;
    }
  };
  const panGestureEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const transX = event.nativeEvent.translationX;
      const transY = event.nativeEvent.translationY;
      const diffX = oldTransX.value - transX;
      const diffY = oldTransY.value - transY;

      if (Math.abs(diffX) > 0.05) {
        oldTransX.value = transX;
        const newValue = cameraRef.current.position.x + diffX;
        cameraPosX.value = withSpring(Math.min(
          Math.max(newValue, threeDimensions.xNegativeBoundary),
          threeDimensions.xPositiveBoundary
        ), { mass: 0.5, damping: 100, stiffness: 200 });
        // cameraPosX.value = cameraPosX.value + diffX * 0.1;
      }
      if (Math.abs(diffY) > 0.05) {
        oldTransY.value = transY;
        const newValue = cameraRef.current.position.z + diffY;
        cameraPosZ.value = withSpring(Math.min(
          Math.max(newValue, threeDimensions.zNegativeBoundary),
          threeDimensions.zPositiveBoundary
        ), { mass: 0.5, damping: 100, stiffness: 200 });
        // cameraPosZ.value = cameraPosZ.value + diffY * 0.1;
      }
    }
  };

  const findIntersections = (x, y) => {
    touchPoint.x = (x / canvasDimensions.current.width ) * 2 - 1;
    touchPoint.y = - (y / canvasDimensions.current.height) * 2 + 1;
    raycaster.setFromCamera(touchPoint, cameraRef.current);
    return raycaster.intersectObjects(sceneRef.current.children);
  }

  const tapStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const x = event.nativeEvent.x;
      const y = event.nativeEvent.y;
      const intersects = findIntersections(x, y);
      if ( intersects.length > 0 ) {
        for (const intersect of intersects) {
          const parent = intersect.object.parent;
          if (parent.onClick) {
            parent.onClick();
            lastTappedObject.current = parent;
            return;
          }
        }
      }
      lastTappedObject.current = null;
    }
  };
  
  const doubleTapStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const x = event.nativeEvent.x;
      const y = event.nativeEvent.y;
      const intersects = findIntersections(x, y);
      if ( intersects.length > 0 ) {
        for (const intersect of intersects) {
          const parent =  intersect.object.parent;
          if (parent.onClick) {
            if (lastTappedObject.current && parent === lastTappedObject.current) {
              cameraPosX.value = withTiming(parent.position.x, { duration: 500 });
              cameraPosZ.value = withTiming(parent.position.z + 20, { duration: 500 });
            }
            parent.onClick();
            return;
          }
        }
      }
    }
  };

  const setupScene = useCallback(async (gl) => {
    console.log('setting up scene');
    setSceneLoading(true);
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    gl.canvas = { width, height };
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0xf2f2f2);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // rawGrid.forEach((row, y) => {
    //   row.forEach((point, x) => {
    //     const cube = new THREE.Mesh( gridPointGeometry, point === 0 ? gridPointHighlightMaterial : gridPointMaterial );
    //     cube.position.set(gridDimensions.initialX + gridDimensions.deltaX * x, 10, gridDimensions.initialZ + gridDimensions.deltaZ * y);
    //     scene.add(cube);
    //   })
    // })

    // for (let i = 0; i < gridDimensions.xLength; i++) {
    //   for (let j = 0; j < gridDimensions.yLength; j++) {
    //     const cube = new THREE.Mesh( gridPointGeometry, gridPointMaterial );
    //     cube.position.set(gridDimensions.initialX + gridDimensions.deltaX * i, 10, gridDimensions.initialZ + gridDimensions.deltaZ * j);
    //     scene.add( cube );
    //   }
    // }

    const pathLine = new MeshLine();
    const pathLineMesh = new THREE.Mesh(pathLine, pathLineMaterial);
    scene.add(pathLineMesh);
    pathLineRef.current = pathLine;

    const startMarker = await CurrentLocationSprite.create();
    startMarker.visible = false;
    scene.add(startMarker);
    startMarkerRef.current = startMarker;
    
    const targetMarker = await TargetLocationSprite.create();
    targetMarker.visible = false;
    scene.add(targetMarker);
    targetMarkerRef.current = targetMarker;

    const circleGeometry = new THREE.CircleGeometry(2, 16);
    const startCircleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd000 });
    const startCircle = new THREE.Mesh(circleGeometry, startCircleMaterial);
    startCircle.rotation.set(THREE.Math.degToRad(-90), 0, 0);
    startCircle.visible = false;
    scene.add(startCircle);
    startCircleRef.current = startCircle;

    const targetCircleMaterial = new THREE.MeshBasicMaterial({ color: 0xffb8c7 });
    const targetCircle = new THREE.Mesh(circleGeometry, targetCircleMaterial);
    targetCircle.rotation.set(THREE.Math.degToRad(-90), 0, 0);
    targetCircle.visible = false;
    scene.add(targetCircle);
    targetCircleRef.current = targetCircle;

    const camera = new THREE.PerspectiveCamera(
      cameraParameters.initialFov,
      width / height,
      cameraParameters.near,
      cameraParameters.far
    );
    camera.rotation.set(THREE.Math.degToRad(cameraParameters.rotationX), 0, 0);
    camera.position.set(cameraParameters.initialX, cameraParameters.height, cameraParameters.initialZ);
    cameraRef.current = camera;

    const floor = await FloorMesh.create(threeDimensions.length, threeDimensions.width);
    floor.castShadow = true;
    floor.receiveShadow = true;
    floor.position.set(0, 0, 0);
    scene.add(floor);

    for (const section of sections) {
      for (const model of section.models) {
        const shelf = await ShelfMesh.create(model, (boundingBox) => {
          if (selectedBoundingBoxRef.current) {
            selectedBoundingBoxRef.current.visible = false;
          }
          selectedBoundingBoxRef.current = boundingBox;
          boundingBox.visible = true;
          setSelectedSection({
            id: `${section.productCategory}-${model.gridPosition.x}-${model.gridPosition.y}`,
            name: section.productCategory,
            mapPin: model.gridPosition
          });
        });
        shelf.position.set(model.position.x, model.position.y, model.position.z);
        shelf.rotateY(THREE.Math.degToRad(model.rotationY));
        scene.add(shelf);
      }
    }

    const topLight = new THREE.DirectionalLight(0xffffff, 0.2);
    topLight.position.set(0, 10, 0);
    topLight.target = floor;
    scene.add(topLight);
    const xLightLeft = new THREE.DirectionalLight(0xffffff, 0.8);
    xLightLeft.position.set(-30, 10, 0);
    xLightLeft.target = floor;
    scene.add(xLightLeft);
    const xLightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    xLightRight.position.set(30, 10, 0);
    xLightRight.target = floor;
    scene.add(xLightRight);
    const zLight = new THREE.DirectionalLight(0xffffff, 0.8);
    zLight.position.set(0, 10, 30);
    zLight.target = floor;
    scene.add(zLight);

    // Setup an animation loop
    const renderScene = () => {
      const request = requestAnimationFrame(renderScene);
      sceneRequestRef.current = request;

      // Update camera's FOV
      if (camera.fov !== fov.value) {
        camera.fov = fov.value;
        camera.updateProjectionMatrix();
      }
      // Update camera's position
      camera.position.x = cameraPosX.value;
      camera.position.z = cameraPosZ.value;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderScene();
    setSceneLoading(false);
    console.log('scene setup done');
  }, []);

  return (
    <FadeIn
      show={showMap}
      style={{
        position: 'absolute',
        zIndex: showMap ? 10 : -1,
        width: '100%',
        height: '100%'
      }}
    >
      <TopNavigation
          title='Map'
          accessoryLeft={
              <TopNavigationAction icon={NavigationBackIcon} 
                  onPress={() => {
                    hideMap(true);
                  }}
              />
          }
      />
      <Divider />
      <Layout style={{
          flex: 1,
          // backgroundColor: "#fff",
          padding: 2,
        }}
      >
        {sceneLoading &&
          <Layout style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <Spinner size='large' />
          </Layout>
        }
        <PinchGestureHandler
          onHandlerStateChange={pinchStateChange}
          onGestureEvent={pinchGestureEvent}
        >
          <PanGestureHandler
            onHandlerStateChange={panStateChange}
            onGestureEvent={panGestureEvent}
            minPointers={1}
            maxPointers={1}
          >
            <TapGestureHandler
              onHandlerStateChange={tapStateChange}
              minPointers={1}
            >
              <TapGestureHandler
                onHandlerStateChange={doubleTapStateChange}
                minPointers={1}
                numberOfTaps={2}
              >
                <GLView
                  style={{
                    flex: 1,
                    width: "100%",
                    //borderColor: "black",
                    //borderWidth: 0.5,
                  }}
                  onContextCreate={setupScene}
                  onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    canvasDimensions.current = { width, height };
                  }}
                />
              </TapGestureHandler>
            </TapGestureHandler>
          </PanGestureHandler>
        </PinchGestureHandler>
        <BottomSheet loading={sceneLoading} selectedSection={selectedSection} 
          onRecenter={recenterCamera}
        />
      </Layout>
    </FadeIn>
  );
}


    //camera.rotateY(diffX / 100);
    // if (Math.abs(diffY) > 0.2) {
    //   oldTransY.value = transY;
    //   camera.rotateOnWorldAxis(
    //     new THREE.Vector3(1, 0, 0),
    //     THREE.Math.degToRad(diffY / 1)
    //   );
    // }

    // if (Math.abs(diffY) > 0.2) {
    //   oldTransY.value = transY;

    //   const yQuaternion = new THREE.Quaternion();
    //   yQuaternion.setFromAxisAngle(
    //     new THREE.Vector3(0, 0, 1),
    //     (Math.PI / 180) * -diffY
    //   );
    //   camera.applyQuaternion(yQuaternion);
    // }

    //const euler = new THREE.Euler(0, 0, 0);
    ///euler.x = (-diffX * Math.PI) / 180;

    //euler.y = (-diffY * Math.PI) / 180;
    //camera.quaternion.setFromEuler(euler);
    // camera.rotation.x = Math.min(
    //   Math.max(camera.rotation.x, -1.0472),
    //   1.0472
    // );

    // const newFOV = fov.value + 120 * diff;
    // if (newFOV > 20 && newFOV < 180) {
    //   fov.value = withTiming(newFOV, {
    //     duration: 100,
    //   });
    // }

    //rotatingCube.position.x += 0.1;
    //camera.fov -= 5;
    //camera.updateProjectionMatrix();

    
    // light.castShadow = true;
    // light.shadow.mapSize.width = 512; // 4096 is the best, but poor performance
    // light.shadow.mapSize.height = 512;
    // light.shadow.camera.near = 500;
    // light.shadow.camera.far = 4000;
    // light.shadow.camera.fov = 30;

    // const cubeGeometry = new THREE.BoxBufferGeometry();
    // const cubeMaterial = new THREE.MeshStandardMaterial({
    //   color: "#17f0ff",
    // });
    // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.y = 2.5;
    // cube.castShadow = true;
    // cube.receiveShadow = true;
    // scene.add(cube);
    // setRotatingCube(cube);

    // function updateCube() {
    //   cube.rotation.y += 0.05;
    //   cube.rotation.x += 0.025;
    // }

    //camera.lookAt(cube.position);