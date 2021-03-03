import React from 'react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isInitialized } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import FeedPreviewTableRow from '../feed-preview-table-row';
import LOCALIZATION from './localization';
import './style.scss';

function renderEmptyRow() {
  return (
    <tr className="feed-preview-table__empty-row">
      <td colSpan="3">{i18next.t(LOCALIZATION.NO_CONTENT)}</td>
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
            <th className="feed-preview-table__image">
              {i18next.t(LOCALIZATION.IMAGE)}
            </th>
            <th className="feed-preview-table__title">
              {i18next.t(LOCALIZATION.TITLE)}
            </th>
            <th className="feed-preview-table__date">
              {i18next.t(LOCALIZATION.DATE)}
            </th>
          </tr>
        </thead>
        <tbody>
          {isFeedEmpty && renderEmptyRow()}
          {!isFeedEmpty &&
            _.map(feedItems, feedItem => (
              <FeedPreviewTableRow feedItem={feedItem} key={feedItem.id} />
            ))}
        </tbody>
      </table>
    </LoaderContainer>
  );
}

FeedPreviewTable.propTypes = {
  feedItems: PropTypes.array,
};
