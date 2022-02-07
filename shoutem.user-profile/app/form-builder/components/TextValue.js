import React, { useMemo } from 'react';
import { Linking, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Text, View } from '@shoutem/ui';
import { ext } from '../../const';

export function TextValue({ isLink, label, showLabel, style, value }) {
  function handlePress() {
    if (isLink) {
      Linking.openURL(value);
    }
  }

  const resolvedStyle = useMemo(() => (isLink ? style.pressableLink : {}), [
    isLink,
    style.pressableLink,
  ]);

  return (
    <>
      <View styleName="horizontal v-center md-gutter-horizontal sm-gutter-vertical">
        {showLabel && (
          <View style={style.labelContainer}>
            <Text style={style.label} numberOfLines={3}>
              {label}
            </Text>
          </View>
        )}
        <View styleName="flexible md-gutter-horizontal">
          <Pressable
            disabled={!isLink}
            onPress={handlePress}
            style={({ pressed }) => ({
              ...(pressed && style.pressedLink),
            })}
          >
            <Text style={resolvedStyle}>{value}</Text>
          </Pressable>
        </View>
      </View>
      <Divider styleName="line" style={style.divider} />
    </>
  );
}

TextValue.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  isLink: PropTypes.bool,
  showLabel: PropTypes.bool,
  value: PropTypes.string,
};

TextValue.defaultProps = {
  isLink: false,
  showLabel: true,
  value: '',
};

export default connectStyle(ext('TextValue'))(TextValue);
