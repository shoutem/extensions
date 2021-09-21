import React, { PureComponent } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity, Text } from '@shoutem/ui';
import { ext } from '../const';

export class Question extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { onPress, item } = this.props;

    onPress(item);
  }

  render() {
    const { item, isBack, style } = this.props;

    const name = _.get(item, 'name') || _.get(item, 'buttonLabel');

    return (
      <TouchableOpacity
        onPress={this.handlePress}
        style={[style.container, isBack && style.backContainer]}
      >
        <Text style={[style.text, isBack && style.backText]}>{name}</Text>
      </TouchableOpacity>
    );
  }
}

Question.propTypes = {
  onPress: PropTypes.func,
  item: PropTypes.object,
  isBack: PropTypes.bool,
  style: PropTypes.any,
};

export default connectStyle(ext('Question'))(Question);
