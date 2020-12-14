import React, { Component } from 'react';
import { ReduxFormElement } from '@shoutem/react-web-ui';
import './style.scss';

export default class TextAreaReduxFormElement extends Component {
  render() {
    const { ...otherProps } = this.props;

    return (
      <ReduxFormElement
        className="text-area-redux-form-element"
        debounceTimeout={0}
        {...otherProps}
      >
        <textarea className="form-control" />
      </ReduxFormElement>
    );
  }
}
