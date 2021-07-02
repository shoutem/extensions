import React from 'react';
import { ReduxFormElement } from '@shoutem/react-web-ui';
import './style.scss';

export default function TextAreaReduxFormElement({ ...otherProps }) {
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
