import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Pressable,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  Icon,
  Image,
  Keyboard,
  LoadingContainer,
  Row,
  Screen,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton, isTabBarNavigation } from 'shoutem.navigation';
import { isAndroid } from 'shoutem-core';
import { images } from '../assets';
import NewStatusFooter from '../components/NewStatusFooter';
import { ext } from '../const';
import { clearDraft, saveDraft, selectors } from '../redux';
import { getGiphyApiKey } from '../redux/selectors';
import { attachmentService } from '../services';

const KEYBOARD_OFFSET = isAndroid
  ? Keyboard.calculateKeyboardOffset(-30)
  : Keyboard.calculateKeyboardOffset();

export function CreateStatusScreen({ navigation, route, style }) {
  const {
    params: {
      selectedAttachment,
      user,
      placeholder,
      maxStatusLength,
      onStatusCreated,
    },
  } = route;

  const dispatch = useDispatch();

  const giphyApiKey = useSelector(getGiphyApiKey);
  const statusDraft = useSelector(selectors.getSavedDraft);
  const { enableGifAttachments, enablePhotoAttachments } = useSelector(state =>
    getExtensionSettings(state, ext()),
  );
  const isTabBarNav = useSelector(isTabBarNavigation);

  const [statusText, setStatusText] = useState('');
  const [attachment, setAttachment] = useState(selectedAttachment);
  const [isPostingStatus, setPostingStatus] = useState(false);

  const textInputRef = useRef(null);

  const debouncedHandleTextChange = _.debounce(setStatusText, 250);

  const setStatusPosted = useCallback(() => setPostingStatus(false), []);

  const addNewStatus = useCallback(() => {
    if (statusText.length === 0 && !attachment) {
      Alert.alert(I18n.t(ext('blankPostWarning')));
    } else {
      setPostingStatus(true);

      dispatch(
        authenticate(() => {
          onStatusCreated(statusText, attachment, setStatusPosted);
        }),
      );
    }
  }, [dispatch, attachment, onStatusCreated, setStatusPosted, statusText]);

  const headerRight = useCallback(
    props => {
      return (
        <LoadingContainer loading={isPostingStatus}>
          <HeaderTextButton
            title={I18n.t(ext('postCommentButton'))}
            onPress={addNewStatus}
            {...props}
          />
        </LoadingContainer>
      );
    },
    [addNewStatus, isPostingStatus],
  );

  const navigateBack = useCallback(() => {
    setAttachment(undefined);
    navigation.goBack();
  }, [navigation]);

  const saveStatus = useCallback(() => {
    dispatch(saveDraft({ statusText, attachment }));
    navigateBack();
  }, [dispatch, navigateBack, attachment, statusText]);

  const cancelNewPost = useCallback(() => {
    if (statusText.length === 0 && !attachment) {
      return navigateBack();
    }

    return Alert.alert(
      I18n.t(ext('discardStatusAlertTitle')),
      I18n.t(ext('discardStatusAlertMessage')),
      [
        {
          text: I18n.t(ext('saveAlertButtonLabel')),
          style: 'destructive',
          onPress: saveStatus,
        },
        {
          text: I18n.t(ext('discardAlertButtonLabel')),
          style: 'destructive',
          onPress: navigateBack,
        },
        {
          text: I18n.t(ext('keepEditingButtonLabel')),
        },
      ],
    );
  }, [navigateBack, statusText.length, saveStatus, attachment]);

  const headerLeft = useCallback(
    props => {
      return (
        <HeaderTextButton
          {...props}
          title={I18n.t(ext('cancelHeaderButtonText'))}
          onPress={cancelNewPost}
        />
      );
    },
    [cancelNewPost],
  );

  useLayoutEffect(() => {
    textInputRef?.current?.focus();
  }, []);

  useLayoutEffect(() => {
    const {
      params: { title },
    } = route;

    navigation.setOptions({ title, headerLeft, headerRight });
  }, [headerLeft, headerRight, navigation, route]);

  useEffect(() => {
    if (statusDraft) {
      setStatusText(statusDraft.statusText);
      setAttachment(statusDraft.attachment);
    }
  }, [dispatch, statusDraft, statusText]);

  useEffect(() => {
    // Clear draft after it has been loaded
    dispatch(clearDraft());
  }, [dispatch]);

  const handleAttachmentSelected = selectedAttachment => {
    if (selectedAttachment.size > attachmentService.MAX_ATTACHMENT_SIZE) {
      Alert.alert(
        I18n.t(
          ext('imageSizeWarning', {
            maxSize: attachmentService.MAX_ATTACHMENT_SIZE / (1024 * 1024),
          }),
        ),
      );
    }

    LayoutAnimation.easeInEaseOut();

    setAttachment(selectedAttachment);
  };

  function discardAttachment() {
    LayoutAnimation.easeInEaseOut();
    setAttachment(undefined);
  }

  const profileImage = user?.profile?.image || user?.profile_image_url;

  const resolvedProfileAvatar = profileImage
    ? { uri: profileImage }
    : images.defaultProfileAvatar;

  const screenStyleName = isTabBarNav ? 'paper' : 'paper md-gutter-bottom';

  return (
    <Screen styleName={screenStyleName}>
      <View style={style.keyboardDismissContainer}>
        <Pressable onPress={RNKeyboard.dismiss}>
          <Image
            styleName="small-avatar"
            source={resolvedProfileAvatar}
            style={style.profileAvatar}
          />
        </Pressable>
        <TextInput
          defaultValue={statusText}
          maxLength={maxStatusLength}
          onChangeText={debouncedHandleTextChange}
          multiline
          placeholder={placeholder}
          ref={textInputRef}
          returnKeyType="next"
          style={style.textInput}
          textAlignVertical="top"
        />
      </View>
      {attachment && (
        <View style={style.attachmentContainer}>
          <Divider styleName="line" />
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
        </View>
      )}
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={KEYBOARD_OFFSET}
      >
        {!attachment && (
          <NewStatusFooter
            onAttachmentSelected={handleAttachmentSelected}
            enableGifAttachments={enableGifAttachments}
            enablePhotoAttachments={enablePhotoAttachments}
            giphyApiKey={giphyApiKey}
          />
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

CreateStatusScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

CreateStatusScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('CreateStatusScreen'))(CreateStatusScreen);
