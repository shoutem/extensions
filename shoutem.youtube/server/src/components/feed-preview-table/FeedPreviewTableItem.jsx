import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getFormatDuration } from '../../services/duration';

const getPreviewImage = item =>
  _.get(item, 'thumbnails.medium.url') || _.get(item, 'thumbnails.default.url');

export default function FeedPreviewTableItem({ item }) {
  const { duration, title } = item;

  return (
    <tr className="feed-preview-table-item">
      <td className="feed-preview-table-item__title-overflow">
        <img
          alt="video thumbnail"
          className="feed-preview-table-item__img"
          src={getPreviewImage(item)}
        />
        {title}
      </td>
      {!!duration && (
        <td className="feed-preview-table__duration">
          {getFormatDuration(duration)}
        </td>
      )}
    </tr>
  );
}

FeedPreviewTableItem.propTypes = {
  item: PropTypes.object.isRequired,
};
