import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
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
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Divider,
  Icon,
  Image,
  ImageBackground,
  Keyboard,
  LoadingContainer,
  Row,
  Screen,
  View,
} from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton } from 'shoutem.navigation';
import { images } from '../assets';
import NewStatusFooter from '../components/NewStatusFooter';
import { ext } from '../const';
import { MAX_IMAGE_SIZE } from '../services';

export function CreateStatusScreen({ navigation, route, style }) {
  const {
    params: {
      selectedImage: selectedImageAttachment,
      user,
      placeholder,
      enablePhotoAttachments = true,
      maxStatusLength,
      onStatusCreated,
    },
  } = route;

  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(selectedImageAttachment);
  const [isPostingStatus, setPostingStatus] = useState(false);

  const textInputRef = useRef(null);

  const debouncedHandleTextChange = _.debounce(setText, 250);

  const addNewStatus = useCallback(() => {
    if (text.length > 0) {
      setPostingStatus(true);

      dispatch(
        authenticate(() => {
          onStatusCreated(text, selectedImage, setStatusPosted);
        }),
      );
    } else {
      Alert.alert(I18n.t(ext('blankPostWarning')));
    }
  }, [dispatch, selectedImage, onStatusCreated, setStatusPosted, text]);

  const setStatusPosted = useCallback(() => setPostingStatus(false), []);

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
    setSelectedImage(undefined);
    navigation.goBack();
  }, [navigation]);

  const cancelNewPost = useCallback(() => {
    if (text.length === 0 && !selectedImage) {
      return navigateBack();
    }

    return Alert.alert(
      I18n.t(ext('discardStatusAlertTitle')),
      I18n.t(ext('discardStatusAlertMessage')),
      [
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
  }, [navigateBack, text.length, selectedImage]);

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

  const handleImageSelected = useCallback(image => {
    if (image.size > MAX_IMAGE_SIZE) {
      Alert.alert(
        I18n.t(
          ext('imageSizeWarning', { maxSize: MAX_IMAGE_SIZE / (1024 * 1024) }),
        ),
      );
    }

    LayoutAnimation.easeInEaseOut();

    setSelectedImage({
      uri: image.path,
      // Only iOS has filename property. For Android, we get the last segment of file path
      fileName:
        image.filename || image.path.substring(image.path.lastIndexOf('/') + 1),
    });
  }, []);

  function discardImage() {
    LayoutAnimation.easeInEaseOut();
    setSelectedImage(undefined);
  }

  const profileImage = user?.profile?.image || user?.profile_image_url;

  const resolvedProfileAvatar = useMemo(
    () => (profileImage ? { uri: profileImage } : images.defaultProfileAvatar),
    [profileImage],
  );

  const attachmentSource = useMemo(
    () => ({
      uri: selectedImage?.uri,
    }),
    [selectedImage],
  );

  const keyboardOffset = Keyboard.calculateKeyboardOffset();

  return (
    <Screen styleName="paper">
      <View style={style.keyboardDismissContainer}>
        <Pressable onPress={RNKeyboard.dismiss}>
          <Image
            styleName="small-avatar"
            source={resolvedProfileAvatar}
            style={style.profileAvatar}
          />
        </Pressable>
        <TextInput
          ref={textInputRef}
          style={style.textInput}
          multiline
          textAlignVertical="top"
          maxLength={maxStatusLength}
          placeholder={placeholder}
          onChangeText={debouncedHandleTextChange}
          returnKeyType="next"
        />
      </View>
      {!!selectedImage && (
        <View style={style.attachmentContainer}>
          <Divider styleName="line" />
          <Row style={style.attachmentRow}>
            <ImageBackground
              source={attachmentSource}
              style={style.image}
              imageStyle={[style.image]}
            >
              <View
                styleName="fill-parent horizontal v-start h-end sm-gutter-right sm-gutter-top"
                style={style.overlay}
              >
                <Button styleName="tight clear" onPress={discardImage}>
                  <Icon name="close" style={style.removeImageIcon} />
                </Button>
              </View>
            </ImageBackground>
          </Row>
        </View>
      )}
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
      >
        {!selectedImage && (
          <NewStatusFooter
            enablePhotoAttachments={enablePhotoAttachments}
            onImageSelected={handleImageSelected}
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
