import _ from 'lodash';
import { Request } from 'express';
import contentType from 'content-type';
import { set, setFilter, setSort, setPage } from '../io';
import { IoError } from '../io-error';
import { asyncMiddleware } from '../../express';

const jsonApiContentType = 'application/vnd.api+json';
const supportedContentTypes = [jsonApiContentType, '*/*', '*'];

/* will match:

    (
        ".*?"       double quotes + anything but double quotes + double quotes
        |           OR
        [^",\s]+    1 or more characters excl. double quotes, comma or spaces of any kind
    )
    (?=             FOLLOWED BY
        \s*,        0 or more empty spaces and a comma
        |           OR
        \s*$        0 or more empty spaces and nothing else (end of string)
    )

  should split string by comma, except if comma is in double quotes
  i.e. `ante, marko,"mate,slavko",sime` should be ['ante', 'marko', 'mate,slavko', 'sime']
*/
const commaSplitPattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;

function splitByNonQuotedComma(str: string): string[] {
  const tokens = str.match(commaSplitPattern);
  if (!tokens) {
    return ['str'];
  }

  return tokens;
}

/*
 * Calls the error handler if client did not send the correct "Accept" header.
 */
function validateRequestHeaders(req) {
  const acceptHeader = req.get('Accept') || '';
  const contentTypes: string[] = [];
  // Remove (optional) quality value from each accepted type.
  // https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.9
  const acceptHeaderTokens: string[] = acceptHeader.split(',');
  _.forEach(acceptHeaderTokens, (type) => {
    contentTypes.push(type.split(';')[0]);
  });

  const acceptedContentTypes = _.intersection(contentTypes, supportedContentTypes);
  if (_.isEmpty(acceptedContentTypes)) {
    const message = 'Client does not accept JSON API responses. ' + 'Did you set the correct "Accept" header?';
    throw new IoError(message, 'io_acceptHeaderInvalid');
  }
}

/**
 * Returns true if the request has a JSON API content.
 *
 * @param req The request.
 * @returns {boolean} true if the request has a JSON API content,
 *   false otherwise.
 */
function hasJsonApiPayload(req) {
  try {
    return contentType.parse(req.get('Content-Type')).type === jsonApiContentType;
  } catch (e) {
    return false;
  }
}

function validateResource(resource, type: string, index?) {
  const requiredPaths = ['type'];
  _.forEach(requiredPaths, (path) => {
    if (!_.get(resource, path)) {
      if (_.isUndefined(index)) {
        throw new IoError(`"data.${path}" is missing from request body`, 'io_requestBodyInvalid');
      } else {
        throw new IoError(`"data[${index}].${path}" is missing from request body`, 'io_requestBodyInvalid');
      }
    }
  });

  const dataType = resource.type;
  if (dataType !== type) {
    const message = `This endpoint only works with "${type}", type "${dataType}" is not supported`;
    throw new IoError(message, 'io_requestResourceTypeInvalid');
  }
}

/*
 * Throws an error if request specifies JSON API content type, but:
 * - does not conform to JSON API spec, or
 * - specifies the wrong data type.
 */
function validateRequestBody(type: string, req) {
  if (!_.get(req.body, 'data')) {
    throw new IoError('"data" is missing from request body', 'io_requestBodyInvalid');
  }

  if (_.isArray(req.body.data)) {
    _.each(req.body.data, (resource, index) => {
      validateResource(resource, type, index);
    });
  } else {
    validateResource(req.body.data, type);
  }
}

/**
 * Parses filter query from the request (if exists)
 *
 * @param req The incoming request
 */
function parseFilter(req) {
  const filter = _.get(req, 'query.filter');
  if (filter) {
    const processedFilter = _.cloneDeep(filter);
    _.forEach(_.keys(processedFilter), (key) => {
      const tokens = splitByNonQuotedComma(processedFilter[key]);
      if (tokens && tokens.length > 1) {
        processedFilter[key] = tokens;
      }
    });

    return processedFilter;
  }

  return null;
}

/**
 * Parses sort query from the request (if exists)
 *
 * @param req The incoming request
 */
function parseSort(req) {
  if (_.get(req, 'query.sort')) {
    return _.map(req.query.sort.split(','), _.trim);
  }
  return null;
}

/**
 * Parses page query from the request (if exists)
 *
 * @param req The incoming request
 */
function parsePage(req) {
  if (_.get(req, 'query.page')) {
    const queryPage = req.query.page;

    if (_.has(queryPage, 'limit')) {
      _.set(queryPage, 'limit', _.toNumber(queryPage.limit));
    }

    if (_.has(queryPage, 'offset')) {
      _.set(queryPage, 'offset', _.toNumber(queryPage.offset));
    }

    const allowedPageFields = ['limit', 'offset'];
    Object.keys(queryPage).forEach((field) => {
      if (!allowedPageFields.find((item) => item === field)) {
        const message = 'Pagination error: Page field not allowed';
        throw new IoError(message, 'io_pageFieldInvalid');
      }

      if (!_.isFinite(queryPage[field])) {
        const message = 'Pagination error: Page field must be a number';
        throw new IoError(message, 'io_pageFieldInvalid');
      }

      if (queryPage[field] < 0) {
        const message = 'Pagination error: Page field must be positive number or zero';
        throw new IoError(message, 'io_pageFieldInvalid');
      }
    });

    return queryPage;
  }
  return null;
}

/**
 * Initializes a middleware that validates and parses the data from
 * the JSON API request. This middleware validates the request headers,
 * and body, if it exists. If the request is valid, the middleware will
 * also deserialize the request body and save it into `req.locals.io.data`
 * property.
 *
 * @param type The name of the JSON API data type.
 * @param options Deserialization options (https://github.com/SeyZ/jsonapi-serializer)
 * @returns {function()} The input middleware.
 */
export function createInputMiddleware(serializer, type?) {
  return asyncMiddleware(async (req: Request) => {
    validateRequestHeaders(req);

    const filter = parseFilter(req);
    if (filter) {
      setFilter(req, filter);
    }

    const sort = parseSort(req);
    if (sort) {
      setSort(req, sort);
    }

    const page = parsePage(req);
    if (page) {
      setPage(req, page);
    }

    if (type && hasJsonApiPayload(req)) {
      validateRequestBody(type, req);
      const data = await serializer.deserialize(type, req.body);
      set(req, data);
    }
  });
}
