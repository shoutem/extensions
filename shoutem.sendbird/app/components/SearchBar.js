import React, { PureComponent } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { I18n } from 'shoutem.i18n';
import {
  View,
  TextInput,
  Icon,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class SearchBar extends PureComponent {
  static propTypes = {
    style: View.propTypes.style,
    onChangeText: PropTypes.func,
    ...TextInput.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.animationValue = new Animated.Value(0);

    this.state = {
      focused: false,
      searchQuery: '',
    };
  }

  animateClearButton(display = true) {
    Animated.spring(this.animationValue, {
      toValue: display ? 1 : 0,
      duration: 250,
      friction: display ? 4 : 7,
      useNativeDriver: true,
    }).start();
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }

  handleTextChange(text) {
    const { onChangeText } = this.props;
    const { searchQuery } = this.state;

    if (_.isEmpty(searchQuery) && !_.isEmpty(text)) {
      this.animateClearButton();
    }

    if (!_.isEmpty(searchQuery) && _.isEmpty(text)) {
      this.animateClearButton(false);
    }

    this.setState({ searchQuery: text });
    onChangeText(text);
  }

  handleClosePress() {
    this.handleTextChange('');
  }

  render() {
    const { style, ...props } = this.props;
    const { focused, searchQuery } = this.state;

    const transform = [
      { scale: this.animationValue },
      { perspective: 1000 },
    ];

    return (
      <View style={style.container}>
        <TextInput
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          placeholder={I18n.t(ext('searchBarPlaceholder'))}
          {...props}
          onChangeText={this.handleTextChange}
          style={[style.input, focused && style.inputFocused]}
          value={searchQuery}
        />
        <AnimatedTouchable
          onPress={this.handleClosePress}
          style={[
            style.iconWrapper,
            { transform },
          ]}
        >
          <Icon name="clear-text" style={style.icon} />
        </AnimatedTouchable>
      </View>
    );
  }
}

export default connectStyle(ext('SearchBar'))(SearchBar);
