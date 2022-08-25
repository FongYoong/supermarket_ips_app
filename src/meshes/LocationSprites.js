import { Asset } from "expo-asset";
import ExpoTHREE, { THREE } from "expo-three";

const currentLocationTextureAsset  = Asset.fromModule(require("../../assets/images/layout/current_location_marker.xpng"));
if (currentLocationTextureAsset.type === 'xpng') {
  currentLocationTextureAsset.type = 'png';
  currentLocationTextureAsset.width = 200;
  currentLocationTextureAsset.height = 200;
}

const targetLocationTextureAsset  = Asset.fromModule(require("../../assets/images/layout/target_location_marker.xpng"));
if (currentLocationTextureAsset.type === 'xpng') {
  currentLocationTextureAsset.type = 'png';
  currentLocationTextureAsset.width = 320;
  currentLocationTextureAsset.height = 320;
}

export class CurrentLocationSprite extends THREE.Sprite {
  static async create() {
    // const texture = await ExpoTHREE.loadAsync(require("../../assets/images/layout/current_location_marker.png"));
    await currentLocationTextureAsset.downloadAsync();
    const texture = await ExpoTHREE.loadTextureAsync({ asset: currentLocationTextureAsset });
    const material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(7, 7, 1);
    return sprite;
  }
}

export class TargetLocationSprite extends THREE.Sprite {
  static async create() {
    // const texture = await ExpoTHREE.loadAsync(require("../../assets/images/layout/target_location_marker.png"));
    await targetLocationTextureAsset.downloadAsync();
    const texture = await ExpoTHREE.loadTextureAsync({ asset: targetLocationTextureAsset });
    const material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(7, 7, 1);
    return sprite;
  }
}


