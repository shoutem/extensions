import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n, LocalizationContext } from 'shoutem.i18n';
import { Text } from '@shoutem/ui';

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

    return (
      <LocalizationContext.Consumer>
        {() => {
          const useManualTitle = !_.isUndefined(manualTitle);
          const resolvedTitle = useManualTitle
            ? manualTitle
            : shortcut
              ? I18n.t(`shoutem.navigation.shortcuts.${shortcut.id}`, {
                defaultValue: shortcut.title,
              })
              : title;
          return (
            <AnimatedText style={style} numberOfLines={1}>
              {resolvedTitle.toUpperCase()}
            </AnimatedText>
          );
        }}
      </LocalizationContext.Consumer>
    );
  }
}

HeaderTitle.propTypes = {
  style: PropTypes.object,
  title: PropTypes.any,
  shortcut: PropTypes.object,
};

export default Animated.createAnimatedComponent(HeaderTitle);
