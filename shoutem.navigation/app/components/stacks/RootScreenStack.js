import { connect } from 'react-redux';
import ScreenStack from './ScreenStack';
import { getRootNavigationStack } from '../../redux/core';

export function mapStateToProps(state) {
  return {
    navigationState: getRootNavigationStack(state),
  };
}

export default connect(mapStateToProps)(ScreenStack);
