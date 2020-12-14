import _ from 'lodash';

export function getFormState(state) {
  return _.get(state, 'form', {});
}
