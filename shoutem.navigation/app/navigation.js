import { Platform } from 'react-native';
import { Decorators } from './services';
import { withBackHandling } from './hoc';

if (Platform.OS !== 'ios') {
  Decorators.registerDecorator(withBackHandling);
}
