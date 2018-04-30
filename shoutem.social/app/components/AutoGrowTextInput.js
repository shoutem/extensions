import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { TextInput } from '@shoutem/ui';

const { func, number } = PropTypes;

export default class AutoGrowTextInput extends Component {
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

    this.handleStatusInputChange = this.handleStatusInputChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleContentSizeChange = this.handleContentSizeChange.bind(this);
    this.calculateHeight = this.calculateHeight.bind(this);

    this.state = {
      height: props.minHeight,
    };
  }

  handleStatusInputChange(event) {
    const text = _.get(event, 'nativeEvent.text');

    this.handleTextChange(text);
    this.handleContentSizeChange(event);
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
    const { height } = this.state;
    const textInputProps = _.omit(this.props, [
      'onTextChanged',
      'maxHeight',
      'minHeight',
    ]);

    return (
      <TextInput
        onChange={this.handleStatusInputChange}
        style={{ height }}
        {...textInputProps}
      />
    );
  }
}
