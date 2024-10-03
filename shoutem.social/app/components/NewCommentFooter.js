import React, { useEffect, useState } from 'react';
import {
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Divider,
  Icon,
  Keyboard,
  LoadingContainer,
  Row,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { isIos, isWeb } from 'shoutem-core';
import { ext } from '../const';
import { createComment } from '../redux';
import AddAttachmentButtons from './AddAttachmentButtons';

const NewCommentFooter = ({
  addCommentInputRef,
  focusAddCommentInputOnMount,
  statusId,
  maxStatusLength,
  enableGifAttachments,
  enablePhotoAttachments,
  giphyApiKey,
  style,
}) => {
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState('');
  const [isPostingComment, setPostingComment] = useState(false);
  const [attachment, setAttachment] = useState(undefined);
  const [attachmentButtonsVisible, setAttachmentButtonsVisible] = useState(
    false,
  );

  const postButtonDisabled = commentText.length === 0 && !attachment;
  const resolvedBehavior = isIos ? 'padding' : '';
  const keyboardOffset = Keyboard.calculateKeyboardOffset();

  useEffect(() => {
    if (focusAddCommentInputOnMount) {
      // Web focuses and looses focus on input on mount.
      // Adding slight timeout resolve the issue.
      setTimeout(
        () => {
          addCommentInputRef.current?.focus();
        },
        isWeb ? 0 : 0,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostCommentClick = () => {
    setPostingComment(true);

    dispatch(
      authenticate(() => {
        dispatch(createComment(statusId, commentText, attachment))
          .then(() => handleSubmit())
          .finally(() => setPostingComment(false));

        RNKeyboard.dismiss();
        setCommentText('');
      }),
    );
  };

  const handleSubmit = () => {
    setCommentText('');
    discardAttachment();
    setAttachmentButtonsVisible(false);
  };

  const handleAddAttachmentButtonPress = () => {
    LayoutAnimation.easeInEaseOut();
    setAttachmentButtonsVisible(!attachmentButtonsVisible);
  };

  const handleAttachmentSelected = attachment => {
    LayoutAnimation.easeInEaseOut();
    setAttachment(attachment);

    addCommentInputRef.current?.focus();
  };

  const discardAttachment = () => {
    LayoutAnimation.easeInEaseOut();

    setAttachment(undefined);
  };

  const photoOrGifAttachmentsEnabled =
    enableGifAttachments || enablePhotoAttachments;

  const showAddAttachmentMenuButton =
    !attachment && photoOrGifAttachmentsEnabled;

  const showAddAttachmentButtons =
    photoOrGifAttachmentsEnabled && !attachment && attachmentButtonsVisible;

  const resolvedTextInputStyle = [
    style.textInput,
    !showAddAttachmentButtons && style.textInputMarginLeft,
  ];

  return (
    <>
      <KeyboardAvoidingView
        behavior={resolvedBehavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        <Divider styleName="line" />
        <View styleName="vertical v-center sm-gutter-left">
          {attachment && (
            <Row>
              <TouchableOpacity
                onPress={discardAttachment}
                style={style.removeAttachmentButton}
              >
                <Icon name="close" style={style.removeAttachmentIcon} />
              </TouchableOpacity>
              <FastImage
                source={{ uri: attachment.path }}
                style={style.image}
                imageStyle={style.image}
                resizeMode="contain"
              />
            </Row>
          )}
          {showAddAttachmentButtons && (
            <AddAttachmentButtons
              onAttachmentSelected={handleAttachmentSelected}
              enableGifAttachments={enableGifAttachments}
              enablePhotoAttachments={enablePhotoAttachments}
              giphyApiKey={giphyApiKey}
            />
          )}
          <View styleName="paper horizontal v-center sm-gutter-left">
            {showAddAttachmentMenuButton && (
              <Button
                styleName="tight clear"
                onPress={handleAddAttachmentButtonPress}
              >
                <Icon
                  name="plus-button"
                  style={attachmentButtonsVisible ? style.plusIconRotated : {}}
                />
              </Button>
            )}
            <TextInput
              style={resolvedTextInputStyle}
              maxLength={maxStatusLength}
              multiline
              onChangeText={setCommentText}
              placeholder={I18n.t(ext('newCommentPlaceholder'))}
              styleName="flexible"
              value={commentText}
              returnKeyType="next"
              ref={addCommentInputRef}
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
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

NewCommentFooter.propTypes = {
  giphyApiKey: PropTypes.string.isRequired,
  maxStatusLength: PropTypes.number.isRequired,
  statusId: PropTypes.number.isRequired,
  addCommentInputRef: PropTypes.object,
  enableGifAttachments: PropTypes.bool,
  enablePhotoAttachments: PropTypes.bool,
  focusAddCommentInputOnMount: PropTypes.bool,
  style: PropTypes.object,
};

NewCommentFooter.defaultProps = {
  addCommentInputRef: { current: {} },
  focusAddCommentInputOnMount: false,
  enableGifAttachments: true,
  enablePhotoAttachments: true,
  style: {},
};

export default connectStyle(ext('NewCommentFooter'))(NewCommentFooter);
