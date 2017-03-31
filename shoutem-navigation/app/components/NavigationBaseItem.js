import React from 'react';
import _ from 'lodash';
import { resolveIconSource } from 'shoutem.theme';
import { Text, Image } from '@shoutem/ui';

const missingIconSource = require('../assets/images/missing_icon.png');

export class NavigationBaseItem extends React.Component {
  static propTypes = {
    shortcut: React.PropTypes.object.isRequired,
    style: React.PropTypes.object,
    showText: React.PropTypes.bool,
    showIcon: React.PropTypes.bool,
    showBackground: React.PropTypes.bool,
    iconSize: React.PropTypes.string,
    onPress: React.PropTypes.func,
    selected: React.PropTypes.bool,
  };

  static defaultProps = {
    showIcon: true,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // Delay the onPress handler so that we can
    // display the touch animations without blocking ui
    requestAnimationFrame(() => this.props.onPress(this.props.shortcut));
  }

  getShortcutLayoutSettings(layoutName, props = this.props) {
    const { shortcut } = props;
    return _.get(shortcut, ['settings', 'navigation', layoutName], {});
  }

  resolveIconProps() {
    const { style, shortcut } = this.props;

    const source = shortcut.icon ? resolveIconSource(shortcut.icon) : missingIconSource;

    return {
      style: style.icon,
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
      <Text {...this.resolveTextProps()}>
       {shortcut.title}
      </Text>
    );
  }
}
