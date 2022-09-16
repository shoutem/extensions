/* eslint-disable class-methods-use-this */

import { assert } from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';
import { cache, invalidateCache } from '../index';

sinon.assert.expose(assert, { prefix: '' });

describe('Cache communication', () => {
  function getSavedDevelopers() {
    return [
      {
        _id: '123456789',
        name: 'lovro',
        userId: '1',
      },
      {
        _id: '987654321',
        name: 'shoutem',
        userId: '2',
      },
      {
        _id: '1241244',
        name: 'A',
        userId: '3',
      },
    ];
  }

  function getByUserIdPromise(userId) {
    const savedDevelopers = getSavedDevelopers();
    for (let i = 0; i < savedDevelopers.length; i++) {
      if (savedDevelopers[i].userId === userId) {
        return Promise.resolve(savedDevelopers[i]);
      }
    }
    return Promise.reject();
  }

  function updateUserPromise(userId, newName) {
    const savedDevelopers = getSavedDevelopers();
    for (let i = 0; i < savedDevelopers.length; i++) {
      if (savedDevelopers[i].userId === userId) {
        savedDevelopers[i].name = newName;
        return Promise.resolve(savedDevelopers[i]);
      }
    }
    return Promise.reject();
  }

  function getByMultipleArgsPromise(...args) {
    const savedDevelopers = getSavedDevelopers();
    for (let i = 0; i < savedDevelopers.length; i++) {
      if (savedDevelopers[i].userId === args[0]) {
        return Promise.resolve(savedDevelopers[i]);
      }
    }
    return Promise.reject();
  }

  function getDeveloper() {
    return {
      _id: '123456789',
      name: 'lovro',
      userId: '1',
    };
  }

  function getUpdatedDeveloper() {
    return {
      _id: '123456789',
      name: 'shoutem',
      userId: '1',
    };
  }

  const constants = {
    USER_ID: '1',
    USER_ID_SHOUTEM: '2',
    DEVELOPER_INVALIDATION_KEY: 'developers',
    APPLICATION_INVALIDATION_KEY: 'applications',
    NEW_NAME: 'shoutem',
  };

  describe('Using decorators with promise', () => {
    describe('get user', () => {
      it('returns user with the given userId from cache (when user exists in cache)', async () => {
        const expectedDeveloper = getDeveloper();

        const mockCache = {
          getAsync: sinon.stub().withArgs(`userId:${constants.USER_ID}`).resolves(expectedDeveloper),
        };

        class MockRepository {
          @cache(
            (args) => `userId:${args}`,
            (id) => [
              `${constants.DEVELOPER_INVALIDATION_KEY}:${id}`,
              `${constants.APPLICATION_INVALIDATION_KEY}:${id}`,
            ],
            mockCache,
          )
          async get(userId) {
            return getByUserIdPromise(userId);
          }
        }

        const repo = new MockRepository();
        const cachedDeveloper = await repo.get(constants.USER_ID);
        assert.calledWithExactly(mockCache.getAsync, `userId:${constants.USER_ID}`);
        assert.deepEqual(expectedDeveloper, cachedDeveloper);
      });

      it('returns user with the given userId from cache (when there is no specific user in cache)', async () => {
        const expectedDeveloper = getDeveloper();

        const mockCache = {
          getAsync: sinon.stub().withArgs(`userId:${constants.USER_ID}`).resolves(null),
          setAsync: sinon.stub().withArgs(`userId:${constants.USER_ID}`, {
            _id: '123456789',
            name: 'lovro',
            userId: '1',
          }),
        };

        class MockRepository {
          @cache(
            (args) => `userId:${args}`,
            (id) => [
              `${constants.DEVELOPER_INVALIDATION_KEY}:${id}`,
              `${constants.APPLICATION_INVALIDATION_KEY}:${id}`,
            ],
            mockCache,
          )
          async get(userId) {
            return getByUserIdPromise(userId);
          }
        }

        const repo = new MockRepository();
        const cachedDeveloper = await repo.get(constants.USER_ID);
        assert.calledWithExactly(mockCache.getAsync, `userId:${constants.USER_ID}`);
        assert.deepEqual(expectedDeveloper, cachedDeveloper);
      });

      it("set valid invalidation keys when there isn't any dependency key for given invalidation key", async () => {
        const expectedDeveloper = getDeveloper();
        const mockCache = {
          getAsync: sinon.stub(),
          setAsync: sinon.stub(),
        };

        mockCache.getAsync.withArgs(`${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID}`).resolves(null);
        mockCache.getAsync.withArgs(`userId:${constants.USER_ID}`).resolves(null);
        mockCache.setAsync
          .withArgs(`${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID}`, [`userId:${constants.USER_ID}`])
          .resolves(null);
        mockCache.setAsync.withArgs(`userId:${constants.USER_ID}`, {
          _id: '123456789',
          name: 'lovro',
          userId: '1',
        });

        class MockRepository {
          @cache(
            (args) => `userId:${args}`,
            (id) => [
              `${constants.DEVELOPER_INVALIDATION_KEY}:${id}`,
              `${constants.APPLICATION_INVALIDATION_KEY}:${id}`,
            ],
            mockCache,
          )
          get(userId) {
            return getByUserIdPromise(userId);
          }
        }

        const repo = new MockRepository();
        const cachedDeveloper = await repo.get(constants.USER_ID);
        assert.calledWithExactly(mockCache.setAsync, `${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID}`, [
          `userId:${constants.USER_ID}`,
        ]);
        assert.calledWithExactly(mockCache.setAsync, `${constants.APPLICATION_INVALIDATION_KEY}:${constants.USER_ID}`, [
          `userId:${constants.USER_ID}`,
        ]);
        assert.deepEqual(expectedDeveloper, cachedDeveloper);
      });

      it('set valid invalidation keys when dependency key for given invalidation key exists', async () => {
        const shoutemDeveloper = {
          _id: '987654321',
          name: 'shoutem',
          userId: '2',
        };
        const existingDependencyKeys = [`userId:${constants.USER_ID}`];
        const mockCache = {
          getAsync: sinon.stub(),
          setAsync: sinon.stub(),
        };

        mockCache.getAsync.withArgs(`userId:${constants.USER_ID_SHOUTEM}`).resolves(null);
        mockCache.getAsync.withArgs(constants.DEVELOPER_INVALIDATION_KEY).resolves(existingDependencyKeys);
        mockCache.setAsync
          .withArgs(constants.DEVELOPER_INVALIDATION_KEY, [
            `userId:${constants.USER_ID}`,
            `userId:${constants.USER_ID_SHOUTEM}`,
          ])
          .resolves(null);
        mockCache.setAsync
          .withArgs(
            (`userId:${constants.USER_ID_SHOUTEM}`,
            {
              _id: '987654321',
              name: 'shoutem',
              userId: '2',
            }),
          )
          .resolves(null);

        class MockRepository {
          @cache((args) => `userId:${args}`, () => [constants.DEVELOPER_INVALIDATION_KEY], mockCache)
          get(userId) {
            return getByUserIdPromise(userId);
          }
        }

        const repo = new MockRepository();
        const cachedDeveloper = await repo.get(constants.USER_ID_SHOUTEM);
        assert.calledWithExactly(mockCache.setAsync, `userId:${constants.USER_ID_SHOUTEM}`, shoutemDeveloper);
        assert.calledWithExactly(mockCache.setAsync, constants.DEVELOPER_INVALIDATION_KEY, [
          `userId:${constants.USER_ID}`,
          `userId:${constants.USER_ID_SHOUTEM}`,
        ]);
        assert.deepEqual(shoutemDeveloper, cachedDeveloper);
      });

      it('set valid invalidation key with multiple parameters', async () => {
        const expectedDeveloper = getDeveloper();
        const mockCache = {
          getAsync: sinon.stub(),
          setAsync: sinon.stub(),
        };

        mockCache.getAsync.withArgs(`${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID}`).resolves(null);
        mockCache.getAsync.withArgs(`userId:${constants.USER_ID}`).resolves(null);
        mockCache.setAsync
          .withArgs(`${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID_SHOUTEM}`, [
            `userId:${constants.USER_ID}`,
          ])
          .resolves(null);
        mockCache.setAsync.withArgs(`userId:${constants.USER_ID}`, {
          _id: '123456789',
          name: 'lovro',
          userId: '1',
        });

        class MockRepository {
          @cache(
            (args) => `userId:${args}`,
            (id1, id2) => [
              `${constants.DEVELOPER_INVALIDATION_KEY}:${id1}`,
              `${constants.DEVELOPER_INVALIDATION_KEY}:${id2}`,
            ],
            mockCache,
          )
          get(userId, userIdShoutem) {
            return getByMultipleArgsPromise(userId, userIdShoutem);
          }
        }

        const repo = new MockRepository();
        const result = await repo.get(constants.USER_ID, constants.USER_ID_SHOUTEM);
        assert.calledWithExactly(mockCache.setAsync, `userId:${constants.USER_ID}`, {
          _id: '123456789',
          name: 'lovro',
          userId: '1',
        });
        assert.calledWithExactly(mockCache.setAsync, `${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID}`, [
          `userId:${constants.USER_ID}`,
        ]);
        assert.calledWithExactly(
          mockCache.setAsync,
          `${constants.DEVELOPER_INVALIDATION_KEY}:${constants.USER_ID_SHOUTEM}`,
          [`userId:${constants.USER_ID}`],
        );
        assert.deepEqual(expectedDeveloper, result);
      });
    });

    describe('update user', () => {
      it('delete specific invalidation keys', async () => {
        const expectedUpdatedDeveloper = getUpdatedDeveloper();
        const mockCache = {
          getAsync: sinon.stub(),
          delAsync: sinon.stub(),
        };

        mockCache.getAsync
          .withArgs(constants.DEVELOPER_INVALIDATION_KEY)
          .resolves([`userId:${constants.USER_ID}`, `userId:${constants.USER_ID_SHOUTEM}`]);
        mockCache.getAsync
          .withArgs(constants.APPLICATION_INVALIDATION_KEY)
          .resolves([`userId:${constants.USER_ID}`, `userId:${constants.USER_ID_SHOUTEM}`]);
        mockCache.delAsync.withArgs(`userId:${constants.USER_ID}`);
        mockCache.delAsync.withArgs(`userId:${constants.USER_ID_SHOUTEM}`);
        mockCache.delAsync.withArgs(constants.DEVELOPER_INVALIDATION_KEY);
        mockCache.delAsync.withArgs(constants.APPLICATION_INVALIDATION_KEY);

        class MockRepository {
          @invalidateCache(
            () => [constants.DEVELOPER_INVALIDATION_KEY, constants.APPLICATION_INVALIDATION_KEY],
            mockCache,
          )
          update(userId, newName) {
            return updateUserPromise(userId, newName);
          }
        }

        const repo = new MockRepository();
        const updatedDeveloper = await repo.update(constants.USER_ID, constants.NEW_NAME);

        assert.deepEqual(expectedUpdatedDeveloper, updatedDeveloper);
        assert.calledWithExactly(mockCache.getAsync, constants.DEVELOPER_INVALIDATION_KEY);
        assert.calledWithExactly(mockCache.getAsync, constants.APPLICATION_INVALIDATION_KEY);
        assert.calledWithExactly(mockCache.delAsync, `userId:${constants.USER_ID}`);
        assert.calledWithExactly(mockCache.delAsync, `userId:${constants.USER_ID_SHOUTEM}`);
        assert.calledWithExactly(mockCache.delAsync, constants.DEVELOPER_INVALIDATION_KEY);
        assert.calledWithExactly(mockCache.delAsync, constants.APPLICATION_INVALIDATION_KEY);
      });
    });
  });
});
