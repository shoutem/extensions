import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
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
import { ext } from '../const';
import { EpisodeView, mapDispatchToProps } from './EpisodeView';

/**
 * A component used to render a single grid episode item
 */
export class GridEpisodeView extends EpisodeView {
  render() {
    const { enableDownload, episode } = this.props;
    const { downloadInProgress, timeUpdated, title, path } = episode;

    const momentDate = moment(timeUpdated);
    const iconName = path ? 'delete' : 'download';
    const handleDownloadManagerPress = path
      ? this.onDeletePress
      : this.onDownloadPress;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <Image
            source={{ uri: this.getImageUrl(episode) }}
            styleName="medium-wide placeholder"
          />
          <View styleName="flexible space-between clear">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            {momentDate.isAfter(0) && (
              <View styleName="horizontal md-gutter-top space-between">
                <Caption>{momentDate.fromNow()}</Caption>
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
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps,
)(connectStyle(ext('GridEpisodeView'), {})(GridEpisodeView));
