import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../const';

export class DealFeaturedView extends PureComponent {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => {},
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { deal, onPress } = this.props;

    onPress(deal);
  }

  render() {
    const { deal } = this.props;

    return (
      <View>
        <Text>{deal.title}</Text>
      </View>
    );
  }
}

export default connectStyle(ext('DealFeaturedView'), {})(DealFeaturedView);
