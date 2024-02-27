import chai from 'chai';
import { NodeError } from '../node-error';

const { expect } = chai;

describe('NodeError', () => {
  it('should inherit from error, capture stack and take arguments', () => {
    expect(NodeError).to.be.ok;
    const title = 'some title';
    const nodeErr = new NodeError(title);
    expect(nodeErr).to.be.ok.and.instanceOf(Error);
    expect(nodeErr.message).to.be.a('string').and.to.eql(title);
    expect(nodeErr.stack).to.be.a('string').and.to.be.ok;
  });
});
