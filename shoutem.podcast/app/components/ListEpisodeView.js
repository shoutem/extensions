import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Image,
  Spinner,
  Subtitle,
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
import FavoriteButton from './FavoriteButton';

/**
 * A component used to render a single list episode item
 */
export class ListEpisodeView extends EpisodeView {
  render() {
    const { isActiveTrack, isPlaying } = this.state;
    const {
      enableDownload,
      episode,
      hasFavorites,
      isFavorited,
      savedProgress,
      style,
    } = this.props;
    const { downloadInProgress, timeUpdated, title } = episode;

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
        <Divider styleName="line" />
        <View styleName="sm-gutter-vertical">
          <View styleName="horizontal sm-gutter-horizontal space-between v-center">
            <Image
              source={episodeImage}
              styleName="small rounded-corners placeholder"
            />
            <View styleName="horizontal v-center sm-gutter-bottom">
              <View styleName="sm-gutter-right">
                <Subtitle numberOfLines={2} style={style.episodeTitle}>
                  {title}
                </Subtitle>
                {momentDate.isAfter(0) && (
                  <Caption>{momentDate.fromNow()}</Caption>
                )}
              </View>
              <>
                {!!hasFavorites && (
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
              </>
            </View>
          </View>
          <EpisodeProgress
            showPlaybackIcon={isActiveTrack}
            isPlaying={isPlaying}
            progressPercentage={savedProgress?.completionPercentage ?? 0}
            style={style.episodeProgress}
          />
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ListEpisodeView'), {})(ListEpisodeView));
