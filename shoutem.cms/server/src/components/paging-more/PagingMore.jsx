import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import { Button } from 'react-bootstrap';
import LOCALIZATION from './localization';
import './style.scss';

export default function PagingMore({ onLoadMoreClick }) {
  return (
    <div className="paging-more-container">
      <Button bsSize="small" onClick={onLoadMoreClick}>
        {i18next.t(LOCALIZATION.LOAD_MORE)}
      </Button>
    </div>
  );
}

PagingMore.propTypes = {
  onLoadMoreClick: PropTypes.func.isRequired,
};
