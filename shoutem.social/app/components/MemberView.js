import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Image,
  Subtitle,
  Row,
  View,
  Caption,
  Divider,
  TouchableOpacity,
  Button,
  Icon,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { user as userShape } from './shapes';

export function MemberView({
  user,
  style,
  onMenuPress,
  showMenuIcon,
  openProfile,
  isBlocked,
}) {
  const handleOpenProfile = () => {
    openProfile(user);
  };

  const renderLegacyUser = user => {
    // this is here because Image causes a crash if it receives null as url
    const imageUrl = _.get(user, 'profile_image_url');
    const resolvedImageUrl = imageUrl === null ? undefined : imageUrl;

    return (
      <TouchableOpacity key={user.id} onPress={handleOpenProfile}>
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
  const resolvedImageUrl = imageUrl === null ? undefined : imageUrl;
  const resolvedIconName = isBlocked ? 'close' : 'more-horizontal';

  const handleButtonPress = () => onMenuPress(user);

  return (
    <TouchableOpacity key={user.id} onPress={handleOpenProfile}>
      <View>
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={{ uri: resolvedImageUrl }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{_.get(user, 'profile.nick')}</Subtitle>
            <Subtitle style={style.userProfileName}>
              {_.get(user, 'profile.name')}
            </Subtitle>
            <Caption>{_.get(user, 'profile.profession')}</Caption>
          </View>
          {showMenuIcon && (
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
  user: userShape.isRequired,
  openProfile: PropTypes.func.isRequired,
  onMenuPress: PropTypes.func,
  isBlocked: PropTypes.bool,
  showMenuIcon: PropTypes.bool,
};

MemberView.defaultProps = {
  onMenuPress: _.noop,
  isBlocked: false,
  showMenuIcon: true,
};

export default connectStyle(ext('MemberView'))(MemberView);
