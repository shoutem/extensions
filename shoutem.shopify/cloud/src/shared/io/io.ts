import _ from 'lodash';
import { Request, Response } from 'express';
import { Status } from './status';

/* eslint-disable @typescript-eslint/no-explicit-any */

// interface IoRequest extends Request {
//   locals: object;
// }

// interface IoResponse extends Response {
//   locals: object;
// }

/**
 * Returns the IO data from the given express object (req/res).
 *
 * @param target The express request or response.
 * @returns {*} The IO data.
 */
export function get(target: Request | Response) {
  return _.get(target, 'locals.io.data');
}

/**
 * Returns the IO status from the given express object (req/res).
 *
 * @param target The express request or response.
 * @returns {string} The IO status.
 */
export function getStatus(target: Request | Response) {
  // The default IO status is ok
  return _.get(target, 'locals.io.status', Status.OK);
}

/**
 * Sets the IO object and status on the given express
 * object (req/res).
 *
 * @param target The express request or response.
 * @param data The IO data to set.
 * @param status The IO status to set, defaults to OK.
 */
export function set(target: any, data: any, status = Status.OK) {
  if (!target.locals) {
    target.locals = {};
  }

  if (!target.locals.io) {
    target.locals.io = {};
  }

  target.locals.io.data = data;
  target.locals.io.status = status;
}

/**
 * Sets the IO object with the status CREATED on the
 * given express object (req/res).
 *
 * @param target The express request or response.
 * @param data The IO data to set.
 */
export function setCreated(target, data) {
  set(target, data, Status.CREATED);
}

/**
 * Sets an empty response on the given express object (req/res).
 * This method will clear any existing IO data, and set the status
 * to NO_CONTENT.
 *
 * @param target The express request or response.
 */
export function setEmpty(target) {
  set(target, null, Status.NO_CONTENT);
}

/**
 * Sets a filter field in given object.
 *
 * @param target The express object given
 * @param filter The filter object to set
 */
export function setFilter(target, filter) {
  if (!target.locals) {
    target.locals = {};
  }

  if (!target.locals.io) {
    target.locals.io = {};
  }

  target.locals.io.filter = filter;
}

/**
 * Returns filter field from given object
 *
 * @param target The express object
 * @returns {*} Filter field of given object
 */
export function getFilter(target) {
  return _.get(target, 'locals.io.filter');
}

/**
 * Sets a sort field in given object.
 *
 * @param target The express object given
 * @param sort The sort object to set
 */
export function setSort(target, sort) {
  if (!target.locals) {
    target.locals = {};
  }

  if (!target.locals.io) {
    target.locals.io = {};
  }

  target.locals.io.sort = sort;
}

/**
 * Returns sort field from given object
 *
 * @param target The express object
 * @returns {*} Sort field of given object
 */
export function getSort(target) {
  return _.get(target, 'locals.io.sort');
}

/**
 * Sets a page field in given object.
 *
 * @param target The express object given
 * @param page The page object to set
 */
export function setPage(target, page) {
  if (!target.locals) {
    target.locals = {};
  }

  if (!target.locals.io) {
    target.locals.io = {};
  }

  target.locals.io.page = page;
}

/**
 * Returns page field from given object
 *
 * @param target The express object
 * @returns {*} Page field of given object
 */
export function getPage(target) {
  return _.get(target, 'locals.io.page');
}

/**
 * Returns page field from given object
 *
 * @param target The express object
 * @param defaultLimit Default limit used if not defined in request. Fallback for this default is 20.
 * @returns {*} Page field of given object
 */
export function getPageOrDefault(target, defaultLimit = 20) {
  const page = getPage(target) || {};
  return {
    offset: 0,
    limit: defaultLimit,
    ...page,
  };
}

/**
 * Sets a meta field in given object.
 *
 * @param target The express object given
 * @param meta The meta object to set
 */
export function setMeta(target, meta) {
  if (!target.locals) {
    target.locals = {};
  }

  if (!target.locals.io) {
    target.locals.io = {};
  }

  target.locals.io.meta = meta;
}

/**
 * Returns meta field from given object
 *
 * @param target The express object
 * @returns {*} Meta field of given object
 */
export function getMeta(target) {
  return _.get(target, 'locals.io.meta');
}

/**
 * Returns query parameter field from given request object
 *
 * @param target The express object
 * @returns {*} Query parameter value of given object
 */
export function getQueryParam(target, name) {
  return _.get(target, `query.${name}`);
}
