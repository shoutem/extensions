/* eslint-disable */

import sleep from 'sleep-promise';

export async function retryWrap<T>(funcParam: () => Promise<T>, retryCount = 5, sleepTime = 1): Promise<T> {
  let tryCount = 0;

  while (true) {
    tryCount += 1;
    try {
      return await funcParam();
    } catch (err) {
      if (tryCount <= retryCount) {
        sleep(sleepTime);
        continue;
      }
      throw err;
    }
  }
}
