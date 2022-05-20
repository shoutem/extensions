import _ from 'lodash';
import { cmsApi } from 'src/modules/cms';
import { loyaltyApi } from 'src/services';

export function getProgramId(settings) {
  const program = _.get(settings, 'program', {});
  return _.get(program, 'id', null);
}

export function initializeApiEndpoints(settings) {
  const apiEndpoint = _.get(settings, 'services.core.loyalty');
  const cmsEndpoint = _.get(settings, 'services.core.cms');

  if (!loyaltyApi.isInitialized()) {
    loyaltyApi.init(apiEndpoint);
  }

  if (!cmsApi.isInitialized()) {
    cmsApi.init(cmsEndpoint);
  }
}
