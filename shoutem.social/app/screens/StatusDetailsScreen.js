import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Alert,
  KeyboardAvoidingView,
  Keyboard as RNKeyboard,
  TextInput,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionSheet from 'react-native-action-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { authenticate } from 'shoutem.auth';
import { getUser } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderIconButton } from 'shoutem.navigation';
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
  ActionSheet as ShoutemActionSheet,
} from '@shoutem/ui';
import {
  requestPermissions,
  PERMISSION_TYPES,
  RESULTS,
} from 'shoutem.permissions';
import CommentView from '../components/CommentView';
import { user as userShape } from '../components/shapes';
import StatusView from '../components/StatusView';
import { ext } from '../const';
import {
  loadComments,
  createComment,
  deleteStatus,
  deleteComment,
  selectors,
  blockUser,
} from '../redux';
import {
  openProfileForLegacyUser,
  currentUserOwnsStatus,
  openBlockOrReportActionSheet,
} from '../services';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const IMAGE_PICKER_OPTIONS = {
  includeBase64: true,
  maxHeight: 1024,
  maxWidth: 1024,
  mediaType: 'photo',
};

export function StatusDetailsScreen(props) {
  const {
    comments,
    next,
    createComment,
    authenticate,
    loadComments,
    openProfile,
    deleteComment,
    status,
    filteredComments,
    user,
    deleteStatus,
    navigation,
    blockUser,
    style,
  } = props;
  const {
    statusId,
    enableInteractions,
    statusMaxLength,
    enablePhotoAttachments,
    scrollDownOnOpen,
    openUserLikes,
    onLikeAction,
    enableComments,
  } = getRouteParams(props);

  const [text, setText] = useState('');
  const [image64Data, setImage64Data] = useState(undefined);
  const [pickerActive, setPickerActive] = useState(false);

  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  const focusOnComment = () => {
    if (textInputRef) {
      textInputRef.current.focus();
    }
  };

  const fetchData = () => {
    loadComments(statusId).then(() => {
      if (scrollDownOnOpen) {
        focusOnComment();
      }
    });
  };

  const isStatusAuthorOrAppOwner = () => {
    return _.get(status, 'deletable') === 'yes';
  };

  const openActionSheet = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: [
          I18n.t(ext('deleteStatusOption')),
          I18n.t(ext('cancelStatusSelectionOption')),
        ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      index => {
        if (index === 0) {
          return deleteStatus(status).then(navigation.goBack);
        }

        return null;
      },
    );
  };

  const headerRight = props => {
    if (!isStatusAuthorOrAppOwner()) {
      return null;
    }

    return (
      <HeaderIconButton
        iconName="more-horizontal"
        onPress={openActionSheet}
        {...props}
      />
    );
  };

  useEffect(() => {
    fetchData();

    navigation.setOptions({
      title: I18n.t(ext('postDetailsNavBarTitle')),
      headerRight,
    });
  }, []);

  const onSubmit = () => {
    setText('');
    setImage64Data(undefined);
  };

  const handleTextChange = text => {
    setText(text);
  };

  const getCommentsLength = () => {
    return comments.data.length;
  };

  const scrollDownOnComment = () => {
    if (getCommentsLength() > 3) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleStatusCommentClick = () => {
    authenticate(() => {
      createComment(statusId, text, image64Data)
        .then(onSubmit())
        .then(scrollDownOnComment());
      RNKeyboard.dismiss();
      setText('');
    });
  };

  const handleImageSelected = response => {
    if (response.errorCode) {
      Alert.alert(response.errorMessage);
    } else if (!response.didCancel) {
      setImage64Data(response.assets[0].base64);
    }
  };

  const handleCameraSelectPress = () => {
    setPickerActive(false);
    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
        return launchCamera(IMAGE_PICKER_OPTIONS, handleImageSelected);
      }
    });
  };

  const handleGallerySelectPress = () => {
    setPickerActive(false);
    launchImageLibrary(IMAGE_PICKER_OPTIONS, handleImageSelected);
  };

  const discardImage = () => {
    setImage64Data(undefined);
  };

  const loadMoreComments = () => {
    next(comments);
  };

  function handleBlockUser() {
    const {
      authenticate,
      user: { legacyId: currentUserId },
    } = props;
    const blockUserId = status?.user?.id;

    return authenticate(() =>
      blockUser(blockUserId, currentUserId).then(() => navigation.goBack()),
    );
  }

  function handleMenuPress() {
    const statusOwner = status?.user;
    const isBlockAllowed = !currentUserOwnsStatus(user, statusOwner);

    return openBlockOrReportActionSheet(isBlockAllowed, handleBlockUser);
  }

  const renderLoadingMoreText = () => {
    if (!hasNext(comments)) {
      return null;
    }

    return (
      <View styleName="horizontal h-center v-center md-gutter">
        <Text>{I18n.t(ext('loadingMoreComments'))}</Text>
        <Divider styleName="line" />
      </View>
    );
  };

  const renderRow = comment => {
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
  };

  const renderAttachedImage = () => {
    if (!image64Data) return null;
    return (
      <Row>
        <ImageBackground
          styleName="small md-gutter"
          source={{ uri: `data:image/jpg;base64,${image64Data}` }}
        >
          <View styleName="fill-parent horizontal v-start h-end">
            <Button styleName="tight clear" onPress={discardImage}>
              <Icon name="close" />
            </Button>
          </View>
        </ImageBackground>
      </Row>
    );
  };

  const renderCommentTextInput = () => {
    return (
      <TextInput
        style={style.textInput}
        maxLength={statusMaxLength}
        multiline
        onChangeText={handleTextChange}
        placeholder={I18n.t(ext('newCommentPlaceholder'))}
        styleName="flexible"
        value={text}
        returnKeyType="next"
        ref={textInputRef}
      />
    );
  };

  const renderAddCommentSection = () => {
    const postButtonDisabled = text.length === 0 && !image64Data;
    const resolvedBehavior = Platform.OS === 'ios' ? 'padding' : '';
    const keyboardOffset = Keyboard.calculateKeyboardOffset();

    const addPhotoButton = enablePhotoAttachments && (
      <Button styleName="clear" onPress={() => setPickerActive(true)}>
        <Icon name="take-a-photo" />
      </Button>
    );

    return (
      <KeyboardAvoidingView
        behavior={resolvedBehavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        {renderAttachedImage()}
        <Divider styleName="line" />
        <View styleName="horizontal v-center">
          {addPhotoButton}
          {renderCommentTextInput()}
          <Button
            styleName="clear"
            disabled={postButtonDisabled}
            onPress={handleStatusCommentClick}
          >
            <Text>{I18n.t(ext('postStatusButton'))}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderStatus = () => {
    return (
      <View>
        <StatusView
          status={status}
          openUserLikes={openUserLikes}
          addComment={focusOnComment}
          onLikeAction={onLikeAction}
          onMenuPress={handleMenuPress}
          openProfile={openProfile}
          showUsersWhoLiked
          enableImageFullScreen
          enableInteractions={enableInteractions}
          enableComments={enableComments}
        />
      </View>
    );
  };

  const commentsData = _.get(filteredComments, 'data', []);
  const areCommentsLoading = isBusy(comments) && !isInitialized(comments);
  const showAddCommentSection = !areCommentsLoading && enableComments;

  const pickerOptions = [
    {
      title: I18n.t(ext('imagePickerCameraOption')),
      onPress: handleCameraSelectPress,
    },
    {
      title: I18n.t(ext('imagePickerGalleryOption')),
      onPress: handleGallerySelectPress,
    },
  ];

  return (
    <Screen styleName="paper with-notch-padding">
      <Divider styleName="line" />
      <ListView
        data={commentsData}
        ref={scrollViewRef}
        loading={areCommentsLoading}
        renderHeader={renderStatus}
        renderRow={renderRow}
        renderFooter={renderLoadingMoreText}
        onLoadMore={loadMoreComments}
      />
      {showAddCommentSection && renderAddCommentSection()}
      <ShoutemActionSheet
        confirmOptions={pickerOptions}
        active={pickerActive}
        onDismiss={() => setPickerActive(false)}
      />
    </Screen>
  );
}

StatusDetailsScreen.propTypes = {
  user: userShape.isRequired,
  comments: PropTypes.shape({
    data: PropTypes.array,
  }).isRequired,
  filteredComments: PropTypes.shape({
    data: PropTypes.array,
  }).isRequired,
  statusId: PropTypes.number.isRequired,
  status: PropTypes.object.isRequired,
  openUserLikes: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  onLikeAction: PropTypes.func.isRequired,
  loadComments: PropTypes.func.isRequired,
  scrollDownOnOpen: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  deleteStatus: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const { statusId } = getRouteParams(ownProps);

  return {
    status: selectors.getStatus(state, statusId),
    comments: selectors.getCommentsForStatus(state, statusId),
    filteredComments: selectors.getFilteredCommentsForStatus(state, statusId),
    user: getUser(state) || {},
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      loadComments,
      createComment,
      authenticate,
      next,
      deleteStatus,
      deleteComment,
      blockUser,
    },
    dispatch,
  ),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('StatusDetailsScreen'))(StatusDetailsScreen));
