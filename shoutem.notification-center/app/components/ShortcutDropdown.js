import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { DropdownPicker } from './shared';

function ShortcutDropdown(props) {
  const { defaultShortcut, onShortcutPress, shortcuts, style } = props;

  const defaultShortcutTitle =
    defaultShortcut ?? _.get(shortcuts, '0.title', '');

  const renderCustomizedRowChild = item => {
    const level = _.get(item, 'level', 0);
    const title = _.get(item, 'title', defaultShortcutTitle);

    const resolvedStyle = {
      paddingLeft: (level + 1) * style.row.indentationPadding,
    };

    return <Text style={resolvedStyle}>{title}</Text>;
  };

  const renderCustomizedButtonChild = item => {
    const title = _.get(item, 'title', defaultShortcutTitle);

    return <Text style={style.title}>{title}</Text>;
  };

  return (
    <DropdownPicker
      defaultButtonText={defaultShortcut}
      label={I18n.t(ext('pushNotificationsShortcutPickerCaption'))}
      options={shortcuts}
      renderCustomizedButtonChild={renderCustomizedButtonChild}
      renderCustomizedRowChild={renderCustomizedRowChild}
      onItemPress={onShortcutPress}
    />
  );
}

ShortcutDropdown.propTypes = {
  shortcuts: PropTypes.array.isRequired,
  onShortcutPress: PropTypes.func.isRequired,
  defaultShortcut: PropTypes.string,
  style: PropTypes.object,
};

ShortcutDropdown.defaultProps = {
  defaultShortcut: null,
  style: {},
};

export default connectStyle(ext('ShortcutDropdown'))(ShortcutDropdown);
