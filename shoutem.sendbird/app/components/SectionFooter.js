import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';

function SectionFooter({ style }) {
  return <View style={style} styleName="horizontal" />;
}

SectionFooter.propTypes = { style: PropTypes.object };

export default connectStyle(ext('SectionFooter'))(SectionFooter);
