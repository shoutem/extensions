import Flurry from 'react-native-flurry-sdk';
import { getExtensionSettings, isProduction } from 'shoutem.application';
import { isFlurryActive } from './services/flurry';
import { ext } from './const';

export function appDidMount(app) {
  const state = app.getState();

  if (!isFlurryActive(state)) {
    return;
  }

  // If the user returns the app from background within an hour, the session will be reused
  const sessionDuration = 60 * 60 * 1000;
  const { ios = {}, android = {} } = getExtensionSettings(state, ext());

  const logLevel = isProduction()
    ? Flurry.LogLevel.ERROR
    : Flurry.LogLevel.DEBUG;

  new Flurry.Builder()
    .withCrashReporting(true)
    .withLogEnabled(true)
    .withLogLevel(logLevel)
    .withContinueSessionMillis(sessionDuration)
    .build(android.apiKey, ios.apiKey);
}
