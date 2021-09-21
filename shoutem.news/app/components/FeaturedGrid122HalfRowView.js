import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { FeaturedGrid122FullRowView } from './FeaturedGrid122FullRowView';

const FeaturedGrid122HalfRowView = connectStyle(
  ext('FeaturedGrid122HalfRowView'),
)(FeaturedGrid122FullRowView);

FeaturedGrid122HalfRowView.defaultProps = {
  numberOfLines: 3,
};

export default FeaturedGrid122HalfRowView;
