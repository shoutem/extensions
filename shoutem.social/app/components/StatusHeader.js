import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ActionSheet, Caption, Icon, Image, Text, View } from '@shoutem/ui';
import { authenticate, getUser } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ext } from '../const';
import { blockUser, loadUser } from '../redux';
import { openProfileForLegacyUser } from '../services';

const StatusHeader = ({
  createdAt,
  firstName,
  goBackAfterBlock,
  lastName,
  profileImageUrl,
  screenName,
  userId,
  style,
}) => {
  const dispatch = useDispatch();

  const [mainActionSheetOpen, setMainActionSheetOpen] = useState(false);
  const [reportActionSheetOpen, setReportActionSheetOpen] = useState(false);

  const ownUser = useSelector(getUser);

  const navigation = useNavigation();

  const resolvedName = screenName || `${firstName} ${lastName}`;

  const handleReportUser = useCallback(() => {
    setReportActionSheetOpen(false);
    Alert.alert(
      I18n.t(ext('reportSuccessTitle')),
      I18n.t(ext('reportSuccessMessage')),
    );
  }, []);

  const handleBlockUser = useCallback(() => {
    dispatch(
      authenticate(async () => {
        await dispatch(loadUser(`legacyUser:${userId}`));
        dispatch(blockUser(userId, ownUser.legacyId)).then(() => {
          () => setMainActionSheetOpen(false);
          if (goBackAfterBlock) {
            navigation.goBack();
          }
        });
      }),
    );
  }, [dispatch, goBackAfterBlock, navigation, ownUser.legacyId, userId]);

  const handleOpenProfile = () => {
    const isOwnUserProfile =
      ownUser?.legacyId?.toString() === userId.toString();

    dispatch(openProfileForLegacyUser(userId, isOwnUserProfile));
  };

  const resolvedProfileImage = profileImageUrl
    ? { uri: profileImageUrl }
    : images.defaultProfileAvatar;

  const mainActionSheetOptions = useMemo(() => {
    const cancelOptions = [
      {
        title: I18n.t(ext('reportOptionCancel')),
        onPress: () => setMainActionSheetOpen(false),
      },
    ];

    const confirmOptions = [
      {
        title: I18n.t(ext('blockOption')),
        onPress: handleBlockUser,
      },
      {
        title: I18n.t(ext('reportPostOption')),
        onPress: () =>
          setMainActionSheetOpen(
            false,
            _.delay(() => setReportActionSheetOpen(true), 150),
          ),
      },
    ];

    return {
      cancelOptions,
      confirmOptions,
    };
  }, [handleBlockUser]);

  const reportActionSheetOptions = useMemo(() => {
    const cancelOptions = [
      {
        title: I18n.t(ext('reportOptionCancel')),
        onPress: () => setReportActionSheetOpen(false),
      },
    ];

    const confirmOptions = [
      {
        title: I18n.t(ext('reportOptionSpam')),
        onPress: handleReportUser,
      },
      {
        title: I18n.t(ext('reportOptionInappropriate')),
        onPress: handleReportUser,
      },
      {
        title: I18n.t(ext('reportOptionAbuse')),
        onPress: handleReportUser,
      },
    ];

    return {
      cancelOptions,
      confirmOptions,
    };
  }, [handleReportUser]);

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
      {ownUser?.legacyId !== userId.toString() && (
        <View styleName="md-gutter-vertical md-gutter-left">
          <Pressable onPress={() => setMainActionSheetOpen(true)}>
            <Icon name="more-horizontal" style={style.moreIcon} />
          </Pressable>
        </View>
      )}
      <ActionSheet
        active={mainActionSheetOpen}
        cancelOptions={mainActionSheetOptions.cancelOptions}
        confirmOptions={mainActionSheetOptions.confirmOptions}
        onDismiss={() => setMainActionSheetOpen(false)}
      />
      <ActionSheet
        active={reportActionSheetOpen}
        cancelOptions={reportActionSheetOptions.cancelOptions}
        confirmOptions={reportActionSheetOptions.confirmOptions}
        onDismiss={() => setReportActionSheetOpen(false)}
      />
    </View>
  );
};

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
