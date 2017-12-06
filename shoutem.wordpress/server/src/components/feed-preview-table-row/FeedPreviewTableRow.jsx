import _ from 'lodash';
import React, { PropTypes } from 'react';
import './style.scss';

const renderImage = (feedItem) => {
  const itemImage = _.get(feedItem, 'featured_media_object.source_url');
  if (!itemImage) {
    return null;
  }

  const imageStyle = {
    backgroundImage: `url(${itemImage})`,
  };

  return (
    <div className="feed-preview-table-row__image-preview" style={imageStyle} />
  );
};

export default function FeedPreviewTableRow({ feedItem }) {
  const title = _.get(feedItem, 'title.rendered');
  const dateTimeFormatted = _.get(feedItem, 'dateTimeFormatted');
  const dateTimeDisplay = _.get(feedItem, 'dateTimeDisplay');

  return (
    <tr className="feed-preview-table-row">
      <td className="feed-preview-table-row__image">
        {renderImage(feedItem)}
      </td>
      <td className="feed-preview-table-row__title">{title}</td>
      <td className="feed-preview-table-row__date">
        <span title={dateTimeFormatted}>{dateTimeDisplay}</span>
      </td>
    </tr>
  );
}

FeedPreviewTableRow.propTypes = {
  feedItem: PropTypes.object,
};
