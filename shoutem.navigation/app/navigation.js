import { Platform } from 'react-native';
import { Decorators, withBackHandling } from './services';

if (Platform.OS !== 'ios') {
  Decorators.registerDecorator(withBackHandling);
}
