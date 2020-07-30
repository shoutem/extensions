import Promise from 'bluebird';

const glob = Promise.promisify(require('glob'));

export const description = 'Syncs database with model.';
export const command = 'sync';

export async function sync(sequelize, force) {
  console.log('here');
  // const models = glob('../**/*model.jos', {});
  console.log(models);
}

export function handler(argv) {
  sync();
}

export function builder(yargs) {
  return yargs.usage(`cli db ${command}\n\n${description}`).option('f', {
    alias: 'force',
    describe: 'Force drop of table',
  });
}
