import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../../../../const';
import { FullGridRowItemView } from './FullGridRowItemView';

FullGridRowItemView.defaultProps = {
  description: '',
  imageUrl: null,
  numberOfLines: 3,
  style: {},
  title: '',
};

const StyledHalfGridRowItemView = connectStyle(ext('HalfGridRowItemView'))(
  FullGridRowItemView,
);
export default React.memo(StyledHalfGridRowItemView);
