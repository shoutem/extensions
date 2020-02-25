import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Html } from '@shoutem/ui';

import { convertToHtml } from '../services/textConverter';

export default class HtmlTextView extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    styleName: PropTypes.string,
  };

  render() {
    const { styleName, text } = this.props;

    const htmlText = convertToHtml(text);
    const style = `${styleName} multiline`;

    return (
      <Html
        body={htmlText}
        styleName={style}
      />
    );
  }
}
