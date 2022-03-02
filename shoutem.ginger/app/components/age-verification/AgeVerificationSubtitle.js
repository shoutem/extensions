import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Subtitle, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

function AgeVerificationSubtitle({
  onPrivacyPolicyPress,
  onTermsOfServicePress,
  style,
}) {
  return (
    <Subtitle style={style.container} styleName="h-center">
      {I18n.t(ext('ageVerificationSubtitle'))}
      <Text style={style.bold} onPress={onPrivacyPolicyPress}>
        {I18n.t(ext('privacyPolicy'))}
      </Text>
      <Subtitle style={style.text}>{` ${I18n.t(ext('and'))} `}</Subtitle>
      <Text style={style.bold} onPress={onTermsOfServicePress}>
        {I18n.t(ext('termsOfService'))}
      </Text>
    </Subtitle>
  );
}

AgeVerificationSubtitle.propTypes = {
  onPrivacyPolicyPress: PropTypes.func.isRequired,
  onTermsOfServicePress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

AgeVerificationSubtitle.defaultProps = {
  style: {},
};

export default connectStyle(ext('AgeVerificationSubtitle'))(
  AgeVerificationSubtitle,
);
