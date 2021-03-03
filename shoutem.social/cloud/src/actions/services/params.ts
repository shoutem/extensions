import _ from 'lodash';

export function formatParams(paramsObject: object): String {
  let params = 'version=59';

  _.forOwn(paramsObject, (value, key) => {
    params += `&${key}=${encodeURIComponent(value)}`;
  });

  return params;
}
