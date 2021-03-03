import PropTypes from 'prop-types';

const user = PropTypes.shape({
  description: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
  url: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  profile_image_url: PropTypes.string,
});

export { user };
