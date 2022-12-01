import {
  createScopedResolver,
  Device,
  IPHONE_X_HOME_INDICATOR_PADDING,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('Question')}`]: {
    container: {
      height: 35,
      marginRight: 10,
      borderWidth: 1,
      borderColor: resolveVariable('interactiveFaqQuestionButtonBorderColor'),
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: resolveVariable('interactiveFaqQuestionBackgroundColor'),
      borderRadius: 100,
    },
    backContainer: {
      backgroundColor: resolveVariable(
        'interactiveFaqQuestionBackButtonBackgroundColor',
      ),
      borderColor: resolveVariable(
        'interactiveFaqQuestionBackButtonBackgroundColor',
      ),
    },
    text: {
      paddingHorizontal: 10,
      fontSize: 13,
      lineHeight: 16,
      color: resolveVariable('interactiveFaqQuestionTextColor'),
    },
    backText: {
      color: resolveVariable('interactiveFaqQuestionBackButtonTextColor'),
    },
  },

  [`${ext('QuestionsBar')}`]: {
    container: {
      flexGrow: 0,
    },
    contentContainer: {
      height: 65,
      padding: 15,
      justifyContent: 'center',
      alignContent: 'center',
    },
  },

  [`${ext('InteractiveFaqScreen')}`]: {
    container: {
      backgroundColor: resolveVariable('interactiveFaqScreenBackgroundColor'),
    },
    paddedContainer: {
      paddingBottom: Device.select({
        iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
        iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
        default: 0,
      }),
    },
    flatlistContainer: {
      paddingTop: 30,
      paddingHorizontal: 25,
    },
  },

  [`${ext('MessageBubble')}`]: {
    container: {
      padding: 15,
      marginBottom: 25,
      borderTopLeftRadius: 15,
      borderTopEndRadius: 0,
      borderBottomLeftRadius: 15,
      borderBottomEndRadius: 15,
      backgroundColor: resolveVariable('interactiveFaqMessageBackgroundColor'),
      borderColor: resolveVariable('interactiveFaqMessageBorderColor'),
      borderWidth: 1,
      alignSelf: 'flex-end',
    },
    botContainer: {
      borderTopLeftRadius: 0,
      borderTopEndRadius: 15,
      backgroundColor: resolveVariable(
        'interactiveFaqBotMessageBackgroundColor',
      ),
      borderColor: resolveVariable('interactiveFaqBotMessageBorderColor'),
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: 13,
      lineHeight: 18,
      color: resolveVariable('interactiveFaqMessageTextColor'),
    },
    botText: {
      color: resolveVariable('interactiveFaqBotMessageTextColor'),
    },
  },
});
