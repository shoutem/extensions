import React from 'react';
import { Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, Image, Text, View } from '@shoutem/ui';
import { authenticate, getUser } from 'shoutem.auth';
import { images } from '../assets';
import { ext } from '../const';
import { blockUser, loadUser } from '../redux';
import {
  openBlockOrReportActionSheet,
  openProfileForLegacyUser,
} from '../services';

function StatusHeader({
  createdAt,
  firstName,
  goBackAfterBlock,
  lastName,
  profileImageUrl,
  screenName,
  userId,
  style,
}) {
  const dispatch = useDispatch();

  const ownUser = useSelector(getUser);

  const navigation = useNavigation();

  const resolvedName = screenName || `${firstName} ${lastName}`;

  function handleBlockUser() {
    dispatch(
      authenticate(async () => {
        await dispatch(loadUser(`legacyUser:${userId}`));
        dispatch(blockUser(userId, ownUser.legacyId)).then(() => {
          if (goBackAfterBlock) {
            navigation.goBack();
          }
        });
      }),
    );
  }

  function handleReportButtonPress() {
    const isBlockAllowed = ownUser?.legacyId?.toString() !== userId.toString();

    return openBlockOrReportActionSheet(isBlockAllowed, handleBlockUser);
  }

  function handleOpenProfile() {
    openProfileForLegacyUser(dispatch)({ id: userId });
  }

  const resolvedProfileImage = profileImageUrl
    ? { uri: profileImageUrl }
    : images.defaultProfileAvatar;

  return (
    <View styleName="horizontal v-center space-between md-gutter">
      <View styleName="horizontal flex-start v-center">
        <Pressable onPress={handleOpenProfile}>
          <Image
            styleName="small-avatar placeholder md-gutter-right"
            source={resolvedProfileImage}
            style={style.profileImage}
          />
        </Pressable>
        <View styleName="vertical">
          <Pressable onPress={handleOpenProfile}>
            <Text>{resolvedName}</Text>
          </Pressable>
          <Caption>{moment(createdAt).fromNow()}</Caption>
        </View>
      </View>
      <View styleName="md-gutter-vertical md-gutter-left">
        <Pressable onPress={handleReportButtonPress}>
          <Icon name="more-horizontal" style={style.moreIcon} />
        </Pressable>
      </View>
    </View>
  );
}

StatusHeader.propTypes = {
  createdAt: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  screenName: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  goBackAfterBlock: PropTypes.bool,
  lastName: PropTypes.string,
  profileImageUrl: PropTypes.string,
  style: PropTypes.object,
};

StatusHeader.defaultProps = {
  goBackAfterBlock: false,
  lastName: undefined,
  profileImageUrl: undefined,
  style: {},
};

export default connectStyle(ext('StatusHeader'))(StatusHeader);
