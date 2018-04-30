import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  View,
  Caption,
  Button,
  Text,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

const RegisterButton = ({ onPress }) => (
  <View>
    <Caption styleName="h-center lg-gutter-vertical">
      {I18n.t(ext('noAccountSectionTitle'))}
    </Caption>
    <Button styleName="full-width inflexible" onPress={onPress}>
      <Text>{I18n.t(ext('registerButton'))}</Text>
    </Button>
  </View>
);

const { func } = PropTypes;

RegisterButton.propTypes = {
  onPress: func,
};

RegisterButton.defaultPropTypes = {
  onPress: _.noop,
};

export default connectStyle(ext('RegisterButton'))(RegisterButton);

