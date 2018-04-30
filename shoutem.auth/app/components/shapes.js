import PropTypes from 'prop-types';
import React from 'react';

const { shape, string } = PropTypes;

const user = shape({
  // User's bio
  description: string,
  // User's e-mail address, that he registered with
  email: string,
  // First and last name
  name: string,
  // User location
  location: string,
  // The URL of user's website
  url: string,
  // First name
  first_name: string,
  //Last name
  last_name: string,
  // User location
  location: string,
  // The URL of user's profile image
  profile_image_url: string,
});

export { user };
