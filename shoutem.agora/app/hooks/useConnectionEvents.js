import { useCallback, useEffect } from 'react';

export const useConnectionEvents = ({
  RtcEngine,
  setRemoteUserJoined,
  setConnectionSuccess,
}) => {
  const onLocalUserJoined = useCallback(() => {
    setConnectionSuccess(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLocalUserLeft = useCallback(() => {
    setRemoteUserJoined(false);
    setConnectionSuccess(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemoteUserJoined = useCallback(() => {
    setRemoteUserJoined(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemoteUserLeft = useCallback(() => {
    setRemoteUserJoined(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title34
    RtcEngine.addListener('onJoinChannelSuccess', onLocalUserJoined);
    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title37
    RtcEngine.addListener('onLeaveChannel', onLocalUserLeft);
    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title70
    RtcEngine.addListener('onUserJoined', onRemoteUserJoined);
    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengineeventhandler.html#ariaid-title73
    RtcEngine.addListener('onUserOffline', onRemoteUserLeft);

    return () => {
      RtcEngine.removeListener('onJoinChannelSuccess', onLocalUserJoined);
      RtcEngine.removeListener('onLeaveChannel', onLocalUserLeft);
      RtcEngine.removeListener('onUserJoined', onRemoteUserJoined);
      RtcEngine.removeListener('onUserOffline', onRemoteUserLeft);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
