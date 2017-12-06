// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension.js';
import reducer from './redux';

export const screens = extension.screens;
export const themes = extension.themes;


export { appDidMount } from './app';

export { reducer };
