import { Asset } from "expo-asset";
import ExpoTHREE, { THREE } from "expo-three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const modelAssets = {
  shelf1: Asset.fromModule(require("../../assets/models/shelf1.obj")),
  shelf2: Asset.fromModule(require("../../assets/models/shelf2.obj")),
  shelf3: Asset.fromModule(require("../../assets/models/shelf3.obj")),
  shelf4: Asset.fromModule(require("../../assets/models/shelf4.obj")),
  shelf5: Asset.fromModule(require("../../assets/models/shelf5.obj")),
};

const textureAssets = {
  shelf1: Asset.fromModule(require("../../assets/textures/metal.jpg")),
  shelf2: Asset.fromModule(require("../../assets/textures/shelf2.jpg")),
  shelf3: Asset.fromModule(require("../../assets/textures/metal.jpg")),
  shelf4: Asset.fromModule(require("../../assets/textures/metal.jpg")),
  shelf5: Asset.fromModule(require("../../assets/textures/metal.jpg")),
};

const textures = {};

export const loadShelfAssets = async () => {
  await Promise.all(Object.values(modelAssets).map((asset) => asset.downloadAsync()));
  for (const assetName in textureAssets) {
    const texture =  await ExpoTHREE.loadAsync(textureAssets[assetName]);
    textures[assetName] = texture;
  }
  //     ...Object.values(textureAssets).map((asset) => ExpoTHREE.loadAsync(asset))
}

const boundingBoxMaterial = new THREE.LineBasicMaterial( {
  color: 0xff0000,
  linewidth: 8
});

export class ShelfMesh extends THREE.Mesh {
  static async create(metadata, onClick) {
    const asset = modelAssets[metadata.type];
    // await asset.downloadAsync();

    const loader = new OBJLoader();
    const model = await new Promise((resolve) => {
      loader.load(asset.localUri, (group) => {
        // Model loaded
        resolve(group);
      });
    });

    // const texture = await ExpoTHREE.loadAsync(textureAssets[metadata.type]);
    const texture = textures[metadata.type];
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });

    //Draw outline
    const boundingBox = new THREE.BoxHelper(model, 0xff0000);
    boundingBox.material = boundingBoxMaterial;
    boundingBox.visible = false;
    model.add(boundingBox);

    model.onClick = () => {
      if (onClick) {
        onClick(boundingBox);
      }
    };
    model.metadata = metadata;

    model.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    
    if (metadata.scale !== undefined) {
      model.scale.multiplyScalar(metadata.scale);
    }


    // const OBJBoundingBox = new THREE.Box3().setFromObject(model);
    // OBJBoundingBox.center(model.position);

    return model;
  }
}
