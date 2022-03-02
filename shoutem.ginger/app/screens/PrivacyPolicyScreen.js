import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView, SimpleHtml } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const IGNORED_STYLES = [
  'font-family',
  'letter-spacing',
  'transform',
  'text-decoration-style',
  'text-decoration-color',
];

function PrivacyPolicyScreen({ navigation, style }) {
  const { privacyPolicy } = useSelector(state =>
    getExtensionSettings(state, ext()),
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: I18n.t(ext('privacyPolicyNavBarTitle')),
      }),
    [navigation],
  );

  return (
    <Screen styleName="md-gutter">
      <ScrollView>
        <SimpleHtml body={privacyPolicy} ignoredStyles={IGNORED_STYLES} />
      </ScrollView>
    </Screen>
  );
}

PrivacyPolicyScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

PrivacyPolicyScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('PrivacyPolicyScreen'))(PrivacyPolicyScreen);
