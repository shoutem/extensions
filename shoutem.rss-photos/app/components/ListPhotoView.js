import React, { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Caption,
  Image,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

/**
 * A component used to render a single list photo item
 */
export default class ListPhotoView extends PureComponent {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { onPress, photo } = this.props;

    if (_.isFunction(onPress)) {
      onPress(photo);
    }
  }

  render() {
    const { photo } = this.props;

    const title = _.get(photo, 'title');
    const photoImage = _.get(photo, 'source');
    const timeUpdated = _.get(photo, 'timeUpdated') !== '1900-01-01T00:00:00';
    const photoSource = photoImage || assets.noImagePlaceholder;

    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress}>
          <Tile>
            <Image styleName="large-banner" source={photoSource} />
            <View styleName="content md-gutter">
              <Title numberOfLines={2}>{title.toUpperCase()}</Title>
              <Caption>
                {timeUpdated && moment(photo.timeUpdated).fromNow()}
              </Caption>
            </View>
          </Tile>
        </TouchableOpacity>
      </View>
    );
  }
}

ListPhotoView.propTypes = {
  photo: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
