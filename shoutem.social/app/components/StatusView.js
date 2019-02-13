import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';

import {
  View,
  Image,
  Subtitle,
  Caption,
  Divider,
  TouchableOpacity,
  Lightbox,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { adaptSocialUserForProfileScreen, formatLikeText } from '../services';
import { ext } from '../const';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import HtmlTextView from './HtmlTextView'
import { post as postShape } from './shapes';

const { func, bool } = PropTypes;

export default class StatusView extends PureComponent {
  static propTypes = {
    status: postShape.isRequired,
    addComment: func.isRequired,
    openUserLikes: func.isRequired,
    openStatusDetails: func,
    onLikeAction: func,
    openProfile: func,
    showUsersWhoLiked: bool,
    enableImageFullScreen: bool,
    enableInteractions: bool,
    enableComments: bool,
  };

  static defaultProps = {
    openStatusDetails: _.noop,
    enableImageFullScreen: false,
    enableInteractions: true,
    enableComments: true,
  };

  constructor(props) {
    super(props);

    this.handleClickOnStatus = this.handleClickOnStatus.bind(this);
    this.handleClickOnComments = this.handleClickOnComments.bind(this);
    this.handleClickOnUser = this.handleClickOnUser.bind(this);
    this.handleClickOnLikes = this.handleClickOnLikes.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderStatusText = this.renderStatusText.bind(this);
    this.renderStatusAttachments = this.renderStatusAttachments.bind(this);
    this.renderLikesAndCommentsInfo = this.renderLikesAndCommentsInfo.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  handleClickOnStatus() {
    const { status, openStatusDetails } = this.props;

    openStatusDetails(status.id);
  }

  handleClickOnComments() {
    this.handleClickOnStatus();
  }

  handleClickOnUser() {
    const { status, openProfile } = this.props;
    const { user } = status;

    openProfile(adaptSocialUserForProfileScreen(user));
  }

  handleClickOnLikes() {
    const { status, openUserLikes } = this.props;

    openUserLikes(status);
  }

  renderHeader() {
    const { status } = this.props;
    const { user, created_at } = status;
    const userProfileImage = user.profile_image_url || undefined;

    return (
      <View styleName="horizontal v-center">
        <TouchableOpacity onPress={this.handleClickOnUser}>
          <Image
            styleName="small-avatar placeholder"
            source={{ uri: userProfileImage }}
          />
        </TouchableOpacity>
        <View styleName="vertical md-gutter-left">
          <Subtitle>{`${user.name}`}</Subtitle>
          <Caption>{moment(created_at).fromNow()}</Caption>
        </View>
      </View>
    );
  }

  renderStatusText() {
    const { status: { text } } = this.props;

    return (
      <TouchableOpacity onPress={this.handleClickOnStatus}>
        <View>
          <HtmlTextView
            text={text}
            styleName="md-gutter-top"
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderStatusAttachments() {
    const { status, enableImageFullScreen } = this.props;
    const { shoutem_attachments: attachments } = status;

    const hasPicture = _.get(attachments, [0, 'type']) === 'picture';
    if (!hasPicture) {
      return null;
    }

    if (enableImageFullScreen) {
      return (
        <Lightbox activeProps={{ styleName: 'preview' }}>
          <Image
            styleName="large-wide"
            source={{ uri: attachments[0].url_large }}
          />
        </Lightbox>
      );
    }

    return (
      <Image
        styleName="large-wide"
        source={{ uri: attachments[0].url_large }}
      />
    );
  }

  renderLikesAndCommentsInfo() {
    const {
      status,
      enableInteractions,
      enableComments,
      showUsersWhoLiked,
    } = this.props;

    const likesDisplayLabel = formatLikeText(status, showUsersWhoLiked);

    const numOfComments = _.get(status, 'shoutem_reply_count', 0);
    const commentsDisplayLabel = I18n.t(ext('numberOfComments'), {
      count: numOfComments,
    });

    if (!enableInteractions && !enableComments) {
      return  <View styleName="sm-gutter" />;
    }

    return (
      <View styleName="horizontal solid space-between md-gutter">
        {enableInteractions && (
          <TouchableOpacity onPress={this.handleClickOnLikes}>
            <Caption>{likesDisplayLabel}</Caption>
          </TouchableOpacity>
        )}
        {enableComments && (
          <TouchableOpacity onPress={this.handleClickOnComments}>
            <Caption>{commentsDisplayLabel}</Caption>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderButtons() {
    const {
      status,
      addComment,
      onLikeAction,
      enableComments,
      enableInteractions,
    } = this.props;

    return (
      <View styleName="horizontal flexible">
        <Divider styleName="line" />
        {enableInteractions && (
          <LikeButton
            status={status}
            onLikeAction={onLikeAction}
          />
        )}
        {enableComments && (
          <CommentButton
            status={status}
            addComment={addComment}
          />
        )}
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    return (
      <View styleName="vertical">
        <View styleName="vertical solid md-gutter">
          {this.renderHeader()}
          {this.renderStatusText()}
        </View>
        <TouchableOpacity onPress={this.handleClickOnStatus}>
          {this.renderStatusAttachments()}
        </TouchableOpacity>
        {this.renderLikesAndCommentsInfo()}
        {this.renderButtons()}
      </View>
    );
  }
}
