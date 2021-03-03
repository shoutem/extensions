import _ from 'lodash';
import Raven from 'raven';
import { getLocals } from '../express';
import { ForbiddenError, NotFoundError, ValidationError, NotAuthorizedError } from '../error/errors';
import config from './config';

Raven.config({
  parseUser(req) {
    return _.pick(getLocals(req, 'auth.account'), ['id', 'userUid', 'email', 'roles']);
  },
}).install();

export function captureException(error, ...args) {
  const internalError = _.get(error, 'errors.0.meta.trace') || _.get(error, 'internalError') || error;

  Raven.captureException(internalError, ...args);
}

const defaultOptions = {
  errorTypeBlacklist: [ForbiddenError, NotFoundError, ValidationError, NotAuthorizedError],
  errorTypeWhitelist: [],
};

function shouldRecordError(err, options) {
  const whitelist = options.errorTypeWhitelist;
  const isWhitelistMatch = !!_.find(whitelist, (errType) => err instanceof errType);
  if (isWhitelistMatch) {
    return isWhitelistMatch;
  }

  const blacklist = options.errorTypeBlacklist;
  const blacklistMatch = _.find(blacklist, (errType) => err instanceof errType);

  return !blacklistMatch;
}

/**
 *
 * @param options Object containing options. errorTypeBlacklist is an array of error types which should be ignored
 * errorTypeWhitelist, if defined, will override errorTypeBlacklist and only error types from the whitelist will
 * be logged.
 * @returns {Function}
 */
export function sentryMiddleware(options = {}) {
  const resolvedOptions = _.mergeWith({}, defaultOptions, options, (one, another) => {
    if (Array.isArray(one) && Array.isArray(another)) {
      return _.concat(one, another);
    }

    return options;
  });

  return (err, req, res, next) => {
    const { serviceName } = config;
    const tags: { service?: string } = {};

    if (!_.isNil(serviceName)) {
      tags.service = serviceName;
    }

    if (err && shouldRecordError(err, resolvedOptions)) {
      captureException(err, { req, tags });
    }

    next(err);
  };
}
