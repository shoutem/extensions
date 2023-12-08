import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Text } from '@shoutem/ui';
import { I18n, LocalizationContext } from 'shoutem.i18n';

const AnimatedText = Animated.createAnimatedComponent(Text);

class HeaderTitle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      manualTitle: undefined,
    };
  }

  componentDidUpdate(prevProps) {
    const { title } = this.props;
    const { title: prevTitle } = prevProps;

    if (title !== prevTitle) {
      this.setState({ manualTitle: title });
    }
  }

  render() {
    const { style, shortcut, title } = this.props;
    const { manualTitle } = this.state;

    const useManualTitle = !_.isUndefined(manualTitle);
    const shortcutTitle = shortcut
      ? I18n.t(`shoutem.navigation.shortcuts.${shortcut.id}`, {
          defaultValue: shortcut.title,
        })
      : title;

    const resolvedTitle = useManualTitle ? manualTitle : shortcutTitle;

    return (
      <LocalizationContext.Consumer>
        {() => (
          <AnimatedText style={style} numberOfLines={1}>
            {resolvedTitle}
          </AnimatedText>
        )}
      </LocalizationContext.Consumer>
    );
  }
}

HeaderTitle.propTypes = {
  shortcut: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.any,
};

HeaderTitle.defaultProps = {
  shortcut: undefined,
  style: undefined,
  title: undefined,
};

export default Animated.createAnimatedComponent(HeaderTitle);
