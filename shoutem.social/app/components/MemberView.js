import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { images } from '../assets';
import { ext } from '../const';
import { user as userShape } from './shapes';

export function MemberView({
  user,
  style,
  onMenuPress,
  onMemberPress,
  isOwnUser,
  isBlocked,
}) {
  const renderLegacyUser = user => {
    // this is here because Image causes a crash if it receives null as url
    const imageUrl = _.get(user, 'profile_image_url');
    const resolvedImageUrl = imageUrl === null ? undefined : imageUrl;

    return (
      <TouchableOpacity key={user.id} onPress={onMemberPress}>
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
  };

  if (_.has(user, 'profile_image_url')) {
    // TODO: remove this once Antonio (TopHatCroat) merges legacy and
    // member users into one
    return renderLegacyUser(user);
  }

  // this is here because Image causes a crash if it receives null as url
  const imageUrl = _.get(user, 'profile.image');
  const resolvedImageSource = imageUrl
    ? { uri: imageUrl }
    : images.defaultProfileAvatar;
  const resolvedIconName = isBlocked ? 'close' : 'more-horizontal';

  const handleButtonPress = () => onMenuPress(user);
  const handleMemberItemPress = () => onMemberPress(user);

  return (
    <TouchableOpacity key={user.id} onPress={handleMemberItemPress}>
      <View>
        <Row>
          <Image style={style.avatar} source={resolvedImageSource} />
          <View styleName="vertical stretch space-between">
            <Subtitle>{_.get(user, 'profile.nick')}</Subtitle>
            <Subtitle style={style.userProfileName}>
              {_.get(user, 'profile.name')}
            </Subtitle>
            <Caption>{_.get(user, 'profile.profession')}</Caption>
          </View>
          {!isOwnUser && (
            <Button onPress={handleButtonPress} styleName="clear tight">
              <Icon name={resolvedIconName} style={style.menuButton} />
            </Button>
          )}
        </Row>
        <Divider styleName="line" />
      </View>
    </TouchableOpacity>
  );
}

MemberView.propTypes = {
  isOwnUser: PropTypes.bool.isRequired,
  user: userShape.isRequired,
  onMemberPress: PropTypes.func.isRequired,
  isBlocked: PropTypes.bool,
  style: PropTypes.object,
  onMenuPress: PropTypes.func,
};

MemberView.defaultProps = {
  onMenuPress: _.noop,
  isBlocked: false,
  style: {},
};

export default connectStyle(ext('MemberView'))(MemberView);
