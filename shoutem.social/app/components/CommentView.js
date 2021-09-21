import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-action-sheet';
import { I18n } from 'shoutem.i18n';
import {
  View,
  Image,
  Subtitle,
  Caption,
  Row,
  TouchableOpacity,
  Lightbox,
  dimensionRelativeToIphone,
} from '@shoutem/ui';
import { ext } from '../const';
import HtmlTextView from './HtmlTextView';
import { adaptSocialUserForProfileScreen } from '../services';
import { comment as commentShape } from './shapes';

export default function CommentView({ comment, openProfile, deleteComment }) {
  const handleClickOnUser = () => {
    const { user } = comment;

    openProfile(adaptSocialUserForProfileScreen(user));
  };

  const renderStatusAttachments = () => {
    const { shoutem_attachments: attachments } = comment;
    const hasPicture = _.get(attachments, [0, 'type']) === 'picture';

    if (!hasPicture) {
      return null;
    }

    return (
      <Lightbox activeProps={{ styleName: 'preview' }}>
        <Image
          style={{
            width: dimensionRelativeToIphone(305),
            height: dimensionRelativeToIphone(163),
          }}
          source={{ uri: attachments[0].url_large }}
        />
      </Lightbox>
    );
  };

  const showActionSheet = () => {
    if (_.get(comment, 'deletable') !== 'yes') {
      return;
    }

    ActionSheet.showActionSheetWithOptions(
      {
        options: [
          I18n.t(ext('deleteCommentOption')),
          I18n.t(ext('cancelCommentSelectionOption')),
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      index => {
        if (index === 0) {
          deleteComment(comment);
        }
      },
    );
  };

  // eslint-disable-next-line camelcase
  const { user, created_at, text } = comment;
  const profileImageUrl = user.profile_image_url;

  return (
    <TouchableOpacity onLongPress={showActionSheet}>
      <Row>
        <TouchableOpacity styleName="top" onPress={handleClickOnUser}>
          <Image
            styleName="small-avatar placeholder top"
            source={{ uri: profileImageUrl || undefined }}
          />
        </TouchableOpacity>
        <View styleName="vertical md-gutter-left">
          <View styleName="horizontal space-between">
            <Subtitle>{`${user.name}`}</Subtitle>
            <Caption>{moment(created_at).fromNow()}</Caption>
          </View>
          <HtmlTextView text={text} />
          {renderStatusAttachments()}
        </View>
      </Row>
    </TouchableOpacity>
  );
}

CommentView.propTypes = {
  comment: commentShape.isRequired,
  openProfile: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};
