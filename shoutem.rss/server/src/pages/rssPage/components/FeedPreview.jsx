import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import { isBusy } from '@shoutem/redux-io';
import { loadFeed } from './../reducer';
import { getFeedItems } from './../selectors';
import { ext } from 'context';
import LOCALIZATION from './localization';
import './style.scss';

export class FeedPreview extends Component {
  componentDidMount() {
    const { feedUrl, loadFeed } = this.props;

    loadFeed(feedUrl);
  }

  componentDidUpdate(prevProps) {
    const { feedUrl } = this.props;

    if (feedUrl !== prevProps.feedUrl && feedUrl) {
      const { loadFeed } = this.props;

      loadFeed(feedUrl);
    }
  }

  render() {
    const { feedUrl, onRemoveClick, feedItems } = this.props;

    const loading = isBusy(feedItems);

    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_LOADING_FROM)}
            </ControlLabel>
            <div className="feed-preview__feed-url-container">
              <div className="feed-preview__rss-img" />
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
          </FormGroup>
        </form>
        <div className="feed-preview__content">
          <table className="table feed-preview__table">
            <thead>
              <tr>
                <th className="feed-preview__table-date">
                  {i18next.t(LOCALIZATION.HEADER_DATE)}
                </th>
                <th className="feed-preview__table-title">
                  {i18next.t(LOCALIZATION.HEADER_TITLE)}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="2">{i18next.t(LOCALIZATION.LOADING_CONTENT)}</td>
                </tr>
              )}
              {!loading && feedItems.length === 0 && (
                <tr>
                  <td colSpan="2">{i18next.t(LOCALIZATION.NO_CONTENT)}</td>
                </tr>
              )}
              {!loading &&
                feedItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span title={item.dateTimeFormatted}>
                        {item.dateTimeDisplay}
                      </span>
                    </td>
                    <td>{item.title}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

FeedPreview.propTypes = {
  feedUrl: PropTypes.string,
  feedItems: PropTypes.array,
  onRemoveClick: PropTypes.func,
  loadFeed: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    feedItems: getFeedItems(state[ext()]),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadFeed: url => dispatch(loadFeed(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPreview);
