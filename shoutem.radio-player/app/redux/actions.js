import { ext } from '../../../shoutem.audio/app/const';

export const SET_TRACK_METADATA = ext('SET_TRACK_METADATA');
export const REMOVE_TRACK_METADATA = ext('REMOVE_TRACK_METADATA');

export function setTrackMetadata(id, metadata) {
  return {
    type: SET_TRACK_METADATA,
    payload: { id, metadata },
  };
}

export function removeTrackMetadata(id) {
  return {
    type: REMOVE_TRACK_METADATA,
    payload: id,
  };
}
