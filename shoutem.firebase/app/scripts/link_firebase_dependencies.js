'use_strict';

const execSync = require('child_process').execSync;

execSync('node node_modules/react-native/local-cli/cli.js link react-native-fcm', (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`Linking error: ${error}`);
  }
  console.log('shoutem.firebase - native dependencies linked');
});

