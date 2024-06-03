import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'shoutem.i18n';
import {
  checkPermissions,
  openSettings,
  PERMISSION_RESULT_TYPES,
  PERMISSION_TYPES,
  requestPermissions,
} from 'shoutem.permissions';
import { ext } from '../const';

const MICROPHONE = Platform.select({
  ios: PERMISSION_TYPES.IOS_MICROPHONE,
  default: PERMISSION_TYPES.ANDROID_RECORD_AUDIO,
});

const CAMERA = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const { GRANTED } = PERMISSION_RESULT_TYPES;

export const usePermissionsGranted = () => {
  const navigation = useNavigation();

  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // We have to check for permissions again, after user comes back from settings. User might've
  // opeened settings and not given requried permissions again.
  const openSettingsCallback = useCallback(async () => {
    await openSettings();
    await checkMicAndCameraPermissions();
  }, [checkMicAndCameraPermissions]);

  const checkMicAndCameraPermissions = useCallback(() => {
    checkPermissions(CAMERA, MICROPHONE).then(statuses => {
      const camera = statuses[CAMERA];
      const microphone = statuses[MICROPHONE];

      if (microphone === GRANTED || camera === GRANTED) {
        setPermissionsGranted(true);
      } else {
        setPermissionsGranted(false);

        Alert.alert(
          I18n.t(ext('missingPermissionsTitle')),
          I18n.t(ext('missingPermissionsMessage')),
          [
            {
              text: I18n.t(ext('openSettings')),
              onPress: openSettingsCallback,
            },
            {
              text: I18n.t(ext('cancel')),
              onPress: navigation.goBack,
              style: 'destructive',
            },
          ],
        );
      }
    });
  }, [navigation.goBack, openSettingsCallback]);

  useEffect(() => {
    requestPermissions(CAMERA, MICROPHONE).then(checkMicAndCameraPermissions);
  }, [checkMicAndCameraPermissions]);

  return permissionsGranted;
};
