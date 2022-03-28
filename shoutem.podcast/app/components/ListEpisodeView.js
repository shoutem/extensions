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
  Row,
  Spinner,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import { EpisodeView, mapDispatchToProps } from './EpisodeView';

/**
 * A component used to render a single list episode item
 */
export class ListEpisodeView extends EpisodeView {
  render() {
    const { enableDownload, episode, style } = this.props;
    const { downloadInProgress, path, timeUpdated, title } = episode;

    const momentDate = moment(timeUpdated);
    const iconName = path ? 'delete' : 'download';
    const handleDownloadManagerPress = path
      ? this.onDeletePress
      : this.onDownloadPress;
    const imageUrl = this.getImageUrl(episode);
    const episodeImage = imageUrl
      ? { uri: imageUrl }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Divider styleName="line" />
        <Row>
          <Image
            source={episodeImage}
            styleName="small rounded-corners placeholder"
          />
          <View styleName="horizontal v-center">
            <View styleName="space-between sm-gutter-right">
              <Subtitle numberOfLines={2} style={style.episodeTitle}>
                {title}
              </Subtitle>
              {momentDate.isAfter(0) && (
                <Caption>{momentDate.fromNow()}</Caption>
              )}
            </View>
            {enableDownload && !downloadInProgress && (
              <Button
                onPress={handleDownloadManagerPress}
                styleName="clear tight"
              >
                <Icon name={iconName} />
              </Button>
            )}
            {downloadInProgress && <Spinner />}
          </View>
          <Divider styleName="line" />
        </Row>
      </TouchableOpacity>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps,
)(connectStyle(ext('ListEpisodeView'), {})(ListEpisodeView));
