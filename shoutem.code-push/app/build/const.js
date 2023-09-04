const appDelegateOldBundle = 'return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];';
const appDelegateNewBundle = 'return [CodePush bundleURL];';

const gradleSettings = `
include ':app', ':react-native-code-push'
project(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-code-push/android/app')
`;

const mainApplicationRnHost = `
        @Override
        protected String getJSBundleFile() {
          return CodePush.getJSBundleFile();
        }
`
const stringsCodePushKey = `
<string moduleConfig="true" name="CodePushDeploymentKey">ImWEX3C5l0r1PLXGLlM3VtfB15dfVyQ9naUsl</string>
`

const codepush = {
  ios: {
    appDelegate: {
      import: '#import <CodePush/CodePush.h>',
      oldBundle: appDelegateOldBundle,
      newBundle: appDelegateNewBundle,
    },
  },
  android: {
    app: {
      import: 'import com.microsoft.codepush.react.CodePush;',
      gradle: {
        codepushGradle: 'apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"',
      },
      stringsCodePushKey,
      rnHost: mainApplicationRnHost,
      settings: gradleSettings,
    },
  },
};

module.exports = {
  codepush,
};
