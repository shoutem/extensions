import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  Button,
} from 'react-bootstrap';
import { FontIcon, LoaderContainer } from '@shoutem/react-web-ui';
import { FeedPreviewTable } from '../feed-preview-table';
import { FeedSortDropdown } from '../feed-sort-dropdown';
import LOCALIZATION from './localization';
import './style.scss';

export default function FeedPreview({
  feedUrl,
  onRemoveClick,
  feedItems,
  onSortChanged,
  selectedSort,
  savedSort,
  sortOptionsAvailable,
  onConfirmClick,
}) {
  const sortConfirmButtonDisabled = savedSort === selectedSort;

  return (
    <div className="feed-preview">
      <form>
        <FormGroup className="feed-preview__container">
          <ControlLabel>{i18next.t(LOCALIZATION.YOUTUBE_SOURCE)}</ControlLabel>
          <div className="feed-preview__feed-url-container">
            <div className="feed-preview__play-img" />
            <div className="feed-preview__feed-url-text-wrapper text-ellipsis">
              <span className="feed-preview__feed-url">{feedUrl}</span>
            </div>
            <FontIcon
              className="feed-preview__remove"
              name="close"
              size="large"
              onClick={onRemoveClick}
            />
          </div>
          {sortOptionsAvailable && (
            <>
              <FeedSortDropdown
                selectedSort={selectedSort}
                onSelect={onSortChanged}
              />
              <ButtonToolbar>
                <Button
                  bsStyle="primary"
                  disabled={sortConfirmButtonDisabled}
                  onClick={onConfirmClick}
                >
                  <LoaderContainer isLoading={false}>
                    {i18next.t(LOCALIZATION.SORT_CONFIRM_BUTTON)}
                  </LoaderContainer>
                </Button>
              </ButtonToolbar>
            </>
          )}
        </FormGroup>
      </form>
      <FeedPreviewTable feedItems={feedItems} />
    </div>
  );
}

FeedPreview.propTypes = {
  feedUrl: PropTypes.string,
  feedItems: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onSortChanged: PropTypes.func,
  selectedSort: PropTypes.string,
  savedSort: PropTypes.string,
  sortOptionsAvailable: PropTypes.bool,
  onConfirmClick: PropTypes.func,
};
