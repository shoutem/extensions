import { responsiveHeight, responsiveWidth } from '@shoutem/ui';
import { isAndroid } from 'shoutem-core';

export default () => ({
  'shoutem.agora.CallInfo': {
    container: {
      position: 'absolute',
      bottom: responsiveHeight(150),
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    remoteMutedContainer: {
      height: responsiveHeight(25),
      width: responsiveHeight(25),
      borderRadius: responsiveHeight(12),
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    remoteMutedIcon: {
      width: responsiveHeight(15),
      height: responsiveHeight(15),
      color: '#000',
    },
    remoteUserName: {
      alignSelf: 'center',
      color: '#FFF',
      fontSize: responsiveHeight(20),
    },
    stopwatchContainer: { height: responsiveHeight(30) },
    stopwatch: {
      container: {
        paddingVertical: responsiveHeight(5),
        backgroundColor: 'transparent',
        alignSelf: 'center',
      },
      text: {
        fontSize: responsiveHeight(15),
        color: '#FFF',
        marginLeft: responsiveWidth(7),
      },
    },
  },

  'shoutem.agora.CloseButton': {
    container: {
      backgroundColor: '#000',
      width: responsiveHeight(40),
      height: responsiveHeight(40),
      borderRadius: responsiveHeight(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: isAndroid ? responsiveHeight(30) : 0,
    },
    closeButton: {
      color: '#FFF',
      width: responsiveHeight(20),
      height: responsiveHeight(20),
    },
  },

  'shoutem.agora.Controls': {
    container: {
      position: 'absolute',
      bottom: responsiveHeight(50),
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    controlButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    videoButton: {
      height: responsiveHeight(50),
      width: responsiveHeight(50),
      borderRadius: responsiveHeight(25),
      backgroundColor: 'white',
      margin: responsiveHeight(15),
    },
    videoIcon: {
      width: responsiveHeight(24),
      height: responsiveHeight(24),
      color: '#000',
    },
    mutedIconColor: {
      color: '#FF5858',
    },
    callButton: {
      height: responsiveHeight(70),
      width: responsiveHeight(70),
      borderRadius: responsiveHeight(35),
      margin: responsiveHeight(15),
    },
    startCallButton: {
      backgroundColor: '#00B300',
    },
    endCallButton: {
      backgroundColor: '#FF5858',
    },
    startCallIcon: {
      color: '#FFF',
      width: responsiveHeight(24),
      height: responsiveHeight(24),
      transform: [{ rotate: '220deg' }],
    },
    endCallIcon: {
      width: responsiveHeight(24),
      height: responsiveHeight(24),
      color: '#000',
    },
    audioButton: {
      height: responsiveHeight(50),
      width: responsiveHeight(50),
      borderRadius: responsiveHeight(25),
      backgroundColor: '#FFFFFF',
      margin: responsiveHeight(15),
    },
    audioIcon: {
      width: responsiveHeight(24),
      height: responsiveHeight(24),
      color: '#000',
    },
  },

  'shoutem.agora.LocalVideoView': {
    container: {
      position: 'absolute',
      width: responsiveWidth(115),
      height: responsiveHeight(161),
      right: responsiveWidth(15),
      zIndex: 1,
      elevation: 1,
    },
    localVideo: {
      overflow: 'hidden',
      flex: 1,
      borderRadius: 6,
      backgroundColor: '#000',
    },
    localProfileImage: {
      image: {
        width: responsiveHeight(50),
        height: responsiveHeight(50),
        borderRadius: responsiveHeight(25),
      },
    },
    switchCameraButton: {
      position: 'absolute',
      bottom: responsiveWidth(5),
      right: responsiveWidth(5),
      height: responsiveHeight(32),
      width: responsiveHeight(32),
      borderRadius: responsiveHeight(16),
      backgroundColor: 'white',
      alignSelf: 'flex-start',
    },
    switchCameraIcon: {
      textAlign: 'center',
      width: responsiveHeight(24),
      height: responsiveHeight(24),
      color: '#000',
    },
    androidTopMargin: {
      marginTop: responsiveHeight(30),
    },
  },

  'shoutem.agora.ProfileImage': {
    image: {
      width: responsiveHeight(150),
      height: responsiveHeight(150),
      borderRadius: responsiveHeight(75),
    },
  },

  'shoutem.agora.VideoCallView': {
    container: {
      backgroundColor: '#222222',
      flex: 1,
    },
  },

  'shoutem.agora.WaitingForRemoteUserView': {
    container: {
      backgroundColor: '#222222',
      flex: 1,
    },
    localVideo: { flex: 1 },
    message: {
      flex: 1,
      marginHorizontal: responsiveWidth(20),
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
        fontSize: responsiveHeight(20),
      },
    },
  },

  'shoutem.agora.VideoCallScreen': {
    container: {
      flex: 1,
      backgroundColor: '#222222',
    },
    linearGradient: {
      style: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 },
      colors: [
        'rgba(0, 0, 0, 0.5)',
        'rgba(0, 0, 0, 0.05)',
        'rgba(0, 0, 0, 0.01)',
        'rgba(0, 0, 0, 0)',
      ],
      start: { x: 0, y: 1 },
      end: { x: 0, y: 0 },
    },
  },
});
