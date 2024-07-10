import { assert } from 'chai';
import { getLocals, setLocals } from '../locals';

describe('Modify request/response locals', () => {
  describe('setLocals', () => {
    it('adds arbitrary data to object even if it has no property `locals`', () => {
      const obj = {};
      setLocals(obj, 'test', { x: 10, y: 20 });
      assert.isOk(obj.locals && obj.locals.test);
      assert.strictEqual(obj.locals.test.x, 10);
      assert.strictEqual(obj.locals.test.y, 20);
    });

    it('adds arbitrary data to `obj.locals[namespace]`', () => {
      const obj = { locals: {} };
      setLocals(obj, 'test', { x: 10, y: 20 });
      assert.isOk(obj.locals && obj.locals.test);
      assert.strictEqual(obj.locals.test.x, 10);
      assert.strictEqual(obj.locals.test.y, 20);
    });

    it('extends data already present in `obj.locals[namespace]`', () => {
      const obj = { locals: { test: { x: 10 } } };
      setLocals(obj, 'test', { y: 20 });
      assert.isOk(obj.locals && obj.locals.test);
      assert.strictEqual(obj.locals.test.x, 10);
      assert.strictEqual(obj.locals.test.y, 20);
    });

    it('merges new data with present data', () => {
      const obj = { locals: { test: { foo: { bar: 100 } } } };
      setLocals(obj, 'test', { foo: { baz: 200 } });
      assert.isOk(obj.locals && obj.locals.test);
      assert.strictEqual(obj.locals.test.foo.bar, 100);
      assert.strictEqual(obj.locals.test.foo.baz, 200);
    });

    it('does not affect other namespaces', () => {
      const obj = { locals: { other: { x: 10 } } };
      setLocals(obj, 'test', { y: 20 });
      assert.isOk(obj.locals && obj.locals.other && obj.locals.test);
      assert.strictEqual(obj.locals.other.x, 10);
      assert.strictEqual(obj.locals.test.y, 20);
    });

    it('setting property to undefined value unsets the property', () => {
      const obj = { locals: { test: { x: 10 } } };
      setLocals(obj, 'test');
      assert.isUndefined(obj.locals.test);
    });
  });

  describe('getLocals', () => {
    it('returns `undefined` if any path is missing', () => {
      const obj1 = {};
      const obj2 = { locals: null };
      assert.isUndefined(getLocals(obj1, 'test'));
      assert.isUndefined(getLocals(obj2, 'test'));
    });

    it('returns data from `obj.locals[namespace]`', () => {
      const obj = { locals: { test: { x: 10, y: 20 } } };
      const result = getLocals(obj, 'test');
      assert.isOk(result);
      assert.strictEqual(result.x, 10);
      assert.strictEqual(result.y, 20);
    });
  });
});
