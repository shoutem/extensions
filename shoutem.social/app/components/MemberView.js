import React from 'react';

import {
  Image,
  Subtitle,
  Row,
  View,
  Caption,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';
import { user as userShape } from '../components/shapes';
import { adaptSocialUserForProfileScreen } from '../services/userProfileDataAdapter';

const { func } = React.PropTypes;

export default class MemberView extends React.Component {
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

    openProfile(adaptSocialUserForProfileScreen(user));
  }

  render() {
    const { user, openProfile } = this.props;

    return (
      <TouchableOpacity
        key={user.id}
        onPress={this.openUserProfile}
      >
        <View>
          <Row>
            <Image
              styleName="small rounded-corners placeholder"
              source={{ uri: user.profile_image_url || undefined }}
            />
            <View styleName="vertical stretch space-between">
              <Subtitle>{user.name}</Subtitle>
              <Caption>{user.profession}</Caption>
            </View>
          </Row>
          <Divider styleName="line" />
        </View>
      </TouchableOpacity>
    );
  }
}
