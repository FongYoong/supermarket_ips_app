import { Asset } from "expo-asset";
import ExpoTHREE, { THREE } from "expo-three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const modelAssets = {
  shelf1: Asset.fromModule(require("../../assets/models/shelf1.obj")),
};

const textureAssets = {
  shelf1: Asset.fromModule(require("../../assets/textures/shelf1.jpg")),
};

export class ShelfMesh extends THREE.Mesh {
  static async create(shelfType) {
    const asset = modelAssets[shelfType];
    await asset.downloadAsync();

    const loader = new OBJLoader();
    const model = await new Promise((resolve) => {
      loader.load(asset.localUri, (group) => {
        // Model loaded...
        resolve(group);
      });
    });
    //return new THREE.Mesh(geometry, material);
    // const material = new THREE.MeshStandardMaterial({
    //   color: "#f0023e",
    // });
    const texture = await ExpoTHREE.loadAsync(textureAssets[shelfType]);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    model.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    // const OBJBoundingBox = new THREE.Box3().setFromObject(model);
    // OBJBoundingBox.center(model.position);
    return model;
  }
}
