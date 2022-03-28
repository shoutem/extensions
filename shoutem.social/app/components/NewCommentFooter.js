import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Divider,
  Icon,
  ImageBackground,
  Keyboard,
  LoadingContainer,
  Row,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { createComment } from '../redux';
import AddAttachmentButtons from './AddAttachmentButtons';

function NewCommentFooter({
  enablePhotoAttachments,
  focusAddCommentInput,
  statusId,
  maxStatusLength,
  style,
}) {
  const dispatch = useDispatch();

  const textInputRef = useRef(null);

  const [text, setText] = useState('');
  const [selectedImagePath, setSelectedImagePath] = useState(undefined);
  const [isPostingComment, setPostingComment] = useState(false);

  const postButtonDisabled = text.length === 0 && !selectedImagePath;
  const resolvedBehavior = Platform.OS === 'ios' ? 'padding' : '';
  const keyboardOffset = Keyboard.calculateKeyboardOffset();

  useEffect(() => {
    if (focusAddCommentInput) {
      textInputRef.current?.focus();
    }
  }, [focusAddCommentInput]);

  const handlePostCommentClick = useCallback(() => {
    setPostingComment(true);

    dispatch(
      authenticate(() => {
        dispatch(createComment(statusId, text, selectedImagePath))
          .then(() => handleSubmit())
          .finally(() => setPostingComment(false));

        RNKeyboard.dismiss();
        setText('');
      }),
    );
  }, [dispatch, statusId, text, selectedImagePath, handleSubmit]);

  const handleSubmit = useCallback(() => {
    setText('');
    discardImage();
  }, [discardImage]);

  const discardImage = useCallback(() => {
    LayoutAnimation.easeInEaseOut();

    setSelectedImagePath(undefined);
  }, []);

  const handleAttachmentSelected = useCallback(attachment => {
    LayoutAnimation.spring();

    setSelectedImagePath(attachment.uri);

    textInputRef.current?.focus();
  }, []);

  const attachmentSource = useMemo(() => ({ uri: selectedImagePath }), [
    selectedImagePath,
  ]);

  const showAddAddAttachmentButtons = useMemo(
    () => enablePhotoAttachments && !selectedImagePath,
    [enablePhotoAttachments, selectedImagePath],
  );

  const resolvedTextInputStyle = useMemo(
    () => [
      style.textInput,
      !showAddAddAttachmentButtons && style.textInputMarginLeft,
    ],
    [showAddAddAttachmentButtons, style.textInput, style.textInputMarginLeft],
  );

  return (
    <KeyboardAvoidingView
      behavior={resolvedBehavior}
      keyboardVerticalOffset={keyboardOffset}
    >
      <Divider styleName="line" />
      {!!selectedImagePath && (
        <Row>
          <ImageBackground
            source={attachmentSource}
            style={style.image}
            imageStyle={style.image}
          >
            <View style={style.overlay}>
              <Button styleName="tight clear" onPress={discardImage}>
                <Icon name="close" style={style.deleteAttachmentIcon} />
              </Button>
            </View>
          </ImageBackground>
        </Row>
      )}
      <View styleName="paper horizontal v-center sm-gutter-left">
        {showAddAddAttachmentButtons && (
          <AddAttachmentButtons
            onAttachmentSelected={handleAttachmentSelected}
            style={style}
          />
        )}
        <TextInput
          style={resolvedTextInputStyle}
          maxLength={maxStatusLength}
          multiline
          onChangeText={setText}
          placeholder={I18n.t(ext('newCommentPlaceholder'))}
          styleName="flexible"
          value={text}
          returnKeyType="next"
          ref={textInputRef}
        />
        <View style={style.postButtonContainer}>
          <LoadingContainer loading={isPostingComment} animationScale={0.6}>
            <TouchableOpacity
              styleName="flexible horizontal h-center"
              onPress={handlePostCommentClick}
              disabled={postButtonDisabled}
            >
              <Text>{I18n.t(ext('postStatusButton'))}</Text>
            </TouchableOpacity>
          </LoadingContainer>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

NewCommentFooter.propTypes = {
  enablePhotoAttachments: PropTypes.bool.isRequired,
  maxStatusLength: PropTypes.number.isRequired,
  statusId: PropTypes.number.isRequired,
  focusAddCommentInput: PropTypes.bool,
  style: PropTypes.object,
};

NewCommentFooter.defaultProps = {
  focusAddCommentInput: false,
  style: {},
};

export default connectStyle(ext('NewCommentFooter'))(NewCommentFooter);
