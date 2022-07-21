import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Text } from '@shoutem/ui';

export function MenuButton({ text, onPress, secondary }) {
  const buttonStyle = useMemo(
    () => [styles.button, secondary && styles.secondaryButton],
    [secondary],
  );

  const textStyle = useMemo(
    () => [styles.text, secondary && styles.secondaryText],
    [secondary],
  );

  return (
    <Button onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>{text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  text: {
    fontSize: 14,
    color: '#444F6C',
  },
  secondaryButton: {
    marginVertical: 5,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#444F6C',
    borderColor: '#444F6C',
  },
  secondaryText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

MenuButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  secondary: PropTypes.bool,
};

MenuButton.defaultProps = {
  secondary: false,
};

export default React.memo(MenuButton);
