import { Decorators } from 'shoutem.navigation';
import { isWeb } from 'shoutem-core';
import { withAdBanner } from './services';

if (!isWeb) {
  Decorators.registerDecorator(withAdBanner);
}
