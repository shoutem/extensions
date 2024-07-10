import { expect } from 'chai';
import defaultErrorAdapter from '../default-error-adapter';

describe('defaultErrorAdapter', () => {
  describe('serialize', () => {
    it('handles errors of String type', () => {
      const errorIn = 'whatever';
      const errorOut = {
        status: '500',
        title: 'server error',
        meta: {
          trace: JSON.stringify(errorIn),
        },
      };

      const error = defaultErrorAdapter.serialize(errorIn);
      expect(error).to.deep.equal(errorOut);
    });

    it('handles instances of Error', () => {
      const errorIn = new Error('whatever');
      const errorOut = {
        status: '500',
        title: 'server error',
        meta: {
          trace: errorIn.stack,
        },
      };

      const error = defaultErrorAdapter.serialize(errorIn);
      expect(error).to.deep.equal(errorOut);
    });
  });
});
