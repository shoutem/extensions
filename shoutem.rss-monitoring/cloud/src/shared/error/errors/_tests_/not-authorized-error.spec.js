import chai from 'chai';
import { NodeError } from '../node-error';
import { HttpError } from '../http-error';
import { NotAuthorizedError } from '../not-authorized-error';

const { expect } = chai;

describe('NotAuthorizedError', () => {
  it('should inherit from http error and have 401 status', () => {
    const naErr = new NotAuthorizedError();
    expect(naErr).to.be.ok.and.instanceOf(Error).and.to.be.instanceOf(NodeError).and.to.be.instanceOf(HttpError);

    expect(naErr.detail).to.be.a('string').and.to.eql('');
    expect(naErr.title).to.be.a('string').and.to.eql('not authorized');
    expect(naErr.stack).to.be.a('string').and.to.be.ok;
    expect(naErr.status).to.be.a('string').and.to.eql('401');
  });
});
