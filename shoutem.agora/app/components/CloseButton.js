import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { HeaderCloseButton } from 'shoutem.navigation';
import { ext } from '../const';

export const CloseButton = ({ style }) => {
  const { goBack } = useNavigation();

  return (
    <View style={style.container}>
      <HeaderCloseButton tintColor={style.closeButton} onPress={goBack} />
    </View>
  );
};

CloseButton.propTypes = {
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('CloseButton'))(CloseButton);
