import { isIos } from 'shoutem-core';
import { withBackHandling } from './hoc';
import { Decorators } from './services';

if (!isIos) {
  Decorators.registerDecorator(withBackHandling);
}
