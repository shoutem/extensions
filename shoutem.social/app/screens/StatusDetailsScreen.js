// @flow
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import {
  Alert,
  KeyboardAvoidingView,
  Keyboard as RNKeyboard,
  TextInput,
} from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import ImagePicker from 'react-native-image-picker';

import { isBusy, isInitialized, next, hasNext } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  ListView,
  Screen,
  View,
  Divider,
  Text,
  Icon,
  ImageBackground,
  Keyboard,
  Row,
} from '@shoutem/ui';

import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { NavigationBar, openInModal, navigateBack } from 'shoutem.navigation';

import CommentView from '../components/CommentView';
import { user as userShape } from '../components/shapes';
import StatusView from '../components/StatusView';
import { ext } from '../const';
import {
  loadComments,
  createComment,
  deleteStatus,
  deleteComment,
} from '../redux';
import { openProfileForLegacyUser } from '../services';

const { array, number, func, bool } = PropTypes;

export class StatusDetailsScreen extends PureComponent {
  static propTypes = {
    user: userShape.isRequired,
    comments: PropTypes.shape({
      data: array,
    }).isRequired,
    statusId: number.isRequired,
    statuses: array.isRequired,
    openUserLikes: func.isRequired,
    addComment: func.isRequired,
    onLikeAction: func.isRequired,
    loadComments: func.isRequired,
    scrollDownOnOpen: bool.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      text: '',
      numberOfCharacters: 0,
      image64Data: undefined,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { statusId, loadComments, scrollDownOnOpen } = this.props;

    loadComments(statusId).then((res) => {
      if (scrollDownOnOpen) {
        this.focusOnComment();
      }
    });
  }

  onSubmit() {
    this.setState({ text: '', image64Data: undefined });
  }

  handleTextChange(text) {
    this.setState({ text });
  }

  handleStatusCommentClick() {
    const { createComment, statusId, authenticate } = this.props;
    const { text, image64Data } = this.state;

    authenticate(() => {
      createComment(statusId, text, image64Data)
        .then(this.onSubmit())
        .then(this.scrollDownOnComment());
      RNKeyboard.dismiss();
      this.setState({ text: '' });
    });
  }

  captureScrollViewRef(component) {
    this.scrollView = component;
  }

  getCommentsLength() {
    return this.props.comments.data.length;
  }

