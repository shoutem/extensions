import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function NewMessagesLabel({ style }) {
  return (
    <View styleName="horizontal v-center stretch md-gutter">
      <View style={style.leadingLine} />
      <View style={style.textContainer} styleName="horizontal v-center">
        <Text style={style.text}>{I18n.t(ext('newMessagesLabel'))}</Text>
      </View>
      <View style={style.trailingLine} />
    </View>
  );
}

NewMessagesLabel.propTypes = {
  style: PropTypes.object,
};

NewMessagesLabel.defaultProps = {
  style: {},
};

export default connectStyle(ext('NewMessagesLabel'))(NewMessagesLabel);
