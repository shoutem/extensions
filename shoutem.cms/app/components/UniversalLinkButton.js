import React from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Icon,
  Row,
  Subtitle,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { getMapUrl } from '../services';

export const UNIVERSAL_LINK_BUTTON_TYPE = {
  LIST: 'list',
  TILE: 'tile',
};

export const UNIVERSAL_LINK_TYPE = {
  WEB: 'web',
  PHONE: 'phone',
  EMAIL: 'mail',
  LOCATION: 'location',
};

const UniversalLinkButton = ({
  link,
  location,
  type,
  title,
  subtitle,
  iconName,
  buttonType,
}) => {
  if (!link && !location) {
    return null;
  }

  const handleLinkPress = () => {
    if (type === UNIVERSAL_LINK_TYPE.WEB) {
      Linking.openURL(link);
      return;
    }

    if (type === UNIVERSAL_LINK_TYPE.EMAIL) {
      Linking.openURL(`mailto:${link}`);
      return;
    }

    if (type === UNIVERSAL_LINK_TYPE.PHONE) {
      Linking.openURL(`tel:${link}`);
      return;
    }

    const { latitude, longitude, formattedAddress } = location;

    Linking.openURL(getMapUrl(latitude, longitude, formattedAddress));
  };

  const resolveIcon = () => {
    if (iconName) {
      return iconName;
    }

    if (type === UNIVERSAL_LINK_TYPE.WEB) {
      return 'web';
    }

    if (type === UNIVERSAL_LINK_TYPE.EMAIL) {
      return 'email';
    }

    if (type === UNIVERSAL_LINK_TYPE.PHONE) {
      return 'call';
    }

    return 'pin';
  };

  if (buttonType === UNIVERSAL_LINK_BUTTON_TYPE.INLINE) {
    return (
      <TouchableOpacity onPress={handleLinkPress}>
        <Divider styleName="line" />
        <Row>
          <Icon name={resolveIcon()} styleName="indicator" />
          <View styleName="vertical">
            {title && <Subtitle>{title}</Subtitle>}
            {subtitle && <Text numberOfLines={1}>{subtitle}</Text>}
          </View>
          <Icon name="right-arrow" styleName="indicator disclosure" />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  return (
    <Button styleName="stacked clear tight" onPress={handleLinkPress}>
      <Icon name={iconName} />
      <Text>{title}</Text>
    </Button>
  );
};

UniversalLinkButton.propTypes = {
  buttonType: PropTypes.oneOf([
    UNIVERSAL_LINK_BUTTON_TYPE.INLINE,
    UNIVERSAL_LINK_BUTTON_TYPE.TILE,
  ]),
  iconName: PropTypes.string,
  link: PropTypes.string,
  location: PropTypes.shape({
    formattedAddress: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  subtitle: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
};

UniversalLinkButton.defaultProps = {
  buttonType: UNIVERSAL_LINK_BUTTON_TYPE.INLINE,
  iconName: undefined,
  link: undefined,
  location: undefined,
  subtitle: undefined,
  title: undefined,
  type: UNIVERSAL_LINK_TYPE.WEB,
};

export default UniversalLinkButton;
