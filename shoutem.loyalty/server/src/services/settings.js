import _ from 'lodash';
import { loyaltyApi } from 'src/services';
import { cmsApi } from 'src/modules/cms';

export function getProgramId(settings) {
  const program = _.get(settings, 'program', {});
  return _.get(program, 'id', null);
}

export function initializeApiEndpoints(settings) {
  const apiEndpoint = _.get(settings, 'apiEndpoint');
  const cmsEndpoint = _.get(settings, 'cmsEndpoint');

  if (!loyaltyApi.isInitialized()) {
    loyaltyApi.init(apiEndpoint);
  }

  if (!cmsApi.isInitialized()) {
    cmsApi.init(cmsEndpoint);
  }
}
