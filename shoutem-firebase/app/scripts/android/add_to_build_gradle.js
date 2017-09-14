/* eslint-disable max-len, quotes */
'use_strict';

const fs = require('fs');
const GRADLE_TABSPACE = 4;
const dependenciesStart = `dependencies {`;

// 1. apply google-services plugin
const appBuildGradlePath = 'android/app/build.gradle';

const appBuildGradleContents = fs.readFileSync(appBuildGradlePath, "utf8");
const googleServicesPlugin = `apply plugin: "com.google.gms.google-services"`;
let newAppBuildGradleContents;
if (~appBuildGradleContents.indexOf(googleServicesPlugin)) {
  console.log(`"com.google.gms.google-services" is already applied in ${appBuildGradlePath}`);
  newAppBuildGradleContents = appBuildGradleContents;
} else {
  newAppBuildGradleContents = appBuildGradleContents.replace(appBuildGradleContents,
    `${appBuildGradleContents}\n${googleServicesPlugin}`);
}

// 2. add firebase-core dependency
const fcmDependency = `compile project(':react-native-fcm')`;
const newFcmDependency = `compile (project(':react-native-fcm'))`;

// always add new fcm dependency if it doesn't exist
if (~newAppBuildGradleContents.indexOf(newFcmDependency)) {
  console.log(`"${newFcmDependency}" is already added as a dependency in ${appBuildGradlePath}`);
} else {

  

  // link the react-native packages
  require('../link_firebase_dependencies');
  // always remove old fcm dependency if it exists
  if (~newAppBuildGradleContents.indexOf(fcmDependency)) {
    newAppBuildGradleContents = newAppBuildGradleContents.replace(fcmDependency, '');
  }
  const firebaseDependencies =
    `compile (project(':react-native-fcm')) { 
        exclude group: 'com.google.firebase', module: 'firebase-core'
        exclude group: 'com.google.firebase', module: 'firebase-messaging'
    }
    compile 'com.google.firebase:firebase-core:10.2.1'
    compile 'com.google.firebase:firebase-messaging:10.2.1'`;

  // append new react-native-fcm dependency
  newAppBuildGradleContents = newAppBuildGradleContents.replace(
    dependenciesStart,
    `${dependenciesStart}\n${' '.repeat(GRADLE_TABSPACE)}${firebaseDependencies}`
  );
}

fs.writeFileSync(appBuildGradlePath, newAppBuildGradleContents);

// 3. Add google-services plugin to classpath
const buildGradlePath = 'android/build.gradle';

const buildGradleContents = fs.readFileSync(buildGradlePath, "utf8");
const googleServicesClasspath = `classpath 'com.google.gms:google-services:3.0.0'`;
if (~buildGradleContents.indexOf(googleServicesClasspath)) {
  console.log(`"google-services" is already added to the classpath`);
} else {
  const newBuildGradleContents = buildGradleContents.replace(dependenciesStart,
    `${dependenciesStart}\n${' '.repeat(GRADLE_TABSPACE * 2)}${googleServicesClasspath}`);
  fs.writeFileSync(buildGradlePath, newBuildGradleContents);
}
