import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application/redux';
import { getUser } from 'shoutem.auth';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import {
  CloseButton,
  Controls,
  LocalVideoView,
  VideoCallView,
  WaitingForRemoteUserView,
} from '../components';
import CallInfo from '../components/CallInfo';
import ProfileImage from '../components/ProfileImage';
import { ext } from '../const';
import {
  useConnectionEvents,
  useCreateEngine,
  usePermissionsGranted,
} from '../hooks';
import * as Agora from '../services/agora';

const VideoCallScreen = props => {
  const { navigation, style } = props;

  useLayoutEffect(() => {
    const headerLeft = () => <CloseButton />;

    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      title: '',
      headerLeft,
    });
  }, [navigation]);

  const ownUser = useSelector(getUser);

  const { user } = getRouteParams(props);

  const { localUser, remoteUser } = useMemo(
    () => Agora.resolveUserData(ownUser, user),
    [ownUser, user],
  );

  const [remoteUserJoined, setRemoteUserJoined] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const [localVideoMuted, setLocalVideoMuted] = useState(false);

  const extensionSettings = useSelector(state =>
    getExtensionSettings(state, ext()),
  );
  const appId = _.get(extensionSettings, 'appId', '');

  const RtcEngine = useCreateEngine(appId);

  useConnectionEvents({
    RtcEngine,
    remoteUser,
    setRemoteUserJoined,
    setConnectionSuccess,
  });

  // User can't go into call if video or audio permissions are not granted.
  const permissionsGranted = usePermissionsGranted();

  useEffect(() => {
    if (permissionsGranted) {
      // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#api_irtcengine_enablevideo
      RtcEngine.enableVideo();

      // Unlike video, audio module is enabled by default.
      // -- DO NOT -- enable it again. Enabling it again would reset entire engine, resulting in slow response times.
      // https://api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title25
    }
  }, [RtcEngine, permissionsGranted]);

  const waitingForRemoteUserView = connectionSuccess && !remoteUserJoined;
  const videoCallEstablished = connectionSuccess && remoteUserJoined;

  return (
    <Screen style={style.container}>
      {!connectionSuccess && <ProfileImage image={remoteUser.profileImage} />}
      {waitingForRemoteUserView && (
        <WaitingForRemoteUserView
          localUser={localUser}
          remoteUser={remoteUser}
          localVideoMuted={localVideoMuted}
        />
      )}
      {videoCallEstablished && (
        <>
          <VideoCallView RtcEngine={RtcEngine} remoteUser={remoteUser} />
          <LocalVideoView
            RtcEngine={RtcEngine}
            localUser={localUser}
            localVideoMuted={localVideoMuted}
          />
        </>
      )}
      <LinearGradient
        colors={style.linearGradient.colors}
        style={style.linearGradient.style}
        start={style.linearGradient.start}
        end={style.linearGradient.end}
      />
      <CallInfo RtcEngine={RtcEngine} remoteUser={remoteUser} />
      <Controls
        RtcEngine={RtcEngine}
        localUser={localUser}
        remoteUser={remoteUser}
        connectionSuccess={connectionSuccess}
        localVideoMuted={localVideoMuted}
        onLocalVideoMuted={setLocalVideoMuted}
      />
    </Screen>
  );
};

VideoCallScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoCallScreen'))(VideoCallScreen);
