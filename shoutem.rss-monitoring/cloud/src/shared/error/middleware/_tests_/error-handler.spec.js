import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import errorHandler from '../error-handler';

chai.use(sinonChai);
const { expect } = chai;

function prepareResponse() {
  return {
    json: sinon.spy(),
    status: sinon.stub().returnsThis(),
  };
}

describe('errorHandler middleware', () => {
  it('returns 500 in case of any exceptions in adapter serialization', () => {
    const res = prepareResponse();
    const errorThrowingAdapter = {
      serialize: sinon.stub().throws(new Error('test')),
    };
    const handler = errorHandler({ customAdapters: [errorThrowingAdapter] });
    const next = sinon.spy();

    handler(null, null, res, next);

    const errorsOut = {
      errors: [
        {
          title: 'server error',
          status: '500',
        },
      ],
    };
    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWithExactly(errorsOut);
    expect(next).to.have.been.calledWithExactly(errorsOut);
  });

  it('it uses default adapters, and responds', () => {
    const req = null;
    const next = sinon.spy();
    const res = prepareResponse();
    const handler = errorHandler({
      showFullError: true,
    });
    const err = new Error('hello, world of errors');
    const expectedError = {
      title: 'server error',
      status: '500',
      meta: {
        trace: err.stack,
      },
    };

    handler(err, req, res, next);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWithExactly({ errors: [expectedError] });
    expect(next).to.have.been.calledWithExactly({ errors: [expectedError] });
  });

  it('it uses the given settings to handle the error', () => {
    class MyError {
      constructor(message) {
        this.message = message;
      }
    }
    const expectedError = {
      status: '987',
      title: 'my error',
      detail: 'some error detail which will be removed',
    };
    const req = null;
    const next = sinon.spy();
    const res = prepareResponse();
    const handler = errorHandler({
      customAdapters: [
        {
          serialize: (err) =>
            err instanceof MyError
              ? {
                  status: '987',
                  title: 'my error',
                  detail: 'some error detail which will be removed',
                  meta: { stack: 'stack-trace' },
                }
              : null,
        },
      ],
    });
    const err = new MyError('msg');

    handler(err, req, res, next);

    expect(res.status).to.have.been.calledWith(987);
    expect(res.json).to.have.been.calledWithExactly({ errors: [expectedError] });
    expect(next).to.have.been.calledWithExactly({ errors: [expectedError] });
  });
});
