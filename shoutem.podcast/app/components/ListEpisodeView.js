import React from 'react';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Spinner,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { unavailableInWeb } from 'shoutem.application';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import EpisodeProgress from './EpisodeProgress';
import { EpisodeView } from './EpisodeView';
import FavoriteButton from './FavoriteButton';

/**
 * A component used to render a single list episode item
 */
export class ListEpisodeView extends EpisodeView {
  render() {
    const {
      episode,
      isFavorited,
      downloadInProgress,
      appHasFavoritesShortcut,
      shortcutSettings,
      style,
    } = this.props;
    const { enableDownload } = shortcutSettings;
    const { timeUpdated, title } = episode;

    const isDownloaded = downloadInProgress !== undefined;
    const momentDate = moment(timeUpdated);
    const iconName = isDownloaded ? 'delete' : 'download';
    const handleDownloadManagerPress = unavailableInWeb(
      isDownloaded ? this.onDeletePress : this.onDownloadPress,
    );
    const imageUrl = this.getImageUrl(episode);

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Divider styleName="line" />
        <View styleName="sm-gutter-vertical sm-gutter-horizontal">
          <View styleName="horizontal sm-gutter-horizontal v-center">
            <FastImage
              source={{ uri: imageUrl, priority: 'normal' }}
              defaultSource={assets.noImagePlaceholder}
              style={style.artwork}
            />
            <View styleName="flexible horizontal v-center sm-gutter-bottom">
              <View styleName="flexible md-gutter-horizontal">
                <Subtitle numberOfLines={2}>{title}</Subtitle>
                {momentDate.isAfter(0) && (
                  <Caption>{momentDate.fromNow()}</Caption>
                )}
              </View>
              <View styleName="horizontal">
                {!!appHasFavoritesShortcut && (
                  <FavoriteButton
                    onPress={this.onFavoritePress}
                    isFavorited={isFavorited}
                  />
                )}
                {!!enableDownload && !downloadInProgress && (
                  <Button
                    onPress={handleDownloadManagerPress}
                    styleName="clear tight"
                  >
                    <Icon name={iconName} />
                  </Button>
                )}
                {!!downloadInProgress && <Spinner />}
              </View>
            </View>
          </View>
          <EpisodeProgress episode={episode} style={style.episodeProgress} />
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('ListEpisodeView'), {})(ListEpisodeView);
