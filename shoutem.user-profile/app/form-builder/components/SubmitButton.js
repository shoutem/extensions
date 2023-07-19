import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

function SubmitButton({ onPress, style }) {
  return (
    <View style={style.container}>
      <Button onPress={onPress} style={style.button}>
        <Text style={style.text}>{I18n.t(ext('submitFormButtonTitle'))}</Text>
      </Button>
    </View>
  );
}

SubmitButton.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('SubmitButton'))(SubmitButton);
