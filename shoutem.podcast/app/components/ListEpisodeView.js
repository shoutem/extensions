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
    const {
      enableDownload,
      episode,
      hasFavorites,
      isFavorited,
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

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Divider styleName="line" />
        <View styleName="sm-gutter-vertical sm-gutter-horizontal">
          <View styleName="horizontal sm-gutter-horizontal space-between v-center">
            <FastImage
              source={{ uri: imageUrl, priority: FastImage.priority.normal }}
              defaultSource={assets.noImagePlaceholder}
              style={style.artwork}
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
          <EpisodeProgress episode={episode} style={style.episodeProgress} />
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
