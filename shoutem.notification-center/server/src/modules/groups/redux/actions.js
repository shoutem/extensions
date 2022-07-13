import ext from 'src/const';
import { shoutemUrls } from 'src/services';
import { find, invalidate } from '@shoutem/redux-io';
import { GROUPS } from '../const';

export function loadGroups(appId) {
  const config = {
    schema: GROUPS,
    request: {
      endpoint: shoutemUrls.legacyApi(`${appId}/notifications/objects/Group`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('groupsPage'));
}

export function createGroup(appId, group) {
  return dispatch => {
    const config = {
      schema: GROUPS,
      request: {
        endpoint: shoutemUrls.legacyApi(`${appId}/notifications/objects/Group`),
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify(group),
      },
    };

    return dispatch(find(config, ext('groupsPage-create'))).then(() => {
      dispatch(invalidate(GROUPS));
    });
  };
}

export function updateGroup(appId, groupId, updatePatch) {
  return dispatch => {
    const item = {
      id: groupId,
      ...updatePatch,
    };

    const config = {
      schema: GROUPS,
      request: {
        endpoint: shoutemUrls.legacyApi(
          `${appId}/notifications/objects/Group/${groupId}`,
        ),
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify(item),
      },
    };

    return dispatch(find(config, ext('groupsPage-update'))).then(() => {
      dispatch(invalidate(GROUPS));
    });
  };
}

export function deleteGroup(appId, groupId) {
  return dispatch => {
    const config = {
      schema: GROUPS,
      request: {
        endpoint: shoutemUrls.legacyApi(
          `${appId}/notifications/objects/Group/${groupId}`,
        ),
        method: 'DELETE',
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    return dispatch(find(config, ext('groupsPage-delete'))).then(() => {
      dispatch(invalidate(GROUPS));
    });
  };
}
