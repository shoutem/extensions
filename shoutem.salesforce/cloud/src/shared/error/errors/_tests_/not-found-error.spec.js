import chai from 'chai';
import { NodeError } from '../node-error';
import { HttpError } from '../http-error';
import { NotFoundError } from '../not-found-error';

const { expect } = chai;

describe('NotFoundError', () => {
  it('should inherit from http error and have 404 status', () => {
    const nfErr = new NotFoundError();
    expect(nfErr).to.be.ok.and.instanceOf(Error).and.to.be.instanceOf(NodeError).and.to.be.instanceOf(HttpError);

    expect(nfErr.detail).to.be.a('string').and.to.eql('');
    expect(nfErr.title).to.be.a('string').and.to.eql('not found');
    expect(nfErr.stack).to.be.a('string').and.to.be.ok;
    expect(nfErr.status).to.be.a('string').and.to.eql('404');
  });
});
