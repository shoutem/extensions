export default () => ({
  'shoutem.camera.QRCodeScanner': {
    cameraContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraFocusFrame: {
      // TODO: Reimplement this with relative sizes and test on multiple devices
      width: 175,
      height: 165,
      resizeMode: 'contain',
    },
    cameraView: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    noPermissionsMessage: {
      alignSelf: 'center',
      fontSize: 18,
      lineHeight: 20,
    },
  },
});
