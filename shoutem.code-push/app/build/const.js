const appDelegateOldBundle = 'return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];';
const appDelegateNewBundle = 'return [CodePush bundleURL];';

const gradleSettings = `
include ':app', ':react-native-code-push'
project(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-code-push/android/app')
`;

const mainApplicationRnHost = `
protected String getJSBundleFile() {
  return CodePush.getJSBundleFile();
}
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
      getPackages: 'packages.add(new CodePush(null, getApplicationContext(), BuildConfig.DEBUG));',
      gradle: {
        codepushGradle: 'apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"',
        buildTypes: 'buildConfigField "String", "CODE_PUSH_APP_KEY", CUSTOM_CODE_PUSH_APP_KEY',
        codepushKey: 'CUSTOM_CODE_PUSH_APP_KEY="ImWEX3C5l0r1PLXGLlM3VtfB15dfVyQ9naUsl"',
        dependencies: "implementation project(':react-native-code-push')",
      },
      rnHost: mainApplicationRnHost,
      settings: gradleSettings,
    },
  },
};

module.exports = {
  codepush,
};
