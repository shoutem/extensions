import React from 'react';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Card,
  Icon,
  Spinner,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import EpisodeProgress from './EpisodeProgress';
import { EpisodeView } from './EpisodeView';
import { FavoriteButton } from './FavoriteButton';

/**
 * A component used to render a single grid episode item
 */
export class GridEpisodeView extends EpisodeView {
  render() {
    const {
      episode,
      isFavorited,
      downloadInProgress,
      appHasFavoritesShortcut,
      shortcutSettings,
      style,
    } = this.props;
    const { enableDownload, feedUrl } = shortcutSettings;
    const { timeUpdated, title } = episode;

    const isDownloaded = downloadInProgress !== undefined;
    const momentDate = moment(timeUpdated);
    const iconName = isDownloaded ? 'delete' : 'download';
    const handleDownloadManagerPress = isDownloaded
      ? this.onDeletePress
      : id => this.onDownloadPress(id, feedUrl);
    const imageUrl = this.getImageUrl(episode);

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <FastImage
            source={{ uri: imageUrl, priority: 'normal' }}
            defaultSource={assets.noImagePlaceholder}
            style={style.image}
          />
          <View styleName="flexible space-between clear">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            <View styleName="horizontal md-gutter-top space-between">
              {!!momentDate.isAfter(0) && (
                <Caption>{momentDate.fromNow()}</Caption>
              )}
              <View styleName="horizontal">
                {!!appHasFavoritesShortcut && (
                  <FavoriteButton
                    isFavorited={isFavorited}
                    onPress={this.onFavoritePress}
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
            <EpisodeProgress episode={episode} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('GridEpisodeView'), {})(GridEpisodeView);
