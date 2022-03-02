import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text, TextInput, View } from '@shoutem/ui';
import { ext } from '../const';

function FormInput({
  label,
  value,
  onChangeText,
  onFocus,
  autoFocus,
  disabled,
  errorMessage,
  hasError,
  keyboardType,
  labelColor,
  placeholder,
  renderAdditionalButton,
  secureTextEntry,
  style,
  textContentType,
  validateInput,
}) {
  const [isVisible, setIsVisible] = useState(!secureTextEntry);
  const [error, setError] = useState(false);

  const resolvedLabelStyle = useMemo(
    () => [style.label, !!labelColor && { color: labelColor }],
    [labelColor, style.label],
  );

  useEffect(() => {
    if (hasError) {
      setError(true);
    }
  }, [hasError]);

  function handleFocus() {
    if (_.isFunction(onFocus)) {
      onFocus();
    }
  }

  function handleTextChange(value) {
    setError(false);
    onChangeText(value);
  }

  function handleEndEditing() {
    if (_.isFunction(validateInput)) {
      return setError(!validateInput());
    }

    return null;
  }

  const resolvedError = useMemo(() => {
    if (error) {
      return errorMessage;
    }

    return null;
  }, [error, errorMessage]);

  const toggleVisibility = useCallback(
    () => setIsVisible(prevVisible => !prevVisible),
    [],
  );

  return (
    <View style={style.container}>
      <View style={style.labelContainer}>
        <Text style={resolvedLabelStyle}>{label}</Text>
        {_.isFunction(renderAdditionalButton) && renderAdditionalButton()}
      </View>
      <View>
        <TextInput
          autoFocus={autoFocus}
          autoCapitalize="none"
          disabled={disabled}
          errorMessage={resolvedError}
          keyboardType={keyboardType}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onEndEditing={handleEndEditing}
          placeholder={placeholder}
          style={style.textInput}
          secureTextEntry={!isVisible}
          textContentType={textContentType}
          value={value}
        />
        {secureTextEntry && (
          <Button
            onPress={toggleVisibility}
            styleName="clear sm-gutter-horizontal"
            style={style.iconContainer}
          >
            <Icon name={isVisible ? 'eye' : 'eye-crossed'} style={style.icon} />
          </Button>
        )}
      </View>
    </View>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  keyboardType: PropTypes.string,
  labelColor: PropTypes.string,
  placeholder: PropTypes.string,
  renderAdditionalButton: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  style: PropTypes.object,
  textContentType: PropTypes.string,
  validateInput: PropTypes.func,
  onFocus: PropTypes.func,
};

FormInput.defaultProps = {
  autoFocus: false,
  disabled: false,
  errorMessage: '',
  hasError: false,
  keyboardType: 'default',
  labelColor: undefined,
  placeholder: null,
  renderAdditionalButton: null,
  secureTextEntry: false,
  style: {},
  textContentType: 'none',
  validateInput: null,
  onFocus: null,
};

export default connectStyle(ext('FormInput'))(FormInput);
