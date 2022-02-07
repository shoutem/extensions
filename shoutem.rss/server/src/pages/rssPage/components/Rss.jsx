import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ControlLabel } from 'react-bootstrap';
import i18next from 'i18next';
import { isBusy, clear } from '@shoutem/redux-io';
import { ext } from 'context';
import { denormalizeCollection } from 'denormalizer';
import { getShortcut } from 'environment';
import normalizeUrl from 'normalize-url';
import {
  updateShortcutSettings,
  discoverFeeds,
  DISCOVERED_FEEDS,
} from './../reducer';
import FeedUrlInput from './FeedUrlInput';
import FeedSelector from './FeedSelector';
import FeedPreview from './FeedPreview';
import LOCALIZATION from './localization';

const ACTIVE_SCREEN_INPUT = 0;
const ACTIVE_SCREEN_SELECT = 1;
const ACTIVE_SCREEN_PREVIEW = 2;

export class Rss extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { discoverInProgress: false, error: '' };
  }

  componentDidUpdate(prevProps) {
    const { discoveredFeeds } = this.props;
    const { discoverInProgress } = this.state;

    if (
      discoveredFeeds !== prevProps.discoveredFeeds &&
      !isBusy(discoveredFeeds)
    ) {
      if (discoveredFeeds.length === 1) {
        this.onFeedSelectAddClick(discoveredFeeds[0].url);
        this.setState({
          discoverInProgress: false,
          error: '',
        });
      } else if (discoveredFeeds.length > 1) {
        this.setState({
          discoverInProgress: false,
          error: '',
        });
      } else {
        this.setState({
          discoverInProgress: false,
          error: discoverInProgress
            ? i18next.t(LOCALIZATION.INVALID_RSS_FEED)
            : '',
        });
      }
    }
  }

  onFeedUrlInputContinueClick(feedUrl) {
    const { discoverFeeds } = this.props;

    this.setState({ discoverInProgress: true, error: '' });
    discoverFeeds(feedUrl);
  }

  onFeedRemoveClick() {
    const {
      clearDiscoverFeeds,
      shortcut: { id },
      updateShortcutSettings,
    } = this.props;
    const settings = { feedUrl: null };

    updateShortcutSettings(id, settings);
    clearDiscoverFeeds();
  }

  onFeedSelectAddClick(feedUrl) {
    const { clearDiscoverFeeds } = this.props;

    this.setFeedUrl(feedUrl);
    clearDiscoverFeeds();
  }

  onFeedSelectCancelClick() {
    const { clearDiscoverFeeds } = this.props;

    clearDiscoverFeeds();
  }

  getActiveScreen() {
    const { discoveredFeeds, shortcut } = this.props;

    if (shortcut.settings?.feedUrl) {
      return ACTIVE_SCREEN_PREVIEW;
    } else if (discoveredFeeds.length > 1) {
      return ACTIVE_SCREEN_SELECT;
    }

    return ACTIVE_SCREEN_INPUT;
  }

  setFeedUrl(feedUrl) {
    const {
      shortcut: { id },
      updateShortcutSettings,
    } = this.props;
    const normalizedFeedUrl = normalizeUrl(feedUrl, { stripWWW: false });

    const settings = { feedUrl: normalizedFeedUrl };
    updateShortcutSettings(id, settings);
  }

  render() {
    const { discoveredFeeds, shortcut } = this.props;
    const { error } = this.state;

    const activeScreen = this.getActiveScreen();
    const feedUrl = shortcut.settings?.feedUrl;
    const feedType = shortcut.settings?.feedType;

    return (
      <div>
        {feedType && (
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_SHOW_FEED, { feedType })}
          </ControlLabel>
        )}
        {activeScreen === ACTIVE_SCREEN_INPUT && (
          <FeedUrlInput
            inProgress={isBusy(discoveredFeeds)}
            error={error}
            onContinueClick={this.onFeedUrlInputContinueClick}
          />
        )}
        {activeScreen === ACTIVE_SCREEN_SELECT && (
          <FeedSelector
            discoveredFeeds={discoveredFeeds}
            onAddClick={this.onFeedSelectAddClick}
            onCancelClick={this.onFeedSelectCancelClick}
          />
        )}
        {activeScreen === ACTIVE_SCREEN_PREVIEW && (
          <FeedPreview
            feedUrl={feedUrl}
            onRemoveClick={this.onFeedRemoveClick}
          />
        )}
      </div>
    );
  }
}

Rss.propTypes = {
  discoveredFeeds: PropTypes.array,
  shortcut: PropTypes.object,
  updateShortcutSettings: PropTypes.func,
  discoverFeeds: PropTypes.func,
  clearDiscoverFeeds: PropTypes.func,
};

function mapStateToProps(state) {
  const discoveredFeeds = denormalizeCollection(
    state[ext()].rssPage.discoveredFeeds,
    undefined,
    DISCOVERED_FEEDS,
  );
  const shortcut = getShortcut();

  return {
    discoveredFeeds,
    shortcut,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (id, settings) =>
      dispatch(updateShortcutSettings(id, settings)),
    discoverFeeds: url => dispatch(discoverFeeds(url)),
    clearDiscoverFeeds: () =>
      dispatch(clear(DISCOVERED_FEEDS, ext('discoveredFeeds'))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rss);