  appendImage() {
    const options = {
      allowsEditing: true,
      maxHeight: 1024,
      maxWidth: 1024,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else if (!response.didCancel) {
        this.setState({ image64Data: response });
      }
    });
  }

  discardImage() {
    this.setState({ image64Data: undefined });
  }

  focusOnComment() {
    this.textInputRef.focus();
  }

  scrollDownOnComment() {
    if (this.getCommentsLength() > 3) {
      this.scrollView.scrollToEnd({ animated: true });
    }
  }

  loadMoreComments() {
    const { next, comments } = this.props;

    next(comments);
  }

  renderLoadingMoreText() {
    if (!hasNext(this.props.comments)) {
      return null;
    }

    return (
      <View styleName="horizontal h-center v-center md-gutter">
        <Text>{I18n.t(ext('loadingMoreComments'))}</Text>
        <Divider styleName="line" />
      </View>
    );
  }

  isStatusAuthorOrAppOwner() {
    const { statuses, statusId } = this.props;
    const status = _.find(statuses, { id: statusId });

    return _.get(status, 'deletable') === 'yes';
  }

  openActionSheet() {
    const { deleteStatus, statuses, statusId, navigateBack } = this.props;

    const status = _.find(statuses, { id: statusId });

    ActionSheet.showActionSheetWithOptions(
      {
        options: [
          I18n.t(ext('deleteStatusOption')),
          I18n.t(ext('cancelStatusSelectionOption')),
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (index) => {
        if (index === 0) {
          return deleteStatus(status).then(navigateBack());
        }
      },
    );
  }

  renderRightComponent() {
    if (!this.isStatusAuthorOrAppOwner()) {
      return null;
    }

    return (
      <View styleName="container" virtual>
        <Button onPress={this.openActionSheet}>
          <Icon name="more-horizontal" />
        </Button>
      </View>
    );
  }

  renderRow(comment) {
    const { openProfile, deleteComment } = this.props;

    return (
      <View>
        <CommentView
          openProfile={openProfile}
          comment={comment}
          deleteComment={deleteComment}
        />
        <Divider styleName="line" />
      </View>
    );
  }

  renderAddCommentSection() {
    const { enablePhotoAttachments, style } = this.props;
    const { image64Data } = this.state;

    const postButtonDisabled = this.state.text.length === 0 && !image64Data;
    const resolvedBehavior = Platform.OS === 'ios' ? 'padding' : '';
    const keyboardOffset = Keyboard.calculateKeyboardOffset();

    const addPhotoButton = enablePhotoAttachments && (
      <Button styleName="clear" onPress={this.appendImage}>
        <Icon name="take-a-photo" />
      </Button>
    );

    return (
      <KeyboardAvoidingView
        behavior={resolvedBehavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        {this.renderAttachedImage()}
        <Divider styleName="line" />
        <View styleName="horizontal v-center">
          {addPhotoButton}
          {this.renderCommentTextInput()}
          <Button
            styleName="clear"
            disabled={postButtonDisabled}
            onPress={this.handleStatusCommentClick}
          >
            <Text>{I18n.t(ext('postStatusButton'))}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }

  renderAttachedImage() {
    const { image64Data } = this.state;

    if (!image64Data) return null;
    return (
      <Row>
        <ImageBackground
          styleName="small md-gutter"
          source={{ uri: `data:image/jpg;base64,${image64Data.data}` }}
        >
          <View styleName="fill-parent horizontal v-start h-end">
            <Button styleName="tight clear" onPress={this.discardImage}>
              <Icon name="close" />
            </Button>
          </View>
        </ImageBackground>
      </Row>
    );
  }

  renderCommentTextInput() {
    const { text } = this.state;
    const { statusMaxLength, style } = this.props;

    return (
      <TextInput
        style={style.textInput}
        maxLength={statusMaxLength}
        multiline
        onChangeText={this.handleTextChange}
        placeholder={I18n.t(ext('newCommentPlaceholder'))}
        styleName="flexible"
        value={text}
        returnKeyType="next"
        ref={(ref) => {
          this.textInputRef = ref;
        }}
      />
    );
  }

  renderStatus() {
    const {
      statusId,
      statuses,
      openUserLikes,
      onLikeAction,
      openProfile,
      enableComments,
      enableInteractions,
    } = this.props;

    const status = _.find(statuses, { id: statusId });

    return (
      <View>
        <StatusView
          status={status}
          openUserLikes={openUserLikes}
          addComment={this.focusOnComment}
          onLikeAction={onLikeAction}
          openProfile={openProfile}
          showUsersWhoLiked
          enableImageFullScreen
          enableInteractions={enableInteractions}
          enableComments={enableComments}
        />
      </View>
    );
  }

  render() {
    const { enableComments, comments } = this.props;
    const commentsData = _.get(comments, 'data', []);
    const areCommentsLoading = isBusy(comments) && !isInitialized(comments);
    const hasMoreComments = hasNext(comments);
    const showAddCommentSection = !areCommentsLoading && enableComments;

    return (
      <Screen styleName="paper with-notch-padding">
        <NavigationBar
          title={I18n.t(ext('postDetailsNavBarTitle'))}
          renderRightComponent={this.renderRightComponent}
        />
        <Divider styleName="line" />
        <ListView
          data={commentsData}
          ref={this.captureScrollViewRef}
          loading={areCommentsLoading}
          renderHeader={this.renderStatus}
          renderRow={this.renderRow}
          renderFooter={this.renderLoadingMoreText}
          onLoadMore={this.loadMoreComments}
        />
        {showAddCommentSection && this.renderAddCommentSection()}
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  statuses: state[ext()].statuses.data,
  comments: _.get(state[ext()], ['comments', ownProps.statusId], {}),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      loadComments,
      openInModal,
      navigateBack,
      createComment,
      authenticate,
      next,
      deleteStatus,
      deleteComment,
    },
    dispatch,
  ),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('StatusDetailsScreen'))(StatusDetailsScreen));
