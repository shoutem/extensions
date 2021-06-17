import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  ImageBackground,
  Icon,
  Spinner,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { EpisodeView, mapDispatchToProps } from './EpisodeView';
import { ext } from '../const';

/**
 * A component used to render featured podcast episode
 */
export class FeaturedEpisodeView extends EpisodeView {
  render() {
    const { enableDownload, episode, style } = this.props;
    const { author, downloadInProgress, path, timeUpdated, title } = episode;

    const momentDate = moment(timeUpdated);
    const iconName = path ? 'delete' : 'download';
    const handleDownloadManagerPress = path
      ? this.onDeletePress
      : this.onDownloadPress;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="sm-gutter featured">
          <ImageBackground
            source={{ uri: this.getImageUrl(episode) }}
            styleName="featured placeholder"
          >
            <Tile>
              <Title>{(title || '').toUpperCase()}</Title>
              <View styleName="horizontal md-gutter-top" virtual>
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
            {enableDownload && !downloadInProgress && (
              <Button
                styleName="clear tight"
                onPress={handleDownloadManagerPress}
                style={style.downloadManagerButton}
              >
                <Icon name={iconName} />
              </Button>
            )}
            {downloadInProgress && (
              <Spinner style={style.downloadManagerButton} />
            )}
          </ImageBackground>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps,
)(connectStyle(ext('FeaturedEpisodeView'), {})(FeaturedEpisodeView));
