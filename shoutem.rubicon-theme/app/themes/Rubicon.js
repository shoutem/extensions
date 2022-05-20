import _ from 'lodash';
import { getTheme } from '@shoutem/ui';
import { extensionThemes } from './extensionThemes';

export default () => {
  return _.merge({}, getTheme(), {
    ..._.reduce(
      extensionThemes,
      (result, extensionTheme) => {
        if (!extensionTheme) {
          return {};
        }

        return { ...result, ...extensionTheme.default() };
      },
      {},
    ),
  });
};
