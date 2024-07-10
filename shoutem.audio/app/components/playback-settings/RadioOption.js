import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

const RadioOption = ({
  TextComponent,
  onPress,
  selected,
  showDivider,
  style,
}) => {
  const handlePress = useCallback(() => {
    if (selected) {
      return;
    }

    onPress();
  }, [onPress, selected]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      styleName="sm-gutter-vertical sm-gutter-horizontal"
    >
      <View styleName="horizontal v-center space-between sm-gutter">
        <TextComponent />
        <View style={style.radioOutterCircle}>
          {selected && <View style={style.radioInnerCircle} />}
        </View>
      </View>
      {showDivider && <Divider styleName="line sm-gutter-top" />}
    </TouchableOpacity>
  );
};

RadioOption.propTypes = {
  style: PropTypes.object.isRequired,
  TextComponent: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  showDivider: PropTypes.bool,
};

RadioOption.defaultProps = { selected: false, showDivider: true };

export default connectStyle(ext('RadioOption'))(RadioOption);
