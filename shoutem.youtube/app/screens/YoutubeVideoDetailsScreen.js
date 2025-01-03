import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import he from 'he';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Tile,
  Title,
  Video,
  View,
} from '@shoutem/ui';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { isIos } from 'shoutem-core';
import { ext } from '../const';

const YoutubeVideoDetailsScreen = props => {
  const { video } = getRouteParams(props);
  const title = he.decode(_.get(video, 'snippet.title', ''));
  // PlaylistItems API returns video ID value inside item.snippet.resourceId.videoId
  // Search API returns the same in item.id.videoId
  const videoSource =
    _.get(video, 'snippet.resourceId.videoId') || _.get(video, 'id.videoId');
  const titleSource = he.decode(_.get(video, 'snippet.title'));
  const videoUrl = `https://youtube.com/watch?v=${videoSource}`;

  const [appState, setAppState] = useState('active');

  const handleAppStateChange = appState => setAppState(appState);

  useEffect(() => {
    const { navigation } = props;

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    navigation.setOptions({
      ...composeNavigationStyles(['boxing']),
      // eslint-disable-next-line react/no-multi-comp
      headerRight: () => (
        <ShareButton styleName="clear" title={titleSource} url={videoUrl} />
      ),
      title,
    });

    return () => appStateListener.remove();
  }, []);

  const publishedAt = _.get(video, 'snippet.publishedAt');
  const descriptionSource = _.get(video, 'snippet.description');

  // When an iOS device is locked, the video pauses automatically
  // on android we have to explicitly remove it from component tree
  const isAppActive = appState === 'active';
  const shouldRenderVideo = isAppActive || isIos;

  return (
    <Screen styleName="paper">
      <ScrollView>
        {shouldRenderVideo && <Video source={{ uri: videoUrl }} />}
        <Tile styleName="text-centric">
          <Title styleName="md-gutter-bottom">{titleSource}</Title>
          <Caption>{moment(publishedAt).fromNow()}</Caption>
        </Tile>
        <View styleName="solid">
          <SimpleHtml body={descriptionSource} />
        </View>
      </ScrollView>
    </Screen>
  );
};

YoutubeVideoDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connectStyle(ext('YoutubeVideoDetailsScreen'))(
  YoutubeVideoDetailsScreen,
);
