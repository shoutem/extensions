import { changeColorAlpha, getSizeRelativeToReference } from '@shoutem/theme';
import {
  calculateLineHeight,
  createScopedResolver,
  Device,
  dimensionRelativeToIphone,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('FormInput')}`]: {
    textInput: {
      backgroundColor: resolveVariable('profileInputBackgroundColor'),
      borderColor: resolveVariable('profileInputBorderColor'),
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: resolveVariable('mediumGutter'),
      paddingVertical: resolveVariable('smallGutter'),
      textAlignVertical: 'center',
      color: resolveVariable('profileInputText'),
    },

    multilineTextInput: {
      height: 70,
      textAlignVertical: 'top',
    },

    label: {
      fontSize: resolveVariable('text.fontSize'),
      color: resolveVariable('profileInputLabelText.color'),
      paddingHorizontal: resolveVariable('smallGutter'),
      paddingVertical: resolveVariable('smallGutter'),
    },
  },

  [`${ext('SubmitButton')}`]: {
    container: {
      marginTop: resolveVariable('largeGutter'),
      marginBottom: Device.select({
        iPhoneX: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: resolveVariable('smallGutter'),
      }),
      marginHorizontal: resolveVariable('smallGutter'),
    },

    button: {
      backgroundColor: resolveVariable('profileSubmitButtonBackgroundColor'),
      borderColor: resolveVariable('profileSubmitButtonBorderColor'),
      borderRadius: 6,
    },
    text: { color: resolveVariable('profileSubmitButtonTextColor') },
  },

  [`${ext('ImageUpload')}`]: {
    label: {
      color: resolveVariable('profileInputLabelText.color'),
      fontSize: resolveVariable('text.fontSize'),
      paddingHorizontal: resolveVariable('smallGutter'),
      paddingVertical: resolveVariable('smallGutter'),
      marginBottom: resolveVariable('mediumGutter'),
    },

    imageCarousel: {
      container: { marginBottom: resolveVariable('mediumGutter') },
    },

    actionSheet: {
      tintColor: 'black',
      userInterfaceStyle: 'light',
    },
  },

  [`${ext('TextValue')}`]: {
    labelContainer: {
      width: '30%',
    },

    divider: {
      borderBottomWidth: 1,
    },

    label: {
      color: resolveVariable('profileInputLabelText.color'),
      fontSize: resolveVariable('text.fontSize'),
      paddingHorizontal: resolveVariable('smallGutter'),
      paddingVertical: resolveVariable('smallGutter'),
    },

    pressableLink: {
      textDecorationLine: 'underline',
    },

    pressedLink: {
      opacity: 0.5,
    },
  },

  [`${ext('EditProfileScreen')}`]: {
    container: {
      backgroundColor: resolveVariable('profileScreenBackgroundColor'),
    },
    padding: {
      padding: resolveVariable('mediumGutter'),
      marginBottom: Device.select({
        iPhoneX: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: resolveVariable('smallGutter'),
      }),
    },
  },

  [`${ext('SubmissionCompletedScreen')}`]: {
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'center',
    },
    description: { textAlign: 'center', fontSize: 15 },
  },

  [`${ext('EmptyImagesView')}`]: {
    icon: {
      width: 66,
      height: 66,
      color: resolveVariable('profileInputLabelText.color'),
    },
    uploadContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: dimensionRelativeToIphone(275),
    },
    uploadMessage: {
      color: resolveVariable('profileInputLabelText.color'),
      paddingTop: resolveVariable('largeGutter'),
    },
  },

  [`${ext('ImageCarousel')}`]: {
    container: {
      justifyContent: 'center',
    },
    galleryContainer: {
      height: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: '100%',
    },
    overlayContainer: {
      width: '100%',
      zIndex: 1,
      position: 'absolute',
      bottom: 18,
    },
    roundedImageContainer: {
      alignSelf: 'center',
      width: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    roundedImage: {
      width: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: getSizeRelativeToReference(
        125,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    loadingContainer: { height: '70%' },
    imageGalleryShown: { opacity: 1 },
    imageGalleryHidden: { opacity: 0 },
    overlayText: { paddingBottom: 26, fontSize: 11, color: '#FFFFFF' },
    image: { flex: 1 },
    carouselButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignSelf: 'flex-end',
      position: 'absolute',
      top: resolveVariable('mediumGutter'),
      right: resolveVariable('mediumGutter'),
      borderColor: 'transparent',
      backgroundColor: changeColorAlpha('gray', 0.1),
    },
    carouselIcon: { color: '#FFFFFF', width: 20, height: 20 },
    uploadButton: {
      marginVertical: resolveVariable('mediumGutter'),
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    uploadText: {
      color: resolveVariable('primaryButtonText.color'),
      fontSize: 15,
      fontWeight: 'bold',
    },
    pageIndicators: {
      indicatorContainer: {
        'shoutem.ui.View': {
          backgroundColor: changeColorAlpha(
            resolveVariable('imageOverlayTextColor'),
            0.4,
          ),

          '.selected': {
            backgroundColor: resolveVariable('imageOverlayTextColor'),
          },
        },
      },
    },
  },

  [`${ext('MyProfileScreen')}`]: {
    screen: {
      backgroundColor: resolveVariable('profileScreenBackgroundColor'),
    },
    container: {
      paddingBottom: Device.select({
        iPhoneX: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        notchedAndroid: resolveVariable('smallGutter'),
        default: resolveVariable('smallGutter'),
      }),
      paddingTop: resolveVariable('mediumGutter'),
    },
    deleteAccountButtonText: { color: resolveVariable('errorText.color') },
  },

  [`${ext('UserProfileScreen')}`]: {
    screen: {
      backgroundColor: resolveVariable('profileScreenBackgroundColor'),
    },
    container: {
      paddingBottom: Device.select({
        iPhoneX: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        notchedAndroid: resolveVariable('smallGutter'),
        default: resolveVariable('smallGutter'),
      }),
    },
  },

  [`${ext('ImagesPreview')}`]: {
    container: {
      justifyContent: 'center',
    },
    galleryContainer: {
      height: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: '100%',
      marginTop: resolveVariable('mediumGutter'),
    },
    overlayContainer: {
      width: '100%',
      zIndex: 1,
      position: 'absolute',
      bottom: 18,
    },
    overlayText: { paddingBottom: 26, fontSize: 11, color: '#FFFFFF' },
    label: {
      color: resolveVariable('profileInputLabelText.color'),
      fontSize: resolveVariable('text.fontSize'),
      paddingHorizontal: resolveVariable('smallGutter'),
      paddingVertical: resolveVariable('smallGutter'),
      marginBottom: resolveVariable('mediumGutter'),
    },
    imageContainer: {
      // Not flexible
      alignSelf: 'center',
      width: '100%',
      height: '100%',
    },
    roundedImageContainer: {
      width: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    roundedImage: {
      borderRadius: getSizeRelativeToReference(
        125,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    pageIndicators: {
      indicatorContainer: {
        'shoutem.ui.View': {
          backgroundColor: changeColorAlpha(
            resolveVariable('imageOverlayTextColor'),
            0.4,
          ),

          '.selected': {
            backgroundColor: resolveVariable('imageOverlayTextColor'),
          },
        },
      },
    },
    galleryHeaderContainer: {
      height: dimensionRelativeToIphone(90),
      zIndex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: resolveVariable('mediumGutter'),
      paddingTop: Device.select({
        iPhoneX: resolveVariable('extraLargeGutter'),
        iPhoneXR: resolveVariable('extraLargeGutter'),
        notchedAndroid: resolveVariable('extraLargeGutter'),
        default: 10,
      }),
    },
    emptyGalleryContainer: {
      paddingVertical: resolveVariable('extraLargeGutter'),
    },
    closeGalleryIcon: {
      color: '#FFFFFF',
    },
    galleryHeaderTitle: {
      alignSelf: 'center',
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    imageGallery: {
      container: {
        marginTop: -resolveVariable('navBarHeight'),
        backgroundColor: 'rgba(0,0,0,0.9)',
      },
    },
    divider: {
      borderBottomWidth: 1,
    },
  },

  [`${ext('BaseUserProfile')}`]: {
    name: {
      fontSize: 16,
      lineHeight: calculateLineHeight(16),
    },
    nick: {
      fontSize: 13,
      lineHeight: calculateLineHeight(13),
      opacity: 0.6,
    },
    profileImage: {
      borderRadius: dimensionRelativeToIphone(145 / 2),
    },
  },
});
