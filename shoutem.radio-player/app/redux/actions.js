import { ext } from '../../../shoutem.audio/app/const';

export const SET_RADIO_METADATA = ext('SET_RADIO_METADATA');
export const REMOVE_RADIO_METADATA = ext('REMOVE_RADIO_METADATA');

export function setRadioMetadata(id, metadata) {
  return {
    type: SET_RADIO_METADATA,
    payload: { id, metadata },
  };
}

export function removeRadioMetadata(id) {
  return {
    type: REMOVE_RADIO_METADATA,
    payload: id,
  };
}
