import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { PlaceFullGridRowView } from './PlaceFullGridRowView';

const PlaceHalfGridRowView = withOpenPlaceDetails(
  connectStyle(ext('PlaceHalfGridRowView'))(PlaceFullGridRowView),
);

PlaceHalfGridRowView.defaultProps = {
  numberOfLines: 3,
};

export default PlaceHalfGridRowView;
