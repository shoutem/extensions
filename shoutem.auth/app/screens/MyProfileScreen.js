import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { loginRequired } from '../loginRequired';
import { ext } from '../const';

import {
  UserProfileScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './UserProfileScreen';

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('UserProfileScreen'))(UserProfileScreen)),
  true,
);
