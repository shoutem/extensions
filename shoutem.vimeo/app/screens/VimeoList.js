import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { find, next } from '@shoutem/redux-io';
import { isError, shouldRefresh } from '@shoutem/redux-io/status';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import LargeVimeoView from '../components/LargeVimeoView';
import { ext, VIMEO_COLLECTION_TAG } from '../const';
import { getVimeoFeed, VIMEO_SCHEMA } from '../redux';

export class VimeoList extends RssListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: VIMEO_SCHEMA,
      tag: VIMEO_COLLECTION_TAG,
    };
  }

  refreshData() {
    const { data } = this.props;

    if (shouldRefresh(data, true) && !isError(data)) {
      this.fetchData();
    }
  }

  openDetailsScreen(video) {
    const { feedUrl } = this.props;

    navigateTo(ext('VimeoDetails'), {
      video,
      feedUrl, // TODO: I don't see VimeoDetails using this prop, check this out later
    });
  }

  renderRow(video) {
    return <LargeVimeoView video={video} onPress={this.openDetailsScreen} />;
  }
}

VimeoList.propTypes = {
  ...RssListScreen.propTypes,
};

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  const shortcutId = _.get(shortcut, 'id');
  const feedUrl = _.get(shortcut, 'settings.feedUrl');

  return {
    feedUrl,
    data: getVimeoFeed(state, feedUrl),
    shortcutId,
  };
};

export const mapDispatchToProps = RssListScreen.createMapDispatchToProps({
  find,
  next,
});

export default connect(mapStateToProps, mapDispatchToProps)(VimeoList);
