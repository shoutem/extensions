import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';

import { TextInput } from '@shoutem/ui';

const { func, number } = PropTypes;

export default class AutoGrowTextInput extends PureComponent {
  static propTypes = {
    onTextChanged: func.isRequired,
    maxHeight: number,
    minHeight: number,
  };

  static defaultProps = {
    minHeight: 60,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      height: props.minHeight,
    };
  }

  handleStatusInputChange(event) {
    const text = _.get(event, 'nativeEvent.text');

    this.handleTextChange(text);
  }

  handleTextChange(text) {
    const { onTextChanged } = this.props;

    if (_.isFunction(onTextChanged)) {
      this.props.onTextChanged(text);
    }
  }

  handleContentSizeChange(event) {
    const { height: currentHeight } = this.state;

    const childHeight = _.get(event, 'nativeEvent.contentSize.height');
    const height = this.calculateHeight(childHeight);

    if (height !== currentHeight) {
      this.setState({ height });
    }
  }

  calculateHeight(childHeight) {
    const { minHeight, maxHeight } = this.props;

    const height = Math.max(minHeight, childHeight);
    if (!maxHeight) {
      return height;
    }

    return Math.min(height, maxHeight);
  }

  render() {
    const height = _.get(this.state, 'height', 60);
    const textInputProps = _.omit(this.props, [
      'onTextChanged',
      'maxHeight',
      'minHeight',
    ]);

    return (
      <TextInput
        onChange={this.handleStatusInputChange}
        onContentSizeChange={this.handleContentSizeChange}
        {...textInputProps}
      />
    );
  }
}
