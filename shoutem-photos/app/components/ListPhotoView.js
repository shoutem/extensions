import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  TouchableOpacity,
  Card,
  View,
  Title,
  Caption,
  Image,
  Tile
} from '@shoutem/ui';

import { fallbackImage } from '../index.js';

/**
 * A component used to render a single list photo item
 */
export default class ListPhotoView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    photo: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.photo);
  }

  render() {
    const { photo } = this.props;
    const nameText = photo.name ? photo.name.toUpperCase() : "" || photo.title ? photo.title.toUpperCase() : "";
    const imageUrl = _.get(photo, 'image.url') || _.get(photo, 'imageAttachments[0].url');

    return (
        <View key={photo.id}>
          <TouchableOpacity onPress={this.onPress}>
            <Tile>
                <Image
                    styleName='large-wide'
                    source={{ uri: imageUrl }}
                    defaultSource={fallbackImage}
                />
                <View styleName='content'>
                    <Title styleName='md-gutter' numberOfLines={2}>{nameText}</Title>
                    <Caption styleName='md-gutter'>{moment(photo.timeUpdated).fromNow()}</Caption>
                </View>
            </Tile>      
          </TouchableOpacity> 
        </View>
    );
  }
}