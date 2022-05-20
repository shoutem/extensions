import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.photos.PhotosGrid': {
    list: {
      listContent: {
        padding: resolveVariable('mediumGutter'),
      },
    },
  },
});
