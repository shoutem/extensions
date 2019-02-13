import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Html } from '@shoutem/ui';

import { convertToHtml } from '../services/textConverter';

export default class HtmlTextView extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    styleName: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { text } = props;
    const htmlText = convertToHtml(text);

    this.state = {
      htmlText,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { text: nextText } = nextProps;
    const { text } = this.props;

    if (nextText !== text) {
      const htmlText = convertToHtml(nextText);
      this.setState({ htmlText });
    }
  }

  render() {
    const { htmlText } = this.state;
    const { styleName } = this.props;

    const style = `${styleName} multiline`;

    return (
      <Html
        body={htmlText}
        styleName={style}
      />
    );
  }
}
