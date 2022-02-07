import _ from 'lodash';
import { expect } from 'chai';
import httpErrorAdapter from '../http-error-adapter';
import * as errors from '../../errors';

describe('httpErrorAdapter', () => {
  describe('serialize', () => {
    it('passes over errors of String type', () => {
      const errorIn = new Error('whatever');
      const error = httpErrorAdapter.serialize(errorIn);
      expect(error).to.be.null; // eslint-disable-line no-unused-expressions
    });

    it('handles instances of known errors', () => {
      _.forEach(Object.keys(errors), (errType) => {
        const errorIn = new errors[errType]();
        const errorOut = {
          status: errorIn.status,
          title: errorIn.title,
          detail: errorIn.detail,
          meta: {
            trace: errorIn.stack,
          },
        };

        const error = httpErrorAdapter.serialize(errorIn);
        delete error.code;
        expect(error).to.deep.equal(errorOut);
      });
    });
  });
});
