import pack from './package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const SENDBIRD_SCREEN_ID = 'shoutem.sendbird.ChatWindowScreen';
export const AGORA_SCREEN_ID = 'shoutem.agora.VideoCallScreen';
export const CONFIRM_DELETION_SCREEN = 'shoutem.auth.ConfirmDeletionScreen';

export const PROFILE_HEADER_FIELDS = ['name', 'nick', 'image'];
// Fields we want to show, but not edit
export const NON_EDITABLE_FIELDS = ['nick'];
