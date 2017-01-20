'use_strict';

const execSync = require('child_process').execSync;

execSync('react-native link react-native-fcm', (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`Linking error: ${error}`);
  }
  console.log('shoutem.firebase - native dependencies linked');
});

