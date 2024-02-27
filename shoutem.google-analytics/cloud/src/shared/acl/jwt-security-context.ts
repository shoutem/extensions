import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import queryParser from 'mongo-parse';
import gzip from 'gzip-js';
import { SecurityContext } from './security-context';

export default class JwtSecurityContext implements SecurityContext {
  private tokenPayload: object;

  constructor(token) {
    try {
      this.tokenPayload = jwtDecode(token);

      const aclPayload = _.get(this.tokenPayload, 'acl', []);
      if (_.isObject(aclPayload)) {
        const compressionType = _.get(aclPayload, 'ct');

        if (compressionType === 'gzip') {
          const value = _.get(aclPayload, 'v') || '';
          const base64Decoded = Buffer.from(value, 'base64');
          const decompressed = gzip.unzip(base64Decoded);
          const decoded = JSON.parse(Buffer.from(decompressed).toString());

          _.set(this.tokenPayload, 'acl', decoded);
        }
      }
    } catch (e) {
      this.tokenPayload = {};
    }
  }

  isAllowed(action, resourceType, resource = {}, condition = {}) {
    if (!_.isString(action)) {
      throw new TypeError(`Invalid action. Expected a string, but got ${typeof action}.`);
    }
    if (!_.isString(resourceType)) {
      throw new TypeError(`Invalid resource type. Expected a string, but got ${typeof resourceType}.`);
    }
    if (!_.isObject(resource)) {
      throw new TypeError(`Invalid resource. Expected a object, but got ${typeof resource}.`);
    }
    if (!_.isObject(condition)) {
      throw new TypeError(`Invalid condition. Expected a object, but got ${typeof condition}.`);
    }

    // do not perform ACL check when resource does not pass specified condition
    if (!this._matches(resource, condition)) {
      return true;
    }

    // do not perform ACL check for unauthenticated
    if (!this.tokenPayload) {
      return false;
    }

    const acl: any = this.getAcl();

    return _.some(
      acl,
      p => p.resource === resourceType && _.includes(p.actions, action) && this._matches(resource, p.condition || {}),
    );
  }

  getAcl() {
    return _.get(this.tokenPayload, 'acl', []);
  }

  _encodeDots(object) {
    return this._mapDeep(object, obj => _.mapKeys(obj, (val, key) => key.replace(/\./g, '[dot]')));
  }

  _matches(object, condition) {
    let conditionQuery;
    try {
      conditionQuery = queryParser.parse(condition);
    } catch (e) {
      return false;
    }
    return conditionQuery.matches(this._encodeDots(object));
  }

  _mapDeep(obj, mapper) {
    return mapper(
      _.mapValues(obj, v => {
        if (_.isPlainObject(v)) {
          return this._mapDeep(v, mapper);
        } else if (_.isArray(v)) {
          return _.map(v, elem => this._mapDeep(elem, mapper));
        } else if (_.isSet(v)) {
          return new Set(_.map(_.toArray(v), elem => this._mapDeep(elem, mapper)));
        }
        return v;
      }),
    );
  }
}
