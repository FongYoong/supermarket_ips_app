import { GLView } from "expo-gl";
import { StatusBar } from "expo-status-bar";
import { Renderer, THREE } from "expo-three";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  console.log("Loaded");
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          flex: 1,
          width: '100%',
          alignItems: "center",
          justifyContent: "center",
          borderColor: "black",
          borderWidth: 2,
        }}
        onPress={() => console.log("clicked")}
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
          const camera = new THREE.PerspectiveCamera(
            70,
            width / height,
            0.01,
            1000
          );
          camera.position.set(2, 5, 5);

          const scene = new THREE.Scene();
          scene.fog = new THREE.Fog(0x6ad6f0, 1, 10000);
          scene.add(new THREE.GridHelper(10, 10));

          const ambientLight = new THREE.AmbientLight(0x001010);
          scene.add(ambientLight);

          const geometry = new THREE.BoxGeometry();
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          const cube = new THREE.Mesh(geometry, material);
          scene.add(cube);

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
