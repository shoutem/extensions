import _ from 'lodash';

const initQueue = [];

function formatInitialReducerState() {
  return _.reduce(
    initQueue,
    (result, extension) => ({
      ...result,
      [extension]: false,
    }),
    {},
  );
}

function addExtension(extensionName) {
  if (!_.includes(initQueue, extensionName)) {
    initQueue.push(extensionName);
  }
}

function removeExtension(extensionName) {
  if (_.includes(initQueue, extensionName)) {
    _.pull(initQueue, extensionName);
  }
}

function getQueue() {
  return initQueue;
}

export default {
  addExtension,
  getQueue,
  removeExtension,
  formatInitialReducerState,
};
