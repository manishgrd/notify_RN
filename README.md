# React Native Notify App

https://hasura.io/hub/projects/notify/notifyapp
---

A basic react native app integrated with firebase referring RNFirebase.io
---

### Getting Started

If you're only developing for one platform you can ignore the steps below that are tagged with the platform you don't require.

#### 1) Clone & Install Dependencies

- 1.1) `git clone https://github.com/manishgrd/notify_RN.git`
- 1.2) `cd notify_RN` - cd into your newly created project directory.
- 1.3) Install NPM packages with your package manager of choice - i.e run `yarn`

#### 2) Add `Google Services` files (plist & JSON)
[Android]** Follow the `manually add firebase` to your app instructions [here](https://firebase.google.com/docs/android/setup#manually_add_firebase) to generate your `google-services.json` file if you haven't done so already - use the package name generated previously as your `Android package name`.

  
#### 3) Start your app

- 3.1) Start the react native packager, run `yarn run start`
- 3.2) **[Android]** If you haven't already got an android device attached/emulator running then you'll need to get one running (make sure the emulator is with Google Play / APIs). When ready run `yarn run android` from the root of your project.
