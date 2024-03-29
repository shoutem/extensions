import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Image, Text } from '@shoutem/ui';
import { I18n, LocalizationContext } from 'shoutem.i18n';
import { resolveIconSource } from 'shoutem.theme/helpers/resolveIconSource';

const missingIconSource = require('../assets/images/missing_icon.png');

export class NavigationBaseItem extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object, // Shortcut can be undefined if there is less than 5 tab items in tab bar navigation.
    showIcon: PropTypes.bool,
    showText: PropTypes.bool,
    style: PropTypes.object,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    shortcut: undefined,
    showIcon: true,
    showText: false,
    style: {},
    onPress: _.noop,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    const { onPress, shortcut } = this.props;

    onPress(shortcut);
  }

  getShortcutLayoutSettings(layoutName, props = this.props) {
    const { shortcut } = props;
    return _.get(shortcut, ['settings', 'navigation', layoutName], {});
  }

  resolveIconProps() {
    const {
      style,
      shortcut: { icon },
    } = this.props;

    const iconStyle = { ...style.icon };

    if (icon && icon.split('.').pop() !== 'png') {
      // If it's not a PNG icon, remove tint color
      iconStyle.tintColor = undefined;
    }

    const source = icon ? resolveIconSource(icon) : missingIconSource;

    return {
      style: iconStyle,
      source,
    };
  }

  resolveTextProps() {
    const { style } = this.props;
    return {
      style: style.text,
      numberOfLines: 1,
      styleName: 'center regular',
    };
  }

  renderIcon() {
    const { showIcon } = this.props;

    if (!showIcon) {
      return null;
    }

    return <Image {...this.resolveIconProps()} />;
  }

  renderText() {
    const { shortcut, showText } = this.props;

    if (!showText) {
      return null;
    }

    return (
      <LocalizationContext.Consumer>
        {() => {
          const title = I18n.t(`shoutem.navigation.shortcuts.${shortcut.id}`, {
            defaultValue: shortcut.title,
          });
          return <Text {...this.resolveTextProps()}>{title}</Text>;
        }}
      </LocalizationContext.Consumer>
    );
  }
}
