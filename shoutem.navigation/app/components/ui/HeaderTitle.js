import React, { PureComponent } from 'react';
import { Animated, Text as RNText } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n, LocalizationContext } from 'shoutem.i18n';

const AnimatedText = Animated.createAnimatedComponent(RNText);

export default class HeaderTitle extends PureComponent {
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
          const shortcutTitle = shortcut
            ? I18n.t(`shoutem.navigation.shortcuts.${shortcut.id}`, {
                defaultValue: shortcut.title,
              })
            : title;

          const resolvedTitle = useManualTitle ? manualTitle : shortcutTitle;

          return (
            <AnimatedText style={style} numberOfLines={1}>
              {resolvedTitle}
            </AnimatedText>
          );
        }}
      </LocalizationContext.Consumer>
    );
  }
}

HeaderTitle.propTypes = {
  shortcut: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  title: PropTypes.string,
};

HeaderTitle.defaultProps = {
  title: '',
};
