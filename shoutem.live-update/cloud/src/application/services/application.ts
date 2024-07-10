import { AuthData } from '../../shared/auth';
import { errors } from '../../shared/error';
import applicationRepository from '../data/application-repository';

const APPLICATION_SCHEMA = 'shoutem.core.applications';

export async function isAllowedForApplication(action: string, id: string | undefined, authData: AuthData) {
  if (!id) {
    throw new errors.ForbiddenError();
  }

  if (authData.securityContext.isAllowed(action, APPLICATION_SCHEMA, { id })) {
    return;
  }

  // this is a fallback for app owners as they don't have app ids in the token, they have owner id
  // covering the case when app owner is previewing app in disclose
  // get application from app manager, we need owner id of the app
  const application = await applicationRepository.getApplication(id, authData.token);
  if (authData.securityContext.isAllowed(action, APPLICATION_SCHEMA, application)) {
    return;
  }

  throw new errors.ForbiddenError();
}
