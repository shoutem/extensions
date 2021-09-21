import React from 'react';
import PropTypes from 'prop-types';
import { Html } from '@shoutem/ui';
import { convertToHtml } from '../services/textConverter';

export default function HtmlTextView({ styleName, text }) {
  const htmlText = convertToHtml(text);
  const style = `${styleName} multiline`;

  return <Html body={htmlText} styleName={style} />;
}

HtmlTextView.propTypes = {
  text: PropTypes.string,
  styleName: PropTypes.string,
};
