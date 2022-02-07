import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Divider, SimpleHtml, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function OpeningHours({ htmlContent }) {
  if (!htmlContent) {
    return null;
  }

  return (
    <View styleName="vertical">
      <Divider styleName="section-header">
        <Caption>{I18n.t('shoutem.cms.openHours')}</Caption>
      </Divider>
      <SimpleHtml body={htmlContent} />
      <Divider />
    </View>
  );
}

OpeningHours.propTypes = {
  htmlContent: PropTypes.string,
};

OpeningHours.defaultProps = {
  htmlContent: undefined,
};

export default connectStyle(ext('OpeningHours'))(OpeningHours);
