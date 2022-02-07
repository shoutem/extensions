import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../../const';
import { FullGridRowItemView } from './FullGridRowItemView';

function HalfGridRowItemView(props) {
  return <FullGridRowItemView {...props} numberOfLines={3} />;
}

HalfGridRowItemView.propTypes = {
  ...FullGridRowItemView.propTypes,
};

HalfGridRowItemView.defaultProps = {
  ...FullGridRowItemView.defaultProps,
};

export default connectStyle(ext('HalfGridRowItemView'))(HalfGridRowItemView);
