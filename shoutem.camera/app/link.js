const exec = require('child_process').execSync;

const rnCli = 'node node_modules/react-native/local-cli/cli.js link';
exec(`${rnCli} react-native-camera`);
