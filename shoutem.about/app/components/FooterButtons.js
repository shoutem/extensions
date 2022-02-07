import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';
import LinkButton from './LinkButton';

function FooterButtons({ buttons }) {
  return (
    <View styleName="horizontal h-center">
      <View styleName="horizontal h-start wrap">
        {buttons.map(button => {
          return (
            <LinkButton
              key={button.icon}
              icon={button.icon}
              url={button.url}
              title={button.title}
              openURL={button.openURL}
            />
          );
        })}
      </View>
    </View>
  );
}

FooterButtons.propTypes = {
  buttons: PropTypes.array.isRequired,
};

export default connectStyle(ext('FooterButtons'))(FooterButtons);
