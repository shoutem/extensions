import React from 'react';
import moment from 'moment';
import { ext } from '../const';

import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  RichMedia,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

function VideoDetails({ video }) {
  return (
    <Screen styleName="paper">
      <NavigationBar
        share={{
          title: video.name,
          text: video.description,
          link: video.video.url,
        }}
      />
      <ScrollView>
        <Video source={{ uri: video.video.url }} />

        <Tile styleName="text-centric">
          <Title styleName="md-gutter-bottom">{video.name}</Title>
          <Caption>
            {moment(video.timeCreated).fromNow()}{video.duration ? `    ${video.duration}` : ''}
          </Caption>
        </Tile>

        <RichMedia body={video.description} />
      </ScrollView>
    </Screen>
  );
}

VideoDetails.propTypes = {
  video: React.PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoDetails'))(VideoDetails);

