import { GLView } from "expo-gl";
import { StatusBar } from "expo-status-bar";
import { Renderer, THREE } from "expo-three";
// import OrbitControlsView from "expo-three-orbit-controls";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  withTiming,
  withSpring,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

import { FloorMesh } from "./src/meshes/FloorMesh";
import { ShelfMesh } from "./src/meshes/ShelfMesh";

const defaultFOV = 70;

export default function App() {
  useEffect(async () => {
  }, []);
  console.log("Loaded");
  const [camera, setCamera] = useState(null);
  const [rotatingCube, setRotatingCube] = useState(null);

  const oldScale = useSharedValue(0);
  const fov = useSharedValue(defaultFOV);
  const pinchStateChange = (event) => {
    //Use this for state changes
    if (event.nativeEvent.state === State.END) {
      oldScale.value = 0;
    }
  };
  const pinchGestureEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const scale = event.nativeEvent.scale - 1;
      const diff = oldScale.value - scale;
      if (Math.abs(diff) > 0.1) {
        oldScale.value = scale;
        const newFOV = fov.value + 120 * diff;
        if (newFOV > 35 && newFOV < 80) {
          fov.value = withTiming(newFOV, {
            duration: 150,
          });
        }
      }
    }
  };

  const oldTransX = useSharedValue(0);
  const oldTransY = useSharedValue(0);
  const camRotX = useSharedValue(0);
  const camRotY = useSharedValue(0);

  //const cameraPos = useSharedValue(new THREE.Vector3(2, 5, 5));
  const panStateChange = (event) => {
    //Use this for state changes
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
      //camera.rotateY(diffX / 100);

      if (Math.abs(diffX) > 0.2) {
        oldTransX.value = transX;
        camera.position.x += diffX * 0.15;
      }
      if (Math.abs(diffY) > 0.2) {
        oldTransY.value = transY;
        camera.position.z += diffY * 0.15;
      }

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
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "black",
          borderWidth: 2,
        }}
        onPress={() => {
          console.log("clicked");
          if (camera) {
            //rotatingCube.position.x += 0.1;
            //camera.fov -= 5;
            //camera.updateProjectionMatrix();
          }
        }}
      >
        <Text
          style={{
            borderColor: "black",
            borderWidth: 2,
          }}
        >
          Touch Here
        </Text>
      </TouchableOpacity>
      {/* <OrbitControlsView style={{flex: 1, width: "100%"}} camera={camera} > */}
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
          <GLView
            style={{
              flex: 1,
              width: "100%",
              borderColor: "black",
              borderWidth: 2,
            }}
            onContextCreate={async (gl) => {
              // Create a WebGLRenderer without a DOM element
              const { drawingBufferWidth: width, drawingBufferHeight: height } =
                gl;
              gl.canvas = { width, height };
              const renderer = new Renderer({ gl });
              renderer.setSize(width, height);
              renderer.setClearColor(0x6ad6f0);
              renderer.shadowMap.enabled = true;
              renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

              const camera = new THREE.PerspectiveCamera(
                70,
                width / height,
                0.01,
                1000
              );
              //camera.rotation = new THREE.Euler(THREE.Math.degToRad(-90), 0, 0);
              camera.rotation.set(THREE.Math.degToRad(-80), 0, 0);
              camera.position.set(2, 50, 5);
              setCamera(camera);

              const scene = new THREE.Scene();
              //scene.fog = new THREE.Fog(0x6ad6f0, 1, 10000);
              //scene.add(new THREE.GridHelper(10, 10));

              const light = new THREE.DirectionalLight(0xffffff, 1);
              //const light = new THREE.SpotLight(0xffffff);
              light.position.set(5, 20, 0); //default; light shining from top
              light.rotateX(THREE.Math.degToRad(30));
              light.castShadow = true;
              light.shadow.mapSize.width = 512; // 4096 is the best, but poor performance
              light.shadow.mapSize.height = 512;
              // light.shadow.camera.near = 500;
              // light.shadow.camera.far = 4000;
              // light.shadow.camera.fov = 30;
              scene.add(light);

              //const planeMaterial = new THREE.MeshStandardMaterial({
                //color: "#e6e6e6",
              //});
              //const plane = new THREE.Mesh(planeGeometry, planeMaterial);
              const plane = await FloorMesh.create();
              //plane.rotateX(deg2rad(90));
              plane.castShadow = true;
              plane.receiveShadow = true;
              scene.add(plane);

              const b = await ShelfMesh.create('shelf1');
              b.scale.multiplyScalar(1);
              b.position.set(5, 5, 0);
              scene.add(b);

              const cubeGeometry = new THREE.BoxBufferGeometry();
              const cubeMaterial = new THREE.MeshStandardMaterial({
                color: "#17f0ff",
              });
              const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
              cube.position.y = 2.5;
              cube.castShadow = true;
              cube.receiveShadow = true;
              scene.add(cube);
              setRotatingCube(cube);

              //camera.lookAt(cube.position);

              function updateCube() {
                cube.rotation.y += 0.05;
                cube.rotation.x += 0.025;
              }

              // Setup an animation loop
              const render = () => {
                const timeout = requestAnimationFrame(render);
                updateCube();
                //camera.lookAt(cube.position);
                if (camera.fov !== fov.value) {
                  camera.fov = fov.value;
                  camera.updateProjectionMatrix();
                }

                camera.position.x = Math.min(
                  Math.max(camera.position.x, -30),
                  30
                );
                camera.position.z = Math.min(
                  Math.max(camera.position.z, -30),
                  30
                );
                //console.log(camera.position.x);

                renderer.render(scene, camera);
                gl.endFrameEXP();
              };
              render();
            }}
          />
        </PanGestureHandler>
      </PinchGestureHandler>
      {/* </OrbitControlsView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
});
