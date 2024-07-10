const appDelegateOldBundle =
  'return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];';
const appDelegateNewBundle = 'return [LiveUpdate getLatestBundleURL];';

const mainApplicationRnHost = `
        @Override
        protected String getJSBundleFile() {
          return LiveUpdate.getJSBundleFile(getApplicationContext());
        }
`;

const liveUpdate = {
  ios: {
    appDelegate: {
      import: '#import <LiveUpdate/LiveUpdate.h>',
      oldBundle: appDelegateOldBundle,
      newBundle: appDelegateNewBundle,
    },
  },
  android: {
    app: {
      import: 'import com.shoutem.LiveUpdate.LiveUpdate;',
      rnHost: mainApplicationRnHost,
    },
  },
};

module.exports = {
  liveUpdate,
};
