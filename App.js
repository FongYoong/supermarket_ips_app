import { GLView } from "expo-gl";
import { StatusBar } from "expo-status-bar";
import { Renderer, THREE } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const deg2rad = (degrees) => degrees * (Math.PI / 180);

export default function App() {
  console.log("Loaded");
  const [camera, setCamera] = useState(null);
  const [rotatingCube, setRotatingCube] = useState(null);
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
          if (rotatingCube) {
            rotatingCube.position.x += 0.1;
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
      <OrbitControlsView style={{flex: 1, width: "100%"}} camera={camera} >
        <GLView
          style={{
            flex: 1,
            width: "100%",
            borderColor: "black",
            borderWidth: 2,
          }}
          onContextCreate={(gl) => {
            // Create a WebGLRenderer without a DOM element
            const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
            gl.canvas = { width, height };
            console.log(width, height);
            const renderer = new Renderer({ gl });
            renderer.setSize(width, height);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

            const camera = new THREE.PerspectiveCamera(
              70,
              width / height,
              0.01,
              1000
            );
            camera.position.set(2, 5, 5);
            setCamera(camera);

            const scene = new THREE.Scene();
            //scene.fog = new THREE.Fog(0x6ad6f0, 1, 10000);
            //scene.add(new THREE.GridHelper(10, 10));

            const light = new THREE.DirectionalLight(0xffffff, 1);
            //const light = new THREE.SpotLight(0xffffff);
            light.position.set(5, 20, 0); //default; light shining from top
            light.rotateX(deg2rad(30));
            light.castShadow = true;
            light.shadow.mapSize.width = 512; // 4096 is the best, but poor performance
            light.shadow.mapSize.height = 512;
            // light.shadow.camera.near = 500;
            // light.shadow.camera.far = 4000;
            // light.shadow.camera.fov = 30;
            scene.add(light);

            const planeGeometry = new THREE.BoxGeometry(100, 1, 100);
            const planeMaterial = new THREE.MeshStandardMaterial({
              color: "#f5c107",
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            //plane.rotateX(deg2rad(90));
            plane.castShadow = true;
            plane.receiveShadow = true;
            scene.add(plane);

            const cubeGeometry = new THREE.BoxGeometry();
            const cubeMaterial = new THREE.MeshStandardMaterial({
              color: "#17f0ff",
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.y = 2.5;
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
            setRotatingCube(cube);

            camera.lookAt(cube.position);

            function update() {
              cube.rotation.y += 0.05;
              cube.rotation.x += 0.025;
            }

            // Setup an animation loop
            const render = () => {
              const timeout = requestAnimationFrame(render);
              update();
              renderer.render(scene, camera);
              gl.endFrameEXP();
            };
            render();
          }}
        />
      </OrbitControlsView>
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
