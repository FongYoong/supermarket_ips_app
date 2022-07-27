import ExpoTHREE, { THREE } from "expo-three";

export class FloorMesh extends THREE.Mesh {
  static async create(length, width, height=1) {
    const geometry = new THREE.BoxBufferGeometry(length, height, width);
    const texture = await ExpoTHREE.loadAsync(require("../../assets/textures/tiles.jpg"));
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    return new THREE.Mesh(geometry, material);
  }
}
