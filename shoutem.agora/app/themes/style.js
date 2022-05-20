import { createScopedResolver, Device } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.agora.VideoCallScreen': {
    agoraScreenContainer: {
      flex: 1,
      backgroundColor: '#222222',
    },
  },

  'shoutem.agora.VideoCallStartingView': {
    videoCallStartingView: {
      flex: 1,
      backgroundColor: '#222222',
    },
    peerName: {
      color: 'white',
      fontSize: 20,
    },
    bottomContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: Device.select({
        iPhoneX: 36 + resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: 36 + resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: 20,
      }),
    },
    controlButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
  },

  'shoutem.agora.WaitingForPeerView': {
    waitingForPeerView: {
      backgroundColor: '#222222',
      flex: 1,
    },
    message: {
      flex: 1,
      marginHorizontal: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      'shoutem.ui.Text': {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
      },
    },
    localVideo: {
      flex: 1,
    },
    peerName: {
      color: 'white',
      fontSize: 20,
    },
    bottomContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: Device.select({
        iPhoneX: 36 + resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: 36 + resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: 20,
      }),
    },
  },
  // Agora Video Call View
  'shoutem.agora.VideoCallView': {
    videoCallView: {
      backgroundColor: '#222222',
      flex: 1,
    },
    agoraTwoPeersView: {
      flex: 1,
    },
    peerName: {
      color: 'white',
      fontSize: 20,
    },
    stopwatch: {
      container: {
        paddingVertical: 5,
        backgroundColor: 'transparent',
      },
      text: {
        fontSize: 15,
        color: 'white',
        marginLeft: 7,
      },
    },
    bottomContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: Device.select({
        iPhoneX: 36 + resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: 36 + resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: 20,
      }),
    },
  },

  'shoutem.agora.LocalVideoContainer': {
    localVideoContainer: {
      position: 'absolute',
      width: 115,
      height: 161,
      top: Device.select({
        iPhoneX: 34 + resolveVariable('sizes.iphone.X.notchPadding'),
        iPhoneXR: 30 + resolveVariable('sizes.iphone.XR.notchPadding'),
        default: 30,
      }),
      right: 15,
    },
    localVideo: {
      overflow: 'hidden',
      flex: 1,
      borderRadius: 6,
    },
    switchCameraButton: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      height: 32,
      width: 32,
      borderRadius: 16,
      backgroundColor: 'white',
      alignSelf: 'flex-start',
    },
    switchCameraIcon: {
      textAlign: 'center',
      width: 24,
      height: 24,
      color: 'black',
    },
  },

  'shoutem.agora.ControlButtonsView': {
    controlButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    startCall: {
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: '#00B300',
      margin: 15,
      'shoutem.ui.Icon': {
        transform: [{ rotate: '220deg' }],
        width: 24,
        height: 24,
        color: 'white',
      },
    },
    endCall: {
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: '#FF5858',
      margin: 15,
      'shoutem.ui.Icon': {
        width: 24,
        height: 24,
        color: 'white',
      },
    },
    audioButton: {
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: '#FFFFFF',
      margin: 15,
    },
    audioIcon: {
      width: 24,
      height: 24,
      color: 'black',
    },
    videoButton: {
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: 'white',
      margin: 15,
    },
    videoIcon: {
      width: 24,
      height: 24,
      color: 'black',
    },
    buttonDisabled: {
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: '#FFFFFF33',
      margin: 15,
    },
    iconDisabled: {
      width: 24,
      height: 24,
      color: '#FFFFFF4D',
    },
  },

  'shoutem.agora.ProfileImage': {
    profileImage: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      'shoutem.ui.ImageBackground': {
        height: 145,
        width: 145,
        borderRadius: 72,
        overflow: 'hidden',
      },
    },
  },
});
