const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const cameraPermissionRationale =
  "show your camera to the person you're speaking to";
const microphonePermissionRationale = 'record audio for the video call';

const permissions = [
  { type: PERMISSION_TYPES.IOS_CAMERA, rationale: cameraPermissionRationale },
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: cameraPermissionRationale,
  },
  {
    type: PERMISSION_TYPES.IOS_MICROPHONE,
    rationale: microphonePermissionRationale,
  },
  {
    type: PERMISSION_TYPES.ANDROID_RECORD_AUDIO,
    rationale: microphonePermissionRationale,
  },
  {
    type: PERMISSION_TYPES.FOREGROUND_SERVICE_CAMERA,
  },
  {
    type: PERMISSION_TYPES.FOREGROUND_SERVICE_MICROPHONE,
  },
];

module.exports = { permissions };
