import _ from 'lodash';
import URI from 'urijs';

const genericValuesRegex = new RegExp('[^{{]+(?=}})', 'g');

function parseGenericValues(string) {
  if (!string) {
    return [];
  }

  return string.match(genericValuesRegex);
}

export function parseUrl(url, ownUser) {
  let parsedUrl = decodeURIComponent(url);

  const { path, query } = URI.parse(parsedUrl);

  const genericValuesInPath = parseGenericValues(path);
  const genericValuesInQuery = parseGenericValues(query);

  if (!genericValuesInPath && !genericValuesInQuery) {
    return parsedUrl;
  }

  _.forEach(genericValuesInPath, valuePath => {
    const userValue = _.get(ownUser, `${valuePath}`, null);

    parsedUrl = parsedUrl.replace(
      `/{{${valuePath}}}`,
      !userValue ? '' : `/${userValue}`,
    );
  });

  _.forEach(genericValuesInQuery, valuePath => {
    const userValue = _.get(ownUser, `${valuePath}`, null);

    // _.isEmpty(value) -> we want empty strings to be parsed as null in query
    const userValueForQueryParam = _.isEmpty(userValue) ? null : userValue;

    parsedUrl = parsedUrl.replace(`{{${valuePath}}}`, userValueForQueryParam);
  });

  return parsedUrl;
}
