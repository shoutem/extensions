import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { DropdownPicker } from './shared';

// TODO: Support multiselect
function AudienceDropdown(props) {
  const { audiences, onAudiencePress, style } = props;

  const defaultAudience = _.get(audiences, '0.name', '');

  const renderCustomizedRowChild = item => {
    return <Text style={style.title}>{item?.name ?? defaultAudience}</Text>;
  };

  return (
    <DropdownPicker
      defaultButtonText={defaultAudience}
      label={I18n.t(ext('pushNotificationsAudienceDropdownPlaceholder'))}
      options={audiences}
      renderCustomizedButtonChild={renderCustomizedRowChild}
      renderCustomizedRowChild={renderCustomizedRowChild}
      onItemPress={onAudiencePress}
    />
  );
}

AudienceDropdown.propTypes = {
  audiences: PropTypes.array.isRequired,
  onAudiencePress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

AudienceDropdown.defaultProps = {
  style: {},
};

export default connectStyle(ext('AudienceDropdown'))(AudienceDropdown);
