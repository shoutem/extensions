import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';

import { TrackPlayer } from 'shoutem.audio';
import { NavigationBar } from 'shoutem.navigation';
import { getLeadImageUrl, createRenderAttachment } from 'shoutem.rss';

import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Image,
  Html,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { PodcastPlayer } from '../components/PodcastPlayer';
import { ext } from '../const';

export class EpisodeDetailsScreen extends PureComponent {
  static propTypes = {
    episode: PropTypes.object.isRequired,
  };

  renderHeaderImage() {
    const { episode } = this.props;

    const episodeImageUrl = getLeadImageUrl(episode);

    return (
      <Image
        source={episodeImageUrl ? { uri: episodeImageUrl } : undefined}
        styleName="large placeholder"
      />
    );
  }

  renderPlayer() {
    const { episode } = this.props;

    const audioFile = _.get(episode, 'audioAttachments.0.src');

    if (!audioFile) {
      return null;
    }

    return (
      <PodcastPlayer
        episode={episode}
        url={audioFile}
      />
    );
  }

  render() {
    const { episode } = this.props;
    const { author, body, link, timeUpdated, title } = episode;

    const momentDate = moment(timeUpdated);
    const validDate = momentDate.isAfter(0);

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar share={{ link, title }}/>
        <ScrollView>
          {this.renderHeaderImage()}
          <View
            styleName="text-centric md-gutter-horizontal md-gutter-top vertical h-center"
          >
            <Title numberOfLines={2}>
              {title.toUpperCase()}
            </Title>
            <View styleName="horizontal collapsed sm-gutter-top" virtual>
              <Caption numberOfLines={1} styleName="collapsible">{author}</Caption>
              {validDate && (
                <Caption styleName="md-gutter-left">
                  {momentDate.fromNow()}
                </Caption>
              )}
            </View>
          </View>
          <View styleName="solid">
            <Html body={body} renderElement={createRenderAttachment(episode, 'image')} />
          </View>
        </ScrollView>
        {this.renderPlayer()}
      </Screen>
    );
  }
}

export default connectStyle(ext('EpisodeDetailsScreen'))(EpisodeDetailsScreen);
