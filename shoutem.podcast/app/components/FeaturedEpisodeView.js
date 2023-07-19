import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  ImageBackground,
  Spinner,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
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
          <ImageBackground
            source={episodeImage}
            styleName="featured placeholder"
          >
            <Tile>
              <Title>{(title || '').toUpperCase()}</Title>
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
            </Tile>
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
          </ImageBackground>
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
