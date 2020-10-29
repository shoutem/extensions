import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import FeedPreviewTable from '../feed-preview-table';
import LOCALIZATION from './localization';
import './style.scss';

export default function FeedPreview({ feedUrl, onRemoveClick, feedItems }) {
  return (
    <div className="feed-preview">
      <form>
        <FormGroup className="feed-preview__container">
          <ControlLabel>{i18next.t(LOCALIZATION.YOUTUBE_SOURCE)}</ControlLabel>
          <div className="feed-preview__feed-url-container">
            <div className="feed-preview__play-img" />
            <div className="feed-preview__feed-url-text-wrapper text-ellipsis">
              <span className="feed-preview__feed-url">
                {feedUrl}
              </span>
            </div>
            <FontIcon
              className="feed-preview__remove"
              name="close"
              size="large"
              onClick={onRemoveClick}
            />
          </div>
        </FormGroup>
      </form>
      <FeedPreviewTable
        feedItems={feedItems}
      />
    </div>
  );
}

FeedPreview.propTypes = {
  feedUrl: PropTypes.string,
  feedItems: PropTypes.array,
  onRemoveClick: PropTypes.func,
};
