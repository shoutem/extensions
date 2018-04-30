import PropTypes from 'prop-types';
import React from 'react';

const { bool, number, shape, string } = PropTypes;

const notificationShape = shape({
  // Notification ID
  id: number.isRequired,
  // URL to image
  imageUrl: string.isRequired,
  // Was the notification read
  read: bool,
  // Summary text
  summary: string.isRequired,
  // Time when the notification was created
  timestamp: number.isRequired,
});

const pushGroupShape = shape({
  // Group ID
  id: number,
  // Image URL for the groups's thumbnail
  imageUrl: string,
  // Group name
  name: string,
  // True if the group should be subscribed to on app launch, false otherwise
  subscribeByDefault: bool,
  // Group tag, used for subscribtions
  tag: string,
});

export { notificationShape, pushGroupShape };
