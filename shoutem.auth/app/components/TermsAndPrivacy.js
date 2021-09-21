import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { openURL } from 'shoutem.web-view';
import { View, Text } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

const TermsAndPrivacy = ({ termsOfServiceLink, privacyPolicyLink, style }) => {
  const handleTermsOfServiceTap = () => {
    openURL(termsOfServiceLink);
  };

  const handlePrivacyPolicyTap = () => {
    openURL(privacyPolicyLink);
  };

  if (!termsOfServiceLink || !privacyPolicyLink) {
    return null;
  }

  return (
    <View style={style.container}>
      <Text>{I18n.t(ext('signupAcknowledgement.leadMessage'))}</Text>
      <View styleName="horizontal v-center md-gutter-top">
        <Text style={style.link} onPress={handleTermsOfServiceTap}>
          {I18n.t(ext('signupAcknowledgement.termsOfService'))}
        </Text>
        <Text>{I18n.t(ext('signupAcknowledgement.conjuction'))}</Text>
        <Text style={style.link} onPress={handlePrivacyPolicyTap}>
          {I18n.t(ext('signupAcknowledgement.privacyPolicy'))}
        </Text>
      </View>
    </View>
  );
};

TermsAndPrivacy.propTypes = {
  termsOfServiceLink: PropTypes.string,
  privacyPolicyLink: PropTypes.string,
  style: PropTypes.any,
};

export default connectStyle(ext('TermsAndPrivacy'))(TermsAndPrivacy);
