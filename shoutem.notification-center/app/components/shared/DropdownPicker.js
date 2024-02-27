import React, { useCallback, useMemo } from 'react';
import { Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ChevronDown } from '../../assets';
import { ext } from '../../const';

const { height } = Dimensions.get('window');

const DROPDOWN_MAX_HEIGHT = height * 0.3;

function DropdownPicker({
  defaultValue,
  label,
  onItemPress,
  options,
  style,
  ...otherProps
}) {
  const renderDropdownIcon = useCallback(() => <ChevronDown />, []);

  const defaultText = useMemo(() => defaultValue ?? _.get(options, 0, null), [
    defaultValue,
    options,
  ]);

  const dropdownStyle = useMemo(() => {
    const height =
      options.length * 50 > DROPDOWN_MAX_HEIGHT
        ? DROPDOWN_MAX_HEIGHT
        : options.length * 50;

    return { height };
  }, [options]);

  const buttonTextAfterSelection = selectedItem => selectedItem;

  const rowTextForSelection = item => item;

  return (
    <View style={style.mainContainer}>
      <Text style={style.label}>{label}</Text>
      <SelectDropdown
        buttonStyle={style.container}
        buttonTextAfterSelection={buttonTextAfterSelection}
        buttonTextStyle={style.text}
        data={options}
        defaultButtonText={defaultText}
        dropdownIconPosition="right"
        dropdownOverlayColor={style.overlay.color}
        dropdownStyle={dropdownStyle}
        renderDropdownIcon={renderDropdownIcon}
        rowStyle={style.row}
        rowTextForSelection={rowTextForSelection}
        rowTextStyle={style.text}
        onSelect={onItemPress}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...otherProps}
      />
    </View>
  );
}

DropdownPicker.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onItemPress: PropTypes.func.isRequired,
  defaultValue: PropTypes.any,
  style: PropTypes.object,
};

DropdownPicker.defaultProps = {
  defaultValue: null,
  style: {},
};

export default React.memo(connectStyle(ext('DropdownPicker'))(DropdownPicker));
