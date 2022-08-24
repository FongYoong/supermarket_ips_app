## Supermarket IPS App

* A [React Native](https://reactnative.dev/) app which uses [Expo's bare workflow](https://docs.expo.dev/introduction/managed-vs-bare/#bare-workflow).
* This app is part of a demonstration for an indoor positioning system (IPS) in supermarkets. The IPS relies on visible light communication (VLC) to determine the customers' relative positions in the supermarket.
* The app's features include:
    - Viewing product listings
    * 3D view of the supermarket layout with path visualizations
    * Customer support chat

***

### Development
* `expo install [packagae_name]` to install a package
* `yarn remove [package_name]` to remove a package
* `expo prebuild` to generate Android/IOS specific project files
* `expo run:android` to test the app on an Android phone via USB.
* `eas build -p android --profile preview` to generate APK file
* `eas build -p android --profile production` to generate [Android App Bundle (.aab)](https://developer.android.com/guide/app-bundle)
* Relevant links:
    - [app.json](https://docs.expo.dev/versions/latest/config/app)
    - [eas.json guide](https://docs.expo.dev/build/eas-json/)
    - [eas.json reference](https://docs.expo.dev/build-reference/eas-json)
    - [Creating a Build](https://docs.expo.dev/build/setup/)
    - [Building APKs](https://docs.expo.dev/build-reference/apk/)
    - [Android Publishing](https://docs.expo.dev/submit/android/)
    - [Local EAS builds](https://docs.expo.dev/build-reference/local-builds/)
    - [Legacy Builds (Expires after January 4, 2023)](https://docs.expo.dev/archive/classic-updates/building-standalone-apps/)