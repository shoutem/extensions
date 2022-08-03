import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Pressable,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Device,
  Icon,
  IPHONE_X_HOME_INDICATOR_PADDING,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import SheetHeader from './SheetHeader';
import TimerOptions from './TimerOptions';

const { height: windowHeight } = Dimensions.get('window');

function getContentOffset(contentHeight = windowHeight) {
  if (Device.isIphoneXR || Device.isIphoneX) {
    return contentHeight + IPHONE_X_HOME_INDICATOR_PADDING;
  }

  return contentHeight;
}

const AnimatedTouchable = Animated.createAnimatedComponent(RNTouchableOpacity);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function RadioActionSheet({
  active,
  isPlaying,
  showSharing,
  timeRemaining,
  onClearPress,
  onDismiss,
  onSharePress,
  onTimerSet,
  style,
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const yPos = useRef(new Animated.Value(0)).current;

  const [height, setHeight] = useState(0);
  const [shouldShowTimerOptions, setShouldShowTimerOptions] = useState(
    !showSharing,
  );

  const sleepLabel = useMemo(
    () =>
      timeRemaining
        ? I18n.t(ext('cancelSleepTimer'), { count: timeRemaining / 60000 })
        : I18n.t(ext('sleepTimerLabel')),
    [timeRemaining],
  );
  const leftHeaderText = useMemo(
    () =>
      shouldShowTimerOptions
        ? I18n.t(ext('closeSleepTimerOptionsLabel'))
        : I18n.t(ext('moreOptionsLabel')),
    [shouldShowTimerOptions],
  );

  const hideComponent = useCallback(() => {
    setShouldShowTimerOptions(!showSharing);
    onDismiss && onDismiss();
  }, [onDismiss, setShouldShowTimerOptions, showSharing]);

  const handleShow = useCallback(() => {
    const toValue = 1;

    Animated.parallel([
      Animated.spring(yPos, {
        toValue,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue,
        useNativeDriver: false,
      }),
    ]).start();
  }, [opacity, yPos]);

  const handleDismiss = useCallback(() => {
    const toValue = 0;

    Animated.parallel([
      Animated.spring(yPos, {
        toValue,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue,
        delay: 100,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(hideComponent);
  }, [hideComponent, opacity, yPos]);

  const renderLeftSheetHeader = useCallback(() => {
    if (!showSharing) {
      return null;
    }

    return (
      <Button
        disabled={!shouldShowTimerOptions}
        onPress={hideTimerOptions}
        styleName="clear tight textual"
      >
        <Text>{leftHeaderText}</Text>
      </Button>
    );
  }, [hideTimerOptions, leftHeaderText, showSharing, shouldShowTimerOptions]);

  const hideTimerOptions = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setShouldShowTimerOptions(false);
  }, [setShouldShowTimerOptions]);

  const handleTimerOptionPress = useCallback(
    duration => {
      onClearPress();
      onTimerSet(duration * 60000);
      handleDismiss();
      setShouldShowTimerOptions(false);
    },
    [handleDismiss, onClearPress, onTimerSet, setShouldShowTimerOptions],
  );

  useEffect(() => {
    if (active) {
      handleShow();
    } else {
      handleDismiss();
    }
  }, [active, handleDismiss, handleShow]);

  function handleContentLayout(event) {
    setHeight(_.get(event, 'nativeEvent.layout.height', 0));
  }

  function handleSharePress() {
    onSharePress();
    handleDismiss();
  }

  function showTimerOptions() {
    if (!isPlaying && !timeRemaining) {
      return;
    }

    LayoutAnimation.easeInEaseOut();
    setShouldShowTimerOptions(true);
  }

  function clearTimer() {
    onClearPress();
    handleDismiss();
  }

  if (!active) {
    return null;
  }

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={handleDismiss}
      style={[
        style.container,
        {
          backgroundColor: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)'],
          }),
        },
      ]}
    >
      <AnimatedPressable
        onLayout={handleContentLayout}
        style={{
          transform: [
            {
              translateY: yPos.interpolate({
                inputRange: [0, 1],
                outputRange: [getContentOffset(height), 0],
              }),
            },
          ],
        }}
      >
        <SheetHeader
          renderLeftSheetHeader={renderLeftSheetHeader}
          rightHeaderAction={handleDismiss}
          showSharing={showSharing}
        />
        <View style={style.segmentContainer}>
          {showSharing && !shouldShowTimerOptions && (
            <>
              <TouchableOpacity
                onPress={handleSharePress}
                style={style.optionContainer}
              >
                <Icon name="share" fill={style.optionText?.color} />
                <Text style={style.optionText}>
                  {I18n.t(ext('shareButtonLabel'))}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={isPlaying ? 0.2 : 1}
                onPress={showTimerOptions}
                style={style.optionContainer}
              >
                <Icon name="sleep" fill={style.optionText?.color} />
                <Text style={style.optionText}>{sleepLabel}</Text>
              </TouchableOpacity>
            </>
          )}
          {shouldShowTimerOptions && (
            <TimerOptions
              onClearTimer={clearTimer}
              onOptionPress={handleTimerOptionPress}
              timeRemaining={timeRemaining}
            />
          )}
        </View>
      </AnimatedPressable>
    </AnimatedTouchable>
  );
}

RadioActionSheet.propTypes = {
  active: PropTypes.bool.isRequired,
  showSharing: PropTypes.bool.isRequired,
  onClearPress: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  onTimerSet: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool,
  style: PropTypes.object,
  timeRemaining: PropTypes.number,
};

RadioActionSheet.defaultProps = {
  isPlaying: false,
  style: {},
  timeRemaining: null,
};

export default connectStyle(ext('RadioActionSheet'))(RadioActionSheet);
