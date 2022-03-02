import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { hasNext, isBusy, isInitialized, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  ActionSheet as ShoutemActionSheet,
  Button,
  Divider,
  Icon,
  ImageBackground,
  Keyboard,
  ListView,
  Row,
  Screen,
  Text,
  View,
} from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderIconButton } from 'shoutem.navigation';
import {
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import CommentView from '../components/CommentView';
import StatusView from '../components/StatusView';
import { ext } from '../const';
import {
  blockUser,
  createComment,
  deleteComment,
  deleteStatus,
  loadComments,
  selectors,
} from '../redux';
import { openProfileForLegacyUser } from '../services';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const MAX_IMAGE_SIZE = 50 * 1024 * 1024;
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
    deleteStatus,
    navigation,
    style,
  } = props;
  const {
    focusAddCommentInput,
    enableComments,
    enableInteractions,
    enablePhotoAttachments,
    statusId,
    statusMaxLength,
  } = getRouteParams(props);

  const [text, setText] = useState('');
  const [image64Data, setImage64Data] = useState(undefined);
  const [pickerActive, setPickerActive] = useState(false);

  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  useLayoutEffect(() => {
    function headerRight(props) {
      // If it's status owner
      if (_.get(status, 'deletable') !== 'yes') {
        return null;
      }

      return (
        <HeaderIconButton
          iconName="more-horizontal"
          onPress={openActionSheet}
          {...props}
        />
      );
    }

    function openActionSheet() {
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
    }

    return navigation.setOptions({
      title: I18n.t(ext('postDetailsNavBarTitle')),
      headerRight,
    });
  }, [deleteStatus, navigation, status]);

  useEffect(() => {
    loadComments(statusId);
  }, [loadComments, statusId]);

  useEffect(() => {
    if (focusAddCommentInput) {
      textInputRef.current?.focus();
    }
  }, [focusAddCommentInput]);

  const onSubmit = () => {
    setText('');
    setImage64Data(undefined);
  };

  const handleTextChange = text => {
    setText(text);
  };

  const handleStatusCommentClick = () => {
    authenticate(() => {
      createComment(statusId, text, image64Data)
        .then(() => onSubmit())
        .then(() => scrollViewRef.current.scrollToEnd({ animated: true }));

      RNKeyboard.dismiss();
      setText('');
    });
  };

  const handleImageSelected = response => {
    if (response.errorCode) {
      Alert.alert(response.errorMessage);
    } else if (response.assets[0].fileSize > MAX_IMAGE_SIZE) {
      Alert.alert(I18n.t(ext('imageSizeWarning')));
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

      return null;
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

  function handleImageButtonPress() {
    RNKeyboard.dismiss();
    setPickerActive(true);
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
      <CommentView
        openProfile={openProfile}
        comment={comment}
        deleteComment={deleteComment}
      />
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
    const resolvedStyle = Platform.OS === 'android' ? style.container : null;

    const addPhotoButton = enablePhotoAttachments && (
      <Button styleName="clear" onPress={handleImageButtonPress}>
        <Icon name="take-a-photo" />
      </Button>
    );

    return (
      <KeyboardAvoidingView
        behavior={resolvedBehavior}
        keyboardVerticalOffset={keyboardOffset}
        style={resolvedStyle}
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
      <View styleName="lg-gutter-bottom">
        <StatusView
          status={status}
          showNewCommentInput={false}
          enableImageFullScreen
          enableComments={enableComments}
          enableInteractions={enableInteractions}
          enablePhotoAttachments={enablePhotoAttachments}
          goBackAfterBlock
        />
      </View>
    );
  };

  const commentsData = _.get(filteredComments, 'data', []);
  const areCommentsLoading = isBusy(comments) && !isInitialized(comments);

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
    <Screen styleName="paper">
      <ListView
        data={commentsData}
        ref={scrollViewRef}
        loading={areCommentsLoading}
        renderHeader={renderStatus}
        renderRow={renderRow}
        renderFooter={renderLoadingMoreText}
        onLoadMore={loadMoreComments}
        ListEmptyComponent={() => null}
        style={style.list}
      />
      {enableComments && renderAddCommentSection()}
      <ShoutemActionSheet
        confirmOptions={pickerOptions}
        active={pickerActive}
        onDismiss={() => setPickerActive(false)}
      />
    </Screen>
  );
}

StatusDetailsScreen.propTypes = {
  authenticate: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  comments: PropTypes.object.isRequired,
  createComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  deleteStatus: PropTypes.func.isRequired,
  filteredComments: PropTypes.object.isRequired,
  loadComments: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  next: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  style: PropTypes.object,
};

StatusDetailsScreen.defaultProps = {
  style: {},
};

const mapStateToProps = (state, ownProps) => {
  const { statusId } = getRouteParams(ownProps);

  return {
    status: selectors.getStatus(state, statusId),
    comments: selectors.getCommentsForStatus(state, statusId),
    filteredComments: selectors.getFilteredCommentsForStatus(state, statusId),
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
