import chai from 'chai';
import { NodeError } from '../node-error';
import { HttpError } from '../http-error';
import { ForbiddenError } from '../forbidden-error';

const { expect } = chai;

describe('ForbiddenError', () => {
  it('should inherit from http error and have 403 status', () => {
    const fbdErr = new ForbiddenError();
    expect(fbdErr).to.be.ok.and.instanceOf(Error).and.to.be.instanceOf(NodeError).and.to.be.instanceOf(HttpError);

    expect(fbdErr.detail).to.be.a('string').and.to.eql('');
    expect(fbdErr.title).to.be.a('string').and.to.eql('forbidden');
    expect(fbdErr.stack).to.be.a('string').and.to.be.ok;
    expect(fbdErr.status).to.be.a('string').and.to.eql('403');
  });
});
