import _ from 'lodash';
import { PERMISSION_RESULT_TYPES } from '../const';

const RESULTS = {
  UNAVAILABLE: 'unavailable',
  BLOCKED: 'blocked',
  DENIED: 'denied',
  GRANTED: 'granted',
  LIMITED: 'limited',
};

const { DENIED } = PERMISSION_RESULT_TYPES;

function openDeviceSettings() {}

function check() {
  return Promise.resolve(DENIED);
}

function request() {
  return Promise.resolve(DENIED);
}

function requestMultiple(...permissions) {
  return Promise.resolve(
    _.reduce(
      permissions,
      (result, permission) => {
        return {
          ...result,
          [permission]: DENIED,
        };
      },
      {},
    ),
  );
}

function checkMultiple(...permissions) {
  return Promise.resolve(
    _.reduce(
      permissions,
      (result, permission) => {
        return {
          ...result,
          [permission]: DENIED,
        };
      },
      {},
    ),
  );
}

function checkNotifications() {
  return Promise.resolve({ status: DENIED });
}

function requestNotifications() {
  return Promise.resolve({ status: DENIED });
}

// this function checks statuses of one or more permissions.
export function checkPermissions(...permissions) {
  const isMultiplePermissions = permissions.length > 1;

  if (isMultiplePermissions) {
    return checkMultiple(permissions).catch(error => {
      console.log(`Check ${permissions} permissions failed:`, error);
    });
  }

  return check(_.head(permissions)).catch(error => {
    console.log(`Check ${permissions} permission failed:`, error);
  });
}

// this function checks the status of one or more permissions and requests permissions only for those that are DENIED (not requested yet).
export function requestPermissions(...permissions) {
  let resolvedPermissions = {};
  const deniedPermissions = [];

  const checkPermissions = _.map(permissions, permission =>
    check(permission)
      .then(result => {
        resolvedPermissions = { ...resolvedPermissions, [permission]: result };
        if (result === DENIED) {
          deniedPermissions.push(permission);
        }
      })
      .catch(error => {
        console.log(`Check ${permission} permission failed:`, error);
      }),
  );

  return Promise.all(checkPermissions).then(() => {
    if (_.isEmpty(deniedPermissions)) {
      return resolvedPermissions;
    }

    if (deniedPermissions.length > 1) {
      return requestMultiple(deniedPermissions)
        .then(result => {
          return { ...resolvedPermissions, ...result };
        })
        .catch(error => {
          console.log(
            `Request ${deniedPermissions} permissions failed:`,
            error,
          );
        });
    }

    return request(_.head(deniedPermissions))
      .then(result => {
        return { ...resolvedPermissions, [_.head(deniedPermissions)]: result };
      })
      .catch(error => {
        console.log(`Request ${deniedPermissions} permission failed:`, error);
      });
  });
}

export {
  check,
  checkNotifications,
  openDeviceSettings,
  openDeviceSettings as openSettings,
  request,
  requestNotifications,
  RESULTS,
};
