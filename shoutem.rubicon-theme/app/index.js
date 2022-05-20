// Constants `screens` and `reducer` are exported via named export
// It is important to use those exact names

import Rubicon, { defaultThemeVariables } from './themes/Rubicon';

export const screens = {};

export const reducer = {};
const getTheme = Rubicon;
const themes = {
  Rubicon,
  RubiconBleu: Rubicon,
  RubiconNoir: Rubicon,
  RubiconRose: Rubicon,
};

export { defaultThemeVariables, getTheme, themes };
