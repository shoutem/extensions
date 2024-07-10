import React from 'react';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Spinner,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import EpisodeProgress from './EpisodeProgress';
import {
  EpisodeView,
  mapDispatchToProps,
  mapStateToProps,
} from './EpisodeView';
import { FavoriteButton } from './FavoriteButton';

/**
 * A component used to render featured podcast episode
 */
export class FeaturedEpisodeView extends EpisodeView {
  render() {
    const {
      enableDownload,
      episode,
      hasFavorites,
      isFavorited,
      style,
    } = this.props;
    const { author, downloadInProgress, timeUpdated, title } = episode;

    const isDownloaded = downloadInProgress !== undefined;
    const momentDate = moment(timeUpdated);
    const iconName = isDownloaded ? 'delete' : 'download';
    const handleDownloadManagerPress = isDownloaded
      ? this.onDeletePress
      : this.onDownloadPress;
    const imageUrl = this.getImageUrl(episode);
    const episodeImage = imageUrl
      ? { uri: imageUrl }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="sm-gutter featured">
          <FastImage source={episodeImage} style={style.imageBackground}>
            <View style={style.episodeInfo}>
              <View style={style.actionButtonContainer}>
                {!!hasFavorites && (
                  <FavoriteButton
                    onPress={this.onFavoritePress}
                    isFavorited={isFavorited}
                  />
                )}
                {!!enableDownload && !downloadInProgress && (
                  <Button
                    styleName="clear tight"
                    onPress={handleDownloadManagerPress}
                  >
                    <Icon name={iconName} />
                  </Button>
                )}
                {!!downloadInProgress && (
                  <Spinner style={style.downloadManagerButton} />
                )}
              </View>
            </View>
            <Title style={style.title}>{(title ?? '').toUpperCase()}</Title>
            <View styleName="horizontal md-gutter-top">
              <Caption numberOfLines={1} styleName="collapsible">
                {author}
              </Caption>
              {momentDate.isAfter(0) && (
                <Caption styleName="md-gutter-left">
                  {momentDate.fromNow()}
                </Caption>
              )}
            </View>

            <EpisodeProgress
              episode={episode}
              style={{
                container: style.episodeProgressContainer,
              }}
            />
          </FastImage>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FeaturedEpisodeView'), {})(FeaturedEpisodeView));
