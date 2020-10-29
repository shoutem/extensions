import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { isBusy } from '@shoutem/redux-io';
import FeedPreviewTableItem from './FeedPreviewTableItem';
import LOCALIZATION from './localization';
import './style.scss';

export default function FeedPreviewTable({ feedItems }) {
  const loading = isBusy(feedItems);

  return (
    <table className="table feed-preview-table">
      <thead>
        <tr>
          <th className="feed-preview-table__title">{i18next.t(LOCALIZATION.TITLE)}</th>
          <th className="feed-preview-table__duration">
            <span className="feed-preview-table__duration-margin">{i18next.t(LOCALIZATION.DURATION)}</span></th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="2">{i18next.t(LOCALIZATION.LOADING)}</td>
          </tr>
        )}
        {!loading && (_.isEmpty(feedItems)) && (
          <tr>
            <td colSpan="2">{i18next.t(LOCALIZATION.NO_CONTENT_MESSAGE)}</td>
          </tr>
        )}
        {(!loading && !_.isEmpty(feedItems)) && feedItems.map(item => (
          <FeedPreviewTableItem item={item} key={item.id} />
        ))}
      </tbody>
    </table>
  );
}

FeedPreviewTable.propTypes = {
  feedItems: PropTypes.array,
};

FeedPreviewTable.defaultProps = {
  feedItems: [],
};
