import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Platform, AppState } from 'react-native';
import {
  composeNavigationStyles,
  getRouteParams,
  withIsFocused,
} from 'shoutem.navigation';
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
} from '@shoutem/ui';
import { ext } from '../const';

function VideoDetails(props) {
  const { navigation } = props;
  const { video } = getRouteParams(props);

  const [appState, setAppState] = useState('active');

  const headerRight = () => {
    const { video, screenSettings } = getRouteParams(props);
    const { shareable = true } = screenSettings;

    if (!shareable) {
      return null;
    }
    return (
      <ShareButton styleName="clear" title={video.name} url={video.video.url} />
    );
  };

  const getNavbarProps = () => {
    return {
      ...composeNavigationStyles(['boxing']),
      headerRight,
      title: video.name || '',
    };
  };

  const handleAppStateChange = appState => {
    setAppState(appState);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    navigation.setOptions(getNavbarProps());

    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  // When an iOS device is locked, the video pauses automatically on android we have to explicitly
  // remove it from component tree.
  const isAppActive = appState === 'active';
  const isIos = Platform.OS === 'ios';
  const shouldRenderVideo = isAppActive || isIos;

  // For some reason we pass an object instead of a string, so another check is necessary.
  const thumbnailUrl = _.get(video, 'video.thumbnailurl');
  const resolvedThumbnailUrl = thumbnailUrl === null ? undefined : thumbnailUrl;

  return (
    <Screen styleName="paper">
      <ScrollView>
        {shouldRenderVideo && (
          <Video
            source={{ uri: video.video.url }}
            poster={resolvedThumbnailUrl}
          />
        )}
        <Tile styleName="text-centric">
          <Title styleName="md-gutter-bottom">{video.name}</Title>
          <Caption>
            {moment(video.timeCreated).fromNow()}
            {video.duration ? `    ${video.duration}` : ''}
          </Caption>
        </Tile>
        <SimpleHtml body={video.description} />
      </ScrollView>
    </Screen>
  );
}

VideoDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default withIsFocused(connectStyle(ext('VideoDetails'))(VideoDetails));
