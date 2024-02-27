import _ from 'lodash';
import { assert } from 'chai';
import { encodeKeys, decodeKeys } from '../encoder';

describe('Encoder', () => {
  const decodedDollarTestObj = {
    a: 1,
    a$b: 2,
    a$b$c: 3,
    a$b$c$d: 4,
  };

  const encodedDollarTestObj = {
    a: 1,
    'a[dollar]b': 2,
    'a[dollar]b[dollar]c': 3,
    'a[dollar]b[dollar]c[dollar]d': 4,
  };

  const decodedDotTestObj = {
    a: 1,
    'a.b': 2,
    'a.b.c': 3,
    'a.b.c.d': 4,
  };

  const encodedDotTestObj = {
    a: 1,
    'a[dot]b': 2,
    'a[dot]b[dot]c': 3,
    'a[dot]b[dot]c[dot]d': 4,
  };

  const decodedDotDollarTestObj = {
    a: 1,
    'a.$b': 2,
    'a.b$c': 3,
    'a.b$c.d': 4,
  };

  const encodedDotDollarTestObj = {
    a: 1,
    'a[dot][dollar]b': 2,
    'a[dot]b[dollar]c': 3,
    'a[dot]b[dollar]c[dot]d': 4,
  };

  describe('encode keys', () => {
    it("should replace '$' with '[dollar]'", () => {
      const actualEncodedObj = encodeKeys(_.cloneDeep(decodedDollarTestObj));
      assert.deepEqual(actualEncodedObj, encodedDollarTestObj);
    });

    it("should replace '.' with '[dot]'", () => {
      const actualEncodedObj = encodeKeys(_.cloneDeep(decodedDotTestObj));
      assert.deepEqual(actualEncodedObj, encodedDotTestObj);
    });

    it("should replace '$' with '[dollar]' and " + "'.' with '[dot]'", () => {
      const actualEncodedObj = encodeKeys(_.cloneDeep(decodedDotDollarTestObj));
      assert.deepEqual(actualEncodedObj, encodedDotDollarTestObj);
    });
  });

  describe('decode keys', () => {
    it("should replace '[dollar]' with '$'", () => {
      const actualDecodedObj = decodeKeys(_.cloneDeep(encodedDollarTestObj));
      assert.deepEqual(actualDecodedObj, decodedDollarTestObj);
    });

    it("should replace '[dot]' with '.'", () => {
      const actualDecodedObj = decodeKeys(_.cloneDeep(encodedDotTestObj));
      assert.deepEqual(actualDecodedObj, decodedDotTestObj);
    });

    it("should replace '[dollar]' with '$' and " + "'[dot]' with '.'", () => {
      const actualDecodedObj = decodeKeys(_.cloneDeep(encodedDotDollarTestObj));
      assert.deepEqual(actualDecodedObj, decodedDotDollarTestObj);
    });
  });
});
