import _ from 'lodash';
import { assert } from 'chai';
import { PagedCollection } from '../paged-collection';

describe('PagedCollection', () => {
  describe('iterator', () => {
    it('iterates over collectionItems', () => {
      const collection = [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ];

      const pagedCollection = new PagedCollection(collection, {});
      let counter = 1;
      _.forEach(pagedCollection, (item) => {
        assert.strictEqual(item.id, counter);
        counter++;
      });
    });
  });
});
