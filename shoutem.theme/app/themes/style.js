import { changeColorAlpha } from '@shoutem/theme';
import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.theme.ThemeListItem': {
    container: {
      paddingLeft: 20,
      paddingRight: 20,
      borderBottomColor: changeColorAlpha(
        resolveVariable('primaryButtonText.color'),
        0.1,
      ),
      borderBottomWidth: 1,
    },

    text: {
      fontSize: 15,
      lineHeight: 18,
      color: resolveVariable('primaryButtonText.color'),
    },
  },
});
