import chai from 'chai';
import { NodeError } from '../node-error';
import { HttpError } from '../http-error';
import { ValidationError } from '../validation-error';

const { expect } = chai;

describe('ValidationError', () => {
  it('should inherit from http error and have 400 status', () => {
    const valErr = new ValidationError();
    expect(valErr).to.be.ok.and.instanceOf(Error).and.to.be.instanceOf(NodeError).and.to.be.instanceOf(HttpError);

    expect(valErr.detail).to.be.a('string').and.to.eql('');
    expect(valErr.title).to.be.a('string').and.to.eql('validation error');
    expect(valErr.stack).to.be.a('string').and.to.be.ok;
    expect(valErr.status).to.be.a('string').and.to.eql('400');
  });
});
