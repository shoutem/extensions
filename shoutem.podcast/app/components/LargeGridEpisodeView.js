import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Card,
  Icon,
  Image,
  Spinner,
  Subtitle,
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
 * A component used to render a single large grid episode item
 */
export class LargeGridEpisodeView extends EpisodeView {
  render() {
    const { enableDownload, episode, hasFavorites, isFavorited } = this.props;
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
        <Card styleName="flexible">
          <Image source={episodeImage} styleName="placeholder" />
          <View styleName="flexible space-between clear">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            <View styleName="horizontal space-between sm-gutter-top">
              <Caption>
                {momentDate.isAfter(0) ? momentDate.fromNow() : ''}
              </Caption>
              <View styleName="horizontal">
                {!!hasFavorites && (
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
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('LargeGridEpisodeView'), {})(LargeGridEpisodeView));
