/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import { feedSortOptions } from '../../services/youtube';
import LOCALIZATION from './localization';
import './style.scss';

const SortOptionsDescription = (
  <span className="feed-sort-dropdown__sort_options_descriptions">
    <Trans i18nKey={LOCALIZATION.SORT_OPTIONS_DESCRIPTIONS}>
      <b>Relevance</b> – Resources are sorted based on their relevance. This is
      the default sort value.
      <br />
      <b>Date</b> – Resources are sorted in reverse chronological order based on
      the date they were created.
      <br />
      <b>Rating</b> – Resources are sorted from highest to lowest rating.
      <br />
      <b>Title</b> – Resources are sorted alphabetically by title.
      <br />
      <b>View count</b> – Resources are sorted from highest to lowest number of
      views.
    </Trans>
  </span>
);

export default function FeedSortDropdown({ selectedSort, onSelect }) {
  const selectedOptionObj = _.find(feedSortOptions, {
    name: selectedSort,
  });

  return (
    <>
      <div className="feed-sort-dropdown__label-container">
        <ControlLabel>{i18next.t(LOCALIZATION.SORT_BY_LABEL)}</ControlLabel>
        <FontIconPopover
          className="feed-url-description__popover-icon"
          delayHide={500}
          hideOnMouseLeave={false}
          message={SortOptionsDescription}
        >
          <FontIcon className="font-icon" name="info" size="24px" />
        </FontIconPopover>
      </div>
      <Dropdown
        onSelect={onSelect}
        className="block"
        id="child-category-selector__dropdown"
      >
        <Dropdown.Toggle>{selectedOptionObj.title}</Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem
            eventKey={selectedOptionObj.name}
            key={selectedOptionObj.name}
          >
            {selectedOptionObj.title}
          </MenuItem>
          <MenuItem divider />
          {feedSortOptions.map(option => (
            <MenuItem eventKey={option.name} key={option.name}>
              {option.title}
            </MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

FeedSortDropdown.propTypes = {
  selectedSort: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
