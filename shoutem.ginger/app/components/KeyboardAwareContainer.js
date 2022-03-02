import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Keyboard, ScrollView } from '@shoutem/ui';
import { ext } from '../const';

const KEYBOARD_AVOIDING_BEHAVIOUR =
  Platform.OS === 'android' ? 'null' : 'padding';
const KEYBOARD_OFFSET =
  Platform.OS === 'android' ? Keyboard.calculateKeyboardOffset() : 0;
const KEYBOARD_DISMISS_MODE =
  Platform.OS === 'android' ? 'on-drag' : 'interactive';

function KeyboardAwareContainer({ children, renderFooter, style }) {
  return (
    <KeyboardAvoidingView
      behavior={KEYBOARD_AVOIDING_BEHAVIOUR}
      keyboardVerticalOffset={KEYBOARD_OFFSET}
      style={style.container}
    >
      <ScrollView
        keyboardDismissMode={KEYBOARD_DISMISS_MODE}
        styleName="flexible"
        contentContainerStyle={style.contentContainer}
      >
        {children}
      </ScrollView>
      {_.isFunction(renderFooter) && renderFooter()}
    </KeyboardAvoidingView>
  );
}

KeyboardAwareContainer.propTypes = {
  children: PropTypes.node.isRequired,
  renderFooter: PropTypes.func,
  style: PropTypes.object,
};

KeyboardAwareContainer.defaultProps = {
  renderFooter: null,
  style: {},
};

export default connectStyle(ext('KeyboardAwareContainer'))(
  KeyboardAwareContainer,
);
