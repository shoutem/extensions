import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { find, next } from '@shoutem/redux-io';
import { isError, shouldRefresh } from '@shoutem/redux-io/status';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import LargeVimeoView from '../components/LargeVimeoView';
import { ext } from '../const';
import { VIMEO_SCHEMA, getVimeoFeed } from '../redux';

export class VimeoList extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: VIMEO_SCHEMA,
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

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  const feedUrl = _.get(shortcut, 'settings.feedUrl');

  return {
    feedUrl,
    data: getVimeoFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { find, next };

export default connect(mapStateToProps, mapDispatchToProps)(VimeoList);
