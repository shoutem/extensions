import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import {
  View,
  Image,
  Subtitle,
  Caption,
  Text,
  Divider,
  TouchableOpacity,
  Lightbox,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import LikeButton from '../components/LikeButton';
import CommentButton from '../components/CommentButton';
import { post as postShape } from '../components/shapes';
import { adaptSocialUserForProfileScreen } from '../services/userProfileDataAdapter';
import { ext } from '../const';

const { func, bool, object, array } = React.PropTypes;

export default class StatusView extends React.Component {
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
    openStatusDetails: () => {},
    enableImageFullScreen: false,
    enableInteractions: true,
    enableComments: true,
  };

  constructor(props) {
    super(props);

    this.handleClickOnStatus = this.handleClickOnStatus.bind(this);
    this.handleClickOnUser = this.handleClickOnUser.bind(this);
    this.handleClickOnLikes = this.handleClickOnLikes.bind(this);
    this.formatLikeText = this.formatLikeText.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderStatusText = this.renderStatusText.bind(this);
    this.renderStatusAttachments = this.renderStatusAttachments.bind(this);
    this.renderLikesAndCommentsInfo = this.renderLikesAndCommentsInfo.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.interactionsAreEnabled = this.interactionsAreEnabled.bind(this);
    this.commentsAreEnabled = this.commentsAreEnabled.bind(this);
  }

  handleClickOnStatus() {
    const { status, openStatusDetails } = this.props;

    openStatusDetails(status.id);
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

  formatLikeText() {
    const { status, showUsersWhoLiked } = this.props;
    const numOfLikes = status.shoutem_favorited_by ? status.shoutem_favorited_by.count : 0;

    let likesText;
    if (showUsersWhoLiked && numOfLikes >= 1) {
      const firstNames = _.map(_.get(status, 'shoutem_favorited_by.users'), 'first_name');
      let othersCount;

      switch (numOfLikes) {
        case 1:
          likesText = I18n.t(ext('numberOfLikesMessage'), { 
            firstUser: firstNames[0],
            count: numOfLikes || 0,
          });
          break;
        case 2:
          likesText = I18n.t(ext('numberOfLikesMessage'), { 
            firstUser: firstNames[0], 
            secondUser: firstNames[1], 
            count: numOfLikes || 0,
          });
          break;
        default:
          othersCount = numOfLikes - 2;
          likesText = I18n.t(ext('numberOfOtherUserLikesMessage'), { 
            firstUser: firstNames[0],
            secondUser: firstNames[1],
            count: othersCount || 0,
          });
      }
    } else if (numOfLikes >= 1) {
      likesText = I18n.t(ext('numberOfLikes'), { count: numOfLikes || 0 })
    }

    return likesText;
  }

  interactionsAreEnabled() {
    const { enableInteractions } = this.props;
    return enableInteractions;
  }

  commentsAreEnabled() {
    const { enableComments } = this.props;
    return enableComments;
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
    const { status } = this.props;
    const { text } = status;

    return (
      <TouchableOpacity onPress={this.handleClickOnStatus}>
        <View>
          <Text styleName="md-gutter-top multiline">{text}</Text>
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
    const { status } = this.props;
    const numOfComments = status.shoutem_reply_count;

    const likeInfo = this.interactionsAreEnabled() ?
      <TouchableOpacity onPress={this.handleClickOnLikes}>
        <Caption>{this.formatLikeText()}</Caption>
      </TouchableOpacity> : null;

    const commentInfo = this.commentsAreEnabled() ?
      <TouchableOpacity onPress={this.handleClickOnStatus}>
        <Caption>{I18n.t(ext('numberOfComments'), { count: numOfComments || 0 })}</Caption>
      </TouchableOpacity> : null;

    const likesAndCommentsPlaceholder = likeInfo || commentInfo ?
      <View styleName="horizontal solid space-between md-gutter ">
        {likeInfo}
        {commentInfo}
      </View> :
      <View styleName="sm-gutter" />;

    return likesAndCommentsPlaceholder;
  }

  renderButtons() {
    const { status, addComment, onLikeAction } = this.props;

    const likeButton = this.interactionsAreEnabled() ?
      <LikeButton
        status={status}
        onLikeAction={onLikeAction}
      /> : null;

    const commentButton = this.commentsAreEnabled() ?
      <CommentButton
        status={status}
        addComment={addComment}
      /> : null;

    return (
      <View styleName="horizontal flexible">
        <Divider styleName="line" />
        {likeButton}
        {commentButton}
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
