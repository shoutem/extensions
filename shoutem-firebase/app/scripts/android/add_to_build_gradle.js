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
const firebaseCore = `compile 'com.google.firebase:firebase-core:10.0.1'`;
if (~newAppBuildGradleContents.indexOf(firebaseCore)) {
  console.log(`"com.google.gms.google-services" is already added as a dependency in ${appBuildGradlePath}`);
} else {
  newAppBuildGradleContents = newAppBuildGradleContents.replace(dependenciesStart,
    `${dependenciesStart}\n${' '.repeat(GRADLE_TABSPACE)}${firebaseCore}`);
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
