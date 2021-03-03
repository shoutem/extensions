import _ from 'lodash';
import chai from 'chai';
import { NodeError } from '../node-error';
import { HttpError } from '../http-error';

const { expect } = chai;

describe('HttpError', () => {
  it('should inherit from error, capture stack and take arguments', () => {
    expect(HttpError).to.be.ok;
    const detail = _.random(1, 10) % 2 === 0 ? 'testDetail' : '';
    const title = _.random(1, 10) % 2 === 0 ? 'some title' : undefined;
    const status = _.random(200, 510);
    const httpErr = new HttpError(status, detail, title);
    expect(httpErr).to.be.ok.and.instanceOf(Error).and.to.be.instanceOf(NodeError);
    expect(httpErr.detail).to.be.a('string').and.to.eql(detail);
    expect(httpErr.title)
      .to.be.a('string')
      .and.to.eql(title || 'http error');
    expect(httpErr.stack).to.be.a('string').and.to.be.ok;
    expect(httpErr.status).to.be.a('string').and.to.eql(status.toString());
  });

  it('should default to 500 status code', () => {
    const httpErr = new HttpError();
    expect(httpErr).to.be.ok.and.instanceOf(Error).and.to.be.instanceOf(NodeError);
    expect(httpErr.detail).to.be.a('string').and.to.eql('');
    expect(httpErr.title).to.be.a('string').and.to.eql('http error');
    expect(httpErr.stack).to.be.a('string').and.to.be.ok;
    expect(httpErr.status).to.be.a('string').and.to.eql('500');
  });
});
