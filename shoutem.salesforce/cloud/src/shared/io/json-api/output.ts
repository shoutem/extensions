import URI from 'urijs';
import _ from 'lodash';
import { get, getPage, getStatus, getMeta } from '../io';
import { Status } from '../status';
import { asyncMiddleware } from '../../express';

/**
 * Sets response status to `200 OK`.
 *
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} true if the request body should be
 *   serialized, false otherwise.
 */
function prepareResponse200(req, res) {
  res.status(200);
  return true;
}

/**
 * Sets response `Location` header and status to `201 Created`.
 *
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} true if the request body should be
 *   serialized, false otherwise.
 */
function prepareResponse201(req, res, idName) {
  const resource = get(res);
  const resourceId = _.get(resource, idName);
  if (_.isUndefined(resourceId)) {
    const message = 'Failed to prepare response 201: resource has no id';
    throw new Error(message);
  }

  const location: URI = URI(req.url).segment(String(resourceId)).path();

  res.set('Location', location);
  res.status(201);
  return true;
}

/**
 * Sets response status to `204 No Content`.
 *
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} true if the request body should be
 *   serialized, false otherwise.
 */
function prepareResponse204(req, res) {
  res.status(204);
  return false;
}

/**
 * Prepares the response for a given status.
 *
 * @param status The response status.
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} true if the request body should be
 *   serialized, false otherwise.
 */
function prepareResponse(status, req, res, idName) {
  switch (status) {
    case Status.CREATED:
      return prepareResponse201(req, res, idName);
    case Status.NO_CONTENT:
      return prepareResponse204(req, res);
    default:
      return prepareResponse200(req, res);
  }
}

/**
 * Sets the Content-Type specified by JSON API spec.
 *
 * @param res The response object.
 */
function setResponseHeaders(res) {
  res.set('Content-Type', 'application/vnd.api+json');
}

/**
 * Create topLevelLinks property for options object if request have paging options set
 *
 * @param req The request object.
 * @param res The response object.
 */
function resolvePaginationLinks(req, res) {
  const page = getPage(res);
  if (!page) {
    return null;
  }
  const offset = parseInt(page.offset, 10);
  const limit = parseInt(page.limit, 10);
  if (!_.isFinite(page.offset) || !_.isFinite(page.limit) || _.isNil(page.hasNext)) {
    return null;
  }

  const url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;

  let prev = null;
  let next = null;

  const uri = new URI(url);

  if (offset > 0) {
    uri.setQuery('page[offset]', offset - limit);
    uri.setQuery('page[limit]', limit);

    prev = uri.toString();
  }

  if (page.hasNext && page.hasNext.toString().toLowerCase() === 'true') {
    uri.setQuery('page[offset]', offset + limit);
    uri.setQuery('page[limit]', limit);

    next = uri.toString();
  }

  return { prev, next };
}

function parseInclude(req) {
  const reqInclude = req.query.include;
  if (!_.isNil(reqInclude)) {
    return _.compact(_.map(req.query.include.split(','), _.trim));
  }
  return null;
}

/**
 * Initializes a middleware that can generate the JSON API
 * compliant response. This method uses the data from
 * `res.locals.io` object. Currently used values in that object are:
 * - data: contains the models that will be serialized in the response
 * - status: specifies the response status details/flow, can be one of:
 *   - created: returns the 201 Created response
 *   - no-content: returns the 204 No Content response
 *   - (all other cases): returns the 200 Ok response
 *
 * @param type The name of the JSON API data type.
 * @param options Serialization options (https://github.com/SeyZ/jsonapi-serializer)
 * @returns {function()} The output middleware.
 */
export function createOutputMiddleware(serializer, type, options) {
  return asyncMiddleware(async (req, res) => {
    const data = get(res);
    const status = getStatus(res);

    const shouldSerializeData = prepareResponse(status, req, res, serializer.getTypeIdName(type));
    if (!shouldSerializeData) {
      res.end();
      return;
    }

    setResponseHeaders(res);
    if (!data) {
      const message = 'Serialization failed: no data to serialize';
      throw new Error(message);
    }

    const extraSerializationData = {
      paginationLinks: resolvePaginationLinks(req, res),
      meta: getMeta(res),
    };

    const include = parseInclude(req) || _.get(options, 'defaultInclude') || [];
    const serializedData = await serializer.serialize(type, data, extraSerializationData, { include }, req);

    res.json(serializedData);
  });
}
