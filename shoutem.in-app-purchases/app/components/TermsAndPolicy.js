import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const TermsAndPolicy = ({
  privacyPolicyUrl,
  termsOfServiceUrl,
  onPrivacyPolicyPress,
  onTermsPress,
  style,
}) => {
  if (_.isEmpty(privacyPolicyUrl) && _.isEmpty(termsOfServiceUrl)) {
    return null;
  }

  return (
    <Text style={style.mainText}>
      {!_.isEmpty(termsOfServiceUrl) && (
        <Text onPress={onTermsPress} style={style.linkText}>
          {I18n.t(ext('termsOfService'))}
        </Text>
      )}
      {!_.isEmpty(termsOfServiceUrl) && (
        <Text>{` ${I18n.t(ext('termsAndPolicyConjuction'))} `}</Text>
      )}
      {!_.isEmpty(privacyPolicyUrl) && (
        <Text onPress={onPrivacyPolicyPress} style={style.linkText}>
          {I18n.t(ext('privacyPolicy'))}
        </Text>
      )}
    </Text>
  );
};

TermsAndPolicy.propTypes = {
  privacyPolicyUrl: PropTypes.string,
  termsOfServiceUrl: PropTypes.string,
  onPrivacyPolicyPress: PropTypes.func,
  onTermsPress: PropTypes.func,
  style: PropTypes.any,
};

export default connectStyle(ext('TermsAndPolicy'))(TermsAndPolicy);
