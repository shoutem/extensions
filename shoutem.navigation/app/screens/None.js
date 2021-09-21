import { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { NO_SCREENS } from '../const';
import { getRouteParams } from '../services';

export default class None extends PureComponent {
  static propTypes = {
    route: PropTypes.shape({
      params: PropTypes.shape({
        shortcut: PropTypes.object.isRequired,
        startingScreen: PropTypes.string.isRequired,
      }),
    }),
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { shortcut, startingScreen } = getRouteParams(this.props);

    const children = _.get(shortcut, 'children', []);

    const selectedFirstScreen = _.find(children, { id: startingScreen });
    const firstScreen = children[0];

    const resolvedScreen = selectedFirstScreen || firstScreen;
    const resolvedRoute = resolvedScreen
      ? resolvedScreen.canonicalName
      : NO_SCREENS;

    navigation.replace(resolvedRoute);
  }

  render() {
    return null;
  }
}
