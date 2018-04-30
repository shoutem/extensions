import PropTypes from 'prop-types';
import React from 'react';

const { shape, string, object } = PropTypes;

const user = shape({
  // User's bio
  description: string,
  // First and last name
  name: string,
  // First name
  first_name: string,
  //Last name
  last_name: string,
  // User location
  location: string,
  // The URL of user's profile image
  profile_image_url: string,
});

const post = shape({
  // User who created post
  user,
  // Post's textual content
  text: string,
  // Date when the Post is created
  created_at: string,
  // Number of likes and list of users
  shoutem_favorited_by: object,
  // Post's image url
  shoutem_image_url: string,
});

const comment = shape({
  // User who created comment
  user,
  // Date when the comment is created
  created_at: string,
  // Comment text
  text: string,
});

export { user, post, comment };
