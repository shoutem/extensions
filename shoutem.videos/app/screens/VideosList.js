import React from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { CmsListScreen } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import LargeVideoView from '../components/LargeVideoView';
import { ext } from '../const';
import { VIDEOS_SCHEMA } from '../redux';

export class VideosList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: VIDEOS_SCHEMA,
    };
  }

  openDetailsScreen(video) {
    const { navigateTo } = this.props;

    const route = {
      screen: ext('VideoDetails'),
      props: { video },
    };

    navigateTo(route);
  }

  renderRow(video) {
    return (
      <LargeVideoView
        video={video}
        onPress={this.openDetailsScreen}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestVideos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('VideosList'))(VideosList),
);
