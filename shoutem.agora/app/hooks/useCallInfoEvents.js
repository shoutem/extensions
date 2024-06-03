import { useCallback, useEffect } from 'react';
import { LayoutAnimation } from 'react-native';

export const useCallInfoEvents = ({
  RtcEngine,
  remoteUser,
  setStopwatchStart,
  setStopwatchReset,
  setRemoteAudioMuted,
}) => {
  const onLocalUserLeft = useCallback(() => {
    setStopwatchStart(false);
    setStopwatchReset(true);
    setRemoteAudioMuted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemoteUserJoined = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setStopwatchStart(true);
    setStopwatchReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemoteUserLeft = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setStopwatchStart(false);
    setStopwatchReset(true);
    setRemoteAudioMuted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUserMuteAudio = useCallback(
    (_connection, remoteUid, muted) => {
      if (remoteUid === remoteUser?.id) {
        if (muted) {
          // Do spring animation when remote user mutes themselves.
          LayoutAnimation.spring();
        }

        setRemoteAudioMuted(muted);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    // https://api-ref.agora.io/en/video-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#callback_irtcengineeventhandler_onleavechannel
    RtcEngine.addListener('onLeaveChannel', onLocalUserLeft);
    // https://api-ref.agora.io/en/video-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title70
    RtcEngine.addListener('onUserJoined', onRemoteUserJoined);
    // https://api-ref.agora.io/en/video-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title73
    RtcEngine.addListener('onUserOffline', onRemoteUserLeft);
    // https://api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title71
    RtcEngine.addListener('onUserMuteAudio', onUserMuteAudio);

    return () => {
      RtcEngine.removeListener('onLeaveChannel', onLocalUserLeft);
      RtcEngine.removeListener('onUserJoined', onRemoteUserJoined);
      RtcEngine.removeListener('onUserOffline', onRemoteUserLeft);
      RtcEngine.removeListener('onUserMuteAudio', onUserMuteAudio);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
