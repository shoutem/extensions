export const command = 'db <command>';

export const desc = 'Database commands';

export function handler() {}

export function builder(yargs) {
  return yargs.commandDir('database');
}
