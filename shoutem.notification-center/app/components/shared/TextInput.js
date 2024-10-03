import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../../const';

const TextInput = React.forwardRef((props, ref) => {
  const {
    autoCapitalize,
    autoFocus,
    errorMessage,
    disabled,
    label,
    keyboardType,
    multiline,
    onBlur,
    onChangeText,
    onSubmitEditing,
    placeholder,
    renderActionButton,
    returnKeyType,
    secureTextEntry,
    textContentType,
    value,
    style,
  } = props;

  const [isFocused, setIsFocused] = useState(autoFocus ?? false);

  // Hack for multiline text input in KeyboardAvoidingViews
  // https://github.com/facebook/react-native/issues/16826#issuecomment-919338602
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const scrollEnabledTimerRef = useRef();

  const handleFocus = useCallback(() => {
    scrollEnabledTimerRef.current = setTimeout(
      () => setScrollEnabled(true),
      700,
    );

    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (_.isFunction(onBlur)) {
      onBlur();
    }

    clearTimeout(scrollEnabledTimerRef.current);
    setScrollEnabled(false);
    setIsFocused(false);
  }, [onBlur]);

  const resolvedTextInputStyle = useMemo(
    () => [
      style.textInput,
      multiline && style.multiline,
      disabled && style.disabled,
      isFocused && style.focused,
    ],
    [
      disabled,
      isFocused,
      multiline,
      style.disabled,
      style.focused,
      style.multiline,
      style.textInput,
    ],
  );

  const resolvedContainerStyle = useMemo(
    () => [style.input, ...resolvedTextInputStyle],
    [resolvedTextInputStyle, style.input],
  );

  function resolvedActionButton() {
    if (_.isFunction(renderActionButton)) {
      return renderActionButton();
    }

    return null;
  }

  return (
    <View style={style.container}>
      <View style={style.textInputContainer}>
        {label && <Text style={style.label}>{label}</Text>}
        <View style={resolvedContainerStyle}>
          <RNTextInput
            ref={ref}
            allowFontScaling={false}
            autoCapitalize={autoCapitalize}
            editable={!disabled}
            enablesReturnKeyAutomatically
            keyboardType={keyboardType}
            multiline={multiline}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            scrollEnabled={scrollEnabled}
            secureTextEntry={secureTextEntry}
            selectionColor={style.selectionColor.color}
            style={resolvedTextInputStyle}
            textContentType={textContentType}
            underlineColorAndroid="transparent"
            value={value}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onSubmitEditing={onSubmitEditing}
          />
          {resolvedActionButton()}
        </View>
      </View>
      {errorMessage && <Text style={style.error}>{errorMessage}</Text>}
    </View>
  );
});

TextInput.propTypes = {
  autoCapitalize: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  keyboardType: PropTypes.string,
  label: PropTypes.string,
  multiline: PropTypes.bool,
  placeholder: PropTypes.string,
  renderActionButton: PropTypes.func,
  returnKeyType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  style: PropTypes.object,
  textContentType: PropTypes.string,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
};

TextInput.defaultProps = {
  autoCapitalize: 'sentences',
  autoFocus: false,
  errorMessage: '',
  disabled: false,
  label: null,
  keyboardType: 'default',
  multiline: false,
  onBlur: null,
  onChangeText: null,
  onSubmitEditing: null,
  placeholder: null,
  renderActionButton: null,
  returnKeyType: 'done',
  secureTextEntry: false,
  textContentType: 'none',
  value: undefined,
  style: {},
};

TextInput.displayName = 'TextInput';

export default connectStyle(ext('TextInput'))(TextInput);
