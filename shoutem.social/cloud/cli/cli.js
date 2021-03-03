import yargs from 'yargs';

require('yargonaut').helpStyle('green.underline').errorsStyle('red.bold');

const cli = yargs
  .usage('Usage: console [command] [-h]')
  .option('only-docs', {
    alias: 'd',
    type: 'boolean',
    description: 'Generate only docs',
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'Generate from file with multiple definitions',
  })
  .commandDir('commands')
  .strict()
  .help()
  .epilog('node-seed-project command line tools')
  .alias('help', 'h');

const argv = cli.argv;
if (argv._.length === 0) {
  cli.showHelp();
}
