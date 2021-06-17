import { connectStyle } from '@shoutem/theme';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { ext } from '../const';
import { PlaceFullGridRowView } from './PlaceFullGridRowView';

const PlaceHalfGridRowView = withOpenPlaceDetails(
  connectStyle(ext('PlaceHalfGridRowView'))(PlaceFullGridRowView),
);

PlaceHalfGridRowView.defaultProps = {
  numberOfLines: 3,
};

export default PlaceHalfGridRowView;
