import { AuthData } from '../../shared/auth';
import applicationRepository from '../data/application-repository';

const APPLICATION_SCHEMA = 'shoutem.core.applications';

export async function isAllowedForApplication(action: string, id: string | undefined, authData: AuthData) {
  if (!id) {
    return false;
  }

  if (authData.securityContext.isAllowed(action, APPLICATION_SCHEMA, { id })) {
    return true;
  }

  // this is a fallback for app owners as they don't have app ids in the token, they have owner id
  // covering the case when app owner is previewing app in disclose
  // get application from app manager, we need owner id of the app
  try {
    const application = await applicationRepository.getApplication(id, authData.token);
    if (authData.securityContext.isAllowed(action, APPLICATION_SCHEMA, application)) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}
