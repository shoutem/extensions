// we want to load this from a lot of places, no need to insist on
// transpiling for such a core, small thing
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const dotenv = require('dotenv');
const relativePath = process.env.ENV_RELATIVE_PATH;

if (relativePath && relativePath.length > 0) {
  const resolvedPath = path.join(__dirname, relativePath);

  dotenv.config({ path: resolvedPath });
}
