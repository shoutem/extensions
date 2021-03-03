import chai, { assert } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import defaultNotFound from '../default-not-found';
import { NotFoundError } from '../../errors/not-found-error';

chai.use(sinonChai);

describe('defaultNotFound middleware', () => {
  it('throws `NotFoundError` if response headers are not already sent', (done) => {
    const res = {
      headersSent: false,
    };

    defaultNotFound()(null, res, (err) => {
      try {
        assert.instanceOf(err, NotFoundError);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('throws no error if headers sent', () => {
    const res = {
      headersSent: true,
    };
    const next = sinon.spy();

    defaultNotFound()(null, res, next);

    assert.calledWithExactly(next);
  });
});
