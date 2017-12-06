import _ from 'lodash';
import React, { PropTypes } from 'react';
import { isInitialized } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import FeedPreviewTableRow from '../feed-preview-table-row';
import './style.scss';

function renderEmptyRow() {
  return (
    <tr className="feed-preview-table__empty-row">
      <td colSpan="3">No content to show</td>
    </tr>
  );
}

export default function FeedPreviewTable({ feedItems }) {
  const isFeedEmpty = _.isEmpty(feedItems);

  return (
    <LoaderContainer
      isLoading={!isFeedEmpty && !isInitialized(feedItems)}
      isOverlay
    >
      <table className="table feed-preview-table">
        <thead>
          <tr>
            <th className="feed-preview-table__image">Image</th>
            <th className="feed-preview-table__title">Title</th>
            <th className="feed-preview-table__date">Date</th>
          </tr>
        </thead>
        <tbody>
          {isFeedEmpty && renderEmptyRow()}
          {!isFeedEmpty && _.map(feedItems, feedItem =>
            <FeedPreviewTableRow
              feedItem={feedItem}
              key={feedItem.id}
            />
          )}
        </tbody>
      </table>
    </LoaderContainer>
  );
}

FeedPreviewTable.propTypes = {
  feedItems: PropTypes.array,
};
