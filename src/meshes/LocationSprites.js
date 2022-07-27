import ExpoTHREE, { THREE } from "expo-three";

export class CurrentLocationSprite extends THREE.Sprite {
  static async create() {
    const texture = await ExpoTHREE.loadAsync(require("../../assets/images/layout/current_location_marker.png"));
    const material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(7, 7, 1);
    return sprite;
  }
}

export class TargetLocationSprite extends THREE.Sprite {
  static async create() {
    const texture = await ExpoTHREE.loadAsync(require("../../assets/images/layout/target_location_marker.png"));
    const material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(7, 7, 1);
    return sprite;
  }
}


