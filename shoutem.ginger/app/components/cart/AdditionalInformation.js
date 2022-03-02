import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { openURL } from 'shoutem.web-view';
import { ext } from '../../const';

export function AdditionalInformation({ style, onRetailersPress }) {
  function handleWarningUrlOpen() {
    openURL('https://www.P65Warnings.ca.gov');
  }

  return (
    <>
      <View style={style.row}>
        <Icon name="ginger-stop" style={style.rowImage} />
        <Text style={style.rowText}>{I18n.t(ext('cartInfoAge'))}</Text>
      </View>
      <View style={style.row}>
        <Icon name="ginger-warning" style={style.rowImage} />
        <Text style={style.rowText}>
          {I18n.t(ext('cartInfoWarning'))}
          <Text
            onPress={handleWarningUrlOpen}
            style={[style.rowText, style.links]}
          >
            https://www.P65Warnings.ca.gov
          </Text>
        </Text>
      </View>
      <View style={style.row}>
        <Icon name="ginger-pins" style={style.rowImage} />
        <Text onPress={onRetailersPress} style={[style.rowText, style.links]}>
          {I18n.t(ext('cartInfoRetailersTitle'))}
        </Text>
      </View>
    </>
  );
}

AdditionalInformation.propTypes = {
  onRetailersPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

AdditionalInformation.defaultProps = {
  style: {},
};

export default connectStyle(ext('AdditionalInformation'))(
  AdditionalInformation,
);
