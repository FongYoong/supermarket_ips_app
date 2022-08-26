## Supermarket IPS App
* [⭳ Download](https://github.com/FongYoong/supermarket_ips_app/releases/latest/download/app-release.apk)
* A [React Native](https://reactnative.dev/) app which uses [Expo's bare workflow](https://docs.expo.dev/introduction/managed-vs-bare/#bare-workflow).
* This app is part of a demonstration for an indoor positioning system (IPS) in supermarkets. The IPS relies on visible light communication (VLC) to determine the customers' relative positions in the supermarket.
* The app's features include:
    - Viewing product listings
    * 3D view of the supermarket layout with path visualizations
    * Customer support chat

***

### Development
* `expo install [package_name]` to install a package
* `yarn remove [package_name]` to remove a package
* `expo prebuild` to generate Android/IOS specific project files
* `expo run:android` to test the app on an Android phone via USB.
* `expo run:android --variant release` to test the **minified** app on an Android phone via USB.

***

### Building with Expo
* Generate APK file with EAS:
    `eas build -p android --profile preview` 
* Generate [Android App Bundle (.aab)](https://developer.android.com/guide/app-bundle):
    `eas build -p android --profile production`
* [Expo's free tier](https://expo.dev/pricing) has a limited number of builds per month.
* Relevant links:
    - [app.json](https://docs.expo.dev/versions/latest/config/app)
    - [eas.json guide](https://docs.expo.dev/build/eas-json/)
    - [eas.json reference](https://docs.expo.dev/build-reference/eas-json)
    - [Creating a Build](https://docs.expo.dev/build/setup/)
    - [Building APKs](https://docs.expo.dev/build-reference/apk/)
    - [Android Publishing](https://docs.expo.dev/submit/android/)
    - [Local EAS builds](https://docs.expo.dev/build-reference/local-builds/)
    - [Legacy Builds (Expires after January 4, 2023)](https://docs.expo.dev/archive/classic-updates/building-standalone-apps/)

***

### Building Locally without Expo

1. As discussed in [Issue #1](https://github.com/expo/expo-three/issues/185#issuecomment-732161813) and [Issue #2](https://github.com/expo/expo-three/issues/225), React Native's **release build** causes image files (`.jpg, .png, etc`) to be moved by `gradlew` to  the Android project's drawable assets folder and will possess a **different URI scheme** which [expo-three](https://github.com/expo/expo-three)'s asset loader does not recognise. Hence, **the map will fail to load properly**. As a hacky solution, rename texture image extensions from `.jpg` to `.xjpg`. Likewise, `.png` becomes `.xpng`. The addition of `x` is arbitrary and to avoid the images from being affected by the different URI scheme.

2. When loading a texture image, make sure to set its **type, width and height** as follows:
    ```
    const textureAsset  = Asset.fromModule(require("../../assets/textures/tiles.xjpg")); // Change this
    if (textureAsset.type === 'xjpg') {
        textureAsset.type = 'jpg';
        // Use an image editor to find out the image dimensions
        textureAsset.width = 300; // Change this
        textureAsset.height = 300; // Change this
    }
    ```

3. Before building the release, clean the Android project:
    ```
    cd android
    gradlew clean
    cd ..
    ```

4. Generate the Javascript bundle:
    ```
    npx react-native bundle --platform android --minify true --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
    ```

5. Delete all `drawable-*` folders and also the `raw` folder in `android\app\src\main\res`. This is to address the **duplicate resources** issue as highlighted [here](https://stackoverflow.com/questions/53239705/react-native-error-duplicate-resources-android).

6. Build the APK:
    ```
    cd android
    gradlew assembleRelease
    ..or..
    gradlew assembleDebug
    ```
7. The release apk should be located at `android\app\build\outputs\apk\release`
8. Install the APK with `adb install [apk_file_path]`
9. View the phone's logs with `adb logcat`

***

### Misc
1. In a normal React Native project without Expo, it should be possible to create a **debug build without the dev server**. In `android\app\build.gradle`, add the following:
    ```
    project.ext.react = [
        ...
        bundleInDebug: true, // add this line,
        devDisabledInDev: true, // add this line,
    ]
    ```
2. Generate the debug build with the following:
    ```
    npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
    ```
3. However, it seems that it does not work in Expo even after ejecting it. I can't seem to get rid of Expo's dev client in debug builds 😔.