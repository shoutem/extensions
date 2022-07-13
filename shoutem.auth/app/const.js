// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const COMPLETE_REGISTRATION_TRIGGER = ext('complete-registration');

export const SENDBIRD_SCREEN_ID = 'shoutem.sendbird.ChatWindowScreen';
export const AGORA_SCREEN_ID = 'shoutem.agora.VideoCallScreen';
