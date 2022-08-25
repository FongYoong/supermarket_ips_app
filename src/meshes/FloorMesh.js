import { Asset } from "expo-asset";
import ExpoTHREE, { THREE } from "expo-three";
const textureAsset  = Asset.fromModule(require("../../assets/textures/tiles.xjpg"));
if (textureAsset.type === 'xjpg') {
  textureAsset.type = 'jpg';
  textureAsset.width = 300;
  textureAsset.height = 300;
}

export class FloorMesh extends THREE.Mesh {
  static async create(length, width, height=1) {
    const geometry = new THREE.BoxBufferGeometry(length, height, width);
    // const texture = await ExpoTHREE.loadAsync(require("../../assets/textures/tiles.xjpg"));
    await textureAsset.downloadAsync();
    const texture = await ExpoTHREE.loadTextureAsync({ asset: textureAsset })
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    return new THREE.Mesh(geometry, material);
  }
}
