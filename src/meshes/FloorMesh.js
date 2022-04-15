import ExpoTHREE, { THREE } from "expo-three";

export class FloorMesh extends THREE.Mesh {
  static async create() {
    const geometry = new THREE.BoxBufferGeometry(50, 1, 50);
    const texture = await ExpoTHREE.loadAsync(require("../../assets/textures/tiles.jpg"));
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    return new THREE.Mesh(geometry, material);
  }
}
