import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Caption, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const RegisterButton = ({ onPress }) => (
  <View>
    <Caption>{I18n.t(ext('noAccountSectionTitle'))}</Caption>
    <Button onPress={onPress} styleName="clear">
      <Text>{I18n.t(ext('createNewAccount'))}</Text>
    </Button>
  </View>
);

RegisterButton.propTypes = {
  onPress: PropTypes.func,
};

RegisterButton.defaultProps = {
  onPress: _.noop,
};

export default connectStyle(ext('RegisterButton'))(RegisterButton);
