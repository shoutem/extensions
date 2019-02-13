import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import {
  Image,
  Subtitle,
  Row,
  View,
  Caption,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';

import { user as userShape } from './shapes';

const { func } = PropTypes;

export default class MemberView extends PureComponent {
  static propTypes = {
    user: userShape.isRequired,
    openProfile: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.openUserProfile = this.openUserProfile.bind(this);
  }

  openUserProfile() {
    const { user, openProfile } = this.props;

    openProfile(user);
  }

  renderLegacyUser(user) {
    // this is here because Image causes a crash if it receives null as url
    const imageUrl = _.get(user, 'profile_image_url');
    const resolvedImageUrl = imageUrl === (null) ? undefined : imageUrl;

    return (
      <TouchableOpacity
        key={user.id}
        onPress={this.openUserProfile}
      >
        <View>
          <Row>
            <Image
              styleName="small rounded-corners placeholder"
              source={{ uri: resolvedImageUrl }}
            />
            <View styleName="vertical stretch space-between">
              <Subtitle>{_.get(user, 'name')}</Subtitle>
            </View>
          </Row>
          <Divider styleName="line" />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { user } = this.props;

    if (_.has(user, 'profile_image_url')) {
      // TODO: remove this once Antonio (TopHatCroat) merges legacy and
      // member users into one
      return this.renderLegacyUser(user);
    }

    // this is here because Image causes a crash if it receives null as url
    const imageUrl = _.get(user, 'profile.image');
    const resolvedImageUrl = imageUrl === (null) ? undefined : imageUrl;

    return (
      <TouchableOpacity
        key={user.id}
        onPress={this.openUserProfile}
      >
        <View>
          <Row>
            <Image
              styleName="small rounded-corners placeholder"
              source={{ uri: resolvedImageUrl }}
            />
            <View styleName="vertical stretch space-between">
              <Subtitle>{_.get(user, 'profile.nick')}</Subtitle>
              <Subtitle
                style={{ fontStyle: 'italic', color: 'gray' }}
              >
                {_.get(user, 'profile.name')}
              </Subtitle>
              <Caption>{_.get(user, 'profile.profession')}</Caption>
            </View>
          </Row>
          <Divider styleName="line" />
        </View>
      </TouchableOpacity>
    );
  }
}
