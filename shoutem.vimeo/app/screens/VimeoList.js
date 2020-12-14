import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { find, next } from '@shoutem/redux-io';

import { navigateTo } from 'shoutem.navigation';
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

  openDetailsScreen(video) {
    const { navigateTo, feedUrl } = this.props;

    const route = {
      screen: ext('VimeoDetails'),
      props: {
        video,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  renderRow(video) {
    return (
      <LargeVimeoView video={video} onPress={this.openDetailsScreen} />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');

  return {
    feedUrl,
    data: getVimeoFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(VimeoList);
