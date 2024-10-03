import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

function RecentImages({ onImageSelected, style }) {
  // Currently disabled in web
  return null;
}

RecentImages.propTypes = {
  onImageSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

RecentImages.defaultProps = {
  style: {},
};

export default connectStyle(ext('RecentImages'))(RecentImages);
