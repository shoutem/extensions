import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('LargeEventDetailsScreen')}`]: {
    sectionHeader: {
      backgroundColor: resolveVariable(
        'shoutem.cms',
        'sectionHeaderBackgroundColor',
      ),
    },
  },
  [`${ext('MediumEventDetailsScreen')}`]: {
    sectionHeader: {
      backgroundColor: resolveVariable(
        'shoutem.cms',
        'sectionHeaderBackgroundColor',
      ),
    },
  },
});
