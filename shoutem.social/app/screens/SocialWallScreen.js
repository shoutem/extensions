import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getExtensionSettings } from 'shoutem.application/redux';
import { RemoteDataListScreen } from 'shoutem.application';
import { getUser, isAuthenticated } from 'shoutem.auth/redux';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  navigateTo,
  getRouteParams,
  HeaderIconButton,
} from 'shoutem.navigation';
import { next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  Row,
  Image,
  Text,
  View,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';
import StatusView from '../components/StatusView';
import { ext } from '../const';
import {
  loadStatuses,
  createStatus,
  likeStatus,
  unlikeStatus,
  selectors,
  blockUser,
} from '../redux';
import {
  openProfileForLegacyUser,
  currentUserOwnsStatus,
  openBlockOrReportActionSheet,
} from '../services';

export class SocialWallScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    data: PropTypes.object, // overriden because data is object that contains property "data" which is array
  };

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

  openStatusDetails(statusId, scrollDownOnOpen = false) {
    const {
      user,
      statusMaxLength,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
    } = this.props;
    const { title } = getRouteParams(this.props);

    const routeParams = {
      title,
      user,
      statusId,
      addComment: this.addComment,
      openUserLikes: this.openUserLikes,
      onLikeAction: this.onLikeAction,
      statusMaxLength,
      enableComments,
      enableInteractions,
      enablePhotoAttachments,
      scrollDownOnOpen,
    };

    navigateTo(ext('StatusDetailsScreen'), routeParams);
  }

  addComment(statusId) {
    this.openStatusDetails(statusId, true);
  }

  newStatus() {
    const {
      navigation,
      user,
      createStatus,
      statusMaxLength,
      enablePhotoAttachments,
    } = this.props;

    const routeParams = {
      title: I18n.t(ext('newStatusTitle')),
      placeholder: I18n.t(ext('newStatusPlaceholder')),
      user,
      enablePhotoAttachments,
      statusMaxLength,
      onStatusCreated: (status, attachment) => {
        createStatus(status, attachment).then(navigation.goBack());
      },
    };

    navigateTo(ext('CreateStatusScreen'), routeParams);
  }

  handleMenuPress(status) {
    const { blockUser, user, authenticate } = this.props;
    const statusOwner = _.get(status, 'user');

    const handleBlockUser = () =>
      authenticate(currentUser =>
        blockUser(statusOwner.id, currentUser.legacyId),
      );

    const isBlockAllowed = !currentUserOwnsStatus(user, statusOwner);

    return openBlockOrReportActionSheet(isBlockAllowed, handleBlockUser);
  }

  onLikeAction(status) {
    const { likeStatus, unlikeStatus, authenticate } = this.props;

    if (!status.liked) {
      authenticate(() => likeStatus(status.id));
    } else {
      unlikeStatus(status.id);
    }
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

  getUsersWhoLiked(status) {
    return _.get(status, 'shoutem_favorited_by.users');
  }

  openUserLikes(status) {
    const routeParams = {
      title: I18n.t(ext('viewStatusLikes')),
      users: this.getUsersWhoLiked(status),
    };

    navigateTo(ext('MembersScreen'), routeParams);
  }

  openMyProfile() {
    const { user, openProfile } = this.props;

    openProfile(user);
  }

  fetchData() {
    const { loadStatuses } = this.props;

    InteractionManager.runAfterInteractions(() => {
      loadStatuses();
    });
  }

  loadMore() {
    const { data, next } = this.props;

    next(data);
  }

  renderRow(data) {
    const { enableComments, enableInteractions, openProfile } = this.props;

    return (
      <View styleName="sm-gutter-bottom">
        <StatusView
          status={data}
          openStatusDetails={this.openStatusDetails}
          openUserLikes={this.openUserLikes}
          addComment={this.addComment}
          onLikeAction={this.onLikeAction}
          onMenuPress={this.handleMenuPress}
          openProfile={openProfile}
          enableComments={enableComments}
          enableInteractions={enableInteractions}
        />
      </View>
    );
  }

  getListProps() {
    const {
      statuses: { data },
    } = this.props;

    return {
      data,
    };
  }

  renderAddNewStatusSection() {
    const { user } = this.props;
    // eslint-disable-next-line camelcase
    const { profile_image_url } = user;

    return (
      <TouchableOpacity onPress={this.newStatus}>
        <View styleName="sm-gutter-bottom">
          <Row styleName="small">
            <TouchableOpacity onPress={this.openMyProfile}>
              <Image
                styleName="small-avatar"
                source={{ uri: profile_image_url }}
              />
            </TouchableOpacity>
            <Text styleName="sm-gutter-right md-gutter-left">
              {I18n.t(ext('newStatusPlaceholder'))}
            </Text>
          </Row>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { data, style } = this.props;

    return (
      <Screen style={style.screen}>
        <Divider styleName="line" />
        {this.renderAddNewStatusSection()}
        {this.renderData(data)}
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const extension = getExtensionSettings(state, ext());

  return {
    data: selectors.getStatuses(state),
    statuses: selectors.getStatusesForUser(state),
    user: getUser(state) || {},
    statusMaxLength: Number(_.get(extension, 'maxStatusLength', 140)),
    enablePhotoAttachments: _.get(extension, 'enablePhotoAttachments', true),
    enableComments: _.get(extension, 'enableComments', true),
    enableInteractions: _.get(extension, 'enableInteractions', true),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SocialWallScreen'))(SocialWallScreen));
