export const SET_VERIFICATION_COMPLETED = 'SET_VERIFICATION_COMPLETED';

export function setVerificationCompleted(payload) {
  return {
    type: SET_VERIFICATION_COMPLETED,
    payload,
  };
}
