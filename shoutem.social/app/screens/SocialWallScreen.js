/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Image, Screen, Text, TouchableOpacity, View } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { authenticate } from 'shoutem.auth';
import { getUser, isAuthenticated } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { HeaderIconButton, navigateTo } from 'shoutem.navigation';
import { images } from '../assets';
import StatusView from '../components/StatusView';
import { ext } from '../const';
import {
  blockUser,
  createStatus,
  likeStatus,
  loadStatuses,
  selectors,
  unlikeStatus,
} from '../redux';
import { openProfileForLegacyUser } from '../services';

export class SocialWallScreen extends RemoteDataListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());

    super.componentDidMount();
  }

  getNavBarProps() {
    return { headerRight: this.renderSettingsButton };
  }

  handleNewStatusPress() {
    const {
      navigation,
      user,
      createStatus,
      statusMaxLength,
      extension: { enablePhotoAttachments },
    } = this.props;

    const routeParams = {
      title: I18n.t(ext('newStatusTitle')),
      placeholder: I18n.t(ext('newStatusPlaceholder')),
      user,
      enablePhotoAttachments,
      statusMaxLength,
      onStatusCreated: (status, attachment) => {
        createStatus(status, attachment).then(() => navigation.goBack());
      },
    };

    navigateTo(ext('CreateStatusScreen'), routeParams);
  }

  renderSettingsButton(props) {
    return (
      <HeaderIconButton
        {...props}
        iconName="settings"
        onPress={this.handleSettingsPress}
      />
    );
  }

  handleSettingsPress() {
    navigateTo(ext('NotificationSettingsScreen'));
  }

  openMyProfile() {
    const { user, openProfile } = this.props;

    openProfile(user);
  }

  fetchData() {
    const { loadStatuses } = this.props;

    loadStatuses();
  }

  loadMore() {
    const { data, next } = this.props;

    next(data);
  }

  renderRow(data) {
    const {
      extension: { enableComments, enableInteractions, enablePhotoAttachments },
    } = this.props;

    return (
      <StatusView
        status={data}
        enableComments={enableComments}
        enableInteractions={enableInteractions}
        enablePhotoAttachments={enablePhotoAttachments}
      />
    );
  }

  getListProps() {
    const {
      statuses: { data },
    } = this.props;

    return {
      data,
      renderHeader: this.renderAddNewStatusSection,
      showsVerticalScrollIndicator: false,
    };
  }

  renderAddNewStatusSection() {
    const { style, user } = this.props;

    const profileImageUrl = user?.profile?.image || user?.profile_image_url;

    const resolvedProfileAvatar = profileImageUrl
      ? { uri: profileImageUrl }
      : images.defaultProfileAvatar;

    return (
      <View styleName="horizontal md-gutter">
        <TouchableOpacity onPress={this.handleNewStatusPress}>
          <Image
            styleName="small-avatar md-gutter-right"
            source={resolvedProfileAvatar}
            style={style.profileAvatar}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleNewStatusPress}
          styleName="flexible sm-gutter-vertical md-gutter-left"
          style={style.newStatusInput}
        >
          <Text style={style.newStatusPlaceholderText}>
            {I18n.t(ext('newStatusPlaceholder'))}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { data, style } = this.props;

    return (
      <Screen styleName="paper" style={style.screen}>
        {this.renderData(data)}
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const extension = getExtensionSettings(state, ext());

  return {
    extension,
    data: selectors.getStatuses(state),
    statuses: selectors.getStatusesForUser(state),
    user: getUser(state),
    statusMaxLength: Number(_.get(extension, 'maxStatusLength', 140)),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      next,
      loadStatuses,
      createStatus,
      likeStatus,
      unlikeStatus,
      authenticate,
      isAuthenticated,
      blockUser,
    },
    dispatch,
  ),
  openProfile: openProfileForLegacyUser(dispatch),
});

SocialWallScreen.propTypes = {
  ...RemoteDataListScreen.propTypes,
  data: PropTypes.object, // overriden because data is object that contains property "data" which is array
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SocialWallScreen'))(SocialWallScreen));
