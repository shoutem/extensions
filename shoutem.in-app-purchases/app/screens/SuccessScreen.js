import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function SuccessScreen({
  style,
  route: {
    params: { onButtonPress, description },
  },
}) {
  return (
    <Screen>
      <View style={style.container}>
        <Text style={style.title}>
          {I18n.t(ext('subscribeSuccessModalTitle'))}
        </Text>
        {description && <Text style={style.description}>{description}</Text>}
        <Button onPress={onButtonPress} style={style.button}>
          <Text style={style.buttonText}>
            {I18n.t(ext('startExploringButton'))}
          </Text>
        </Button>
      </View>
    </Screen>
  );
}

SuccessScreen.propTypes = {
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

SuccessScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('SuccessScreen'))(SuccessScreen);
