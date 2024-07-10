import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import RadioOption from './RadioOption';

const PlaybackSpeedOption = ({
  text,
  value,
  selected,
  showDivider,
  onPress,
  style,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePress = useCallback(() => onPress(value), []);
  // eslint-disable-next-line react/no-multi-comp
  const ResolvedTextComponent = () => (
    <Text style={style.optionText}>
      {text}
      {value === 1 && (
        <Caption>{` ${I18n.t(ext('normalRateCaption'))}`}</Caption>
      )}
    </Text>
  );

  return (
    <RadioOption
      TextComponent={ResolvedTextComponent}
      onPress={handlePress}
      selected={selected}
      showDivider={showDivider}
    />
  );
};

PlaybackSpeedOption.propTypes = {
  style: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  showDivider: PropTypes.bool,
};

PlaybackSpeedOption.defaultProps = { selected: false, showDivider: true };

export default connectStyle(ext('PlaybackSpeedOption'))(PlaybackSpeedOption);
