import { useEffect, useRef } from 'react';
import createAgoraRtcEngine, { ChannelProfileType } from 'react-native-agora';

export const useCreateEngine = appId => {
  const RtcEngine = useRef(createAgoraRtcEngine()).current;

  useEffect(() => {
    if (!appId) {
      // eslint-disable-next-line no-console
      console.error('Agora AppId not provided.');
    }

    if (!RtcEngine) {
      // eslint-disable-next-line no-console
      console.error('Failed to create Agora Rtc Engine.');
    }

    if (appId && RtcEngine) {
      // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#ariaid-title15
      RtcEngine.initialize({
        appId,
        // Should use ChannelProfileLiveBroadcasting on most of cases
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });
    }

    // api-ref.agora.io/en/voice-sdk/react-native/4.x/API/class_irtcengine.html#api_irtcengine_release
    return () => RtcEngine.release();
  }, [appId, RtcEngine]);

  return RtcEngine;
};
