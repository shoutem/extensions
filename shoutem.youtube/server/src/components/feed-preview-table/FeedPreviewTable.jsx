import React from 'react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isBusy } from '@shoutem/redux-io';
import FeedPreviewTableItem from './FeedPreviewTableItem';
import LOCALIZATION from './localization';
import './style.scss';

export default function FeedPreviewTable({ feedItems, showDurationLabel }) {
  const loading = isBusy(feedItems);

  return (
    <table className="table feed-preview-table">
      <thead>
        <tr>
          <th className="feed-preview-table__title">
            {i18next.t(LOCALIZATION.TITLE)}
          </th>
          {showDurationLabel && (
            <th className="feed-preview-table__duration">
              {i18next.t(LOCALIZATION.DURATION)}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="2">{i18next.t(LOCALIZATION.LOADING)}</td>
          </tr>
        )}
        {!loading && _.isEmpty(feedItems) && (
          <tr>
            <td colSpan="2">{i18next.t(LOCALIZATION.NO_CONTENT_MESSAGE)}</td>
          </tr>
        )}
        {!loading &&
          !_.isEmpty(feedItems) &&
          feedItems.map(item => (
            <FeedPreviewTableItem item={item} key={item.id} />
          ))}
      </tbody>
    </table>
  );
}

FeedPreviewTable.propTypes = {
  feedItems: PropTypes.array,
  showDurationLabel: PropTypes.bool,
};

FeedPreviewTable.defaultProps = {
  feedItems: [],
  showDurationLabel: false,
};
