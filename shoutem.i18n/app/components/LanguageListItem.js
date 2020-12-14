import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import ISO6391 from 'iso-639-1';
import PropTypes from 'prop-types';

import { connectStyle } from '@shoutem/theme';
import {
  Icon,
  Row,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { ext } from '../const';
import { Languages } from '../services';

export class LanguageListItem extends PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    active: PropTypes.bool,
    onPress: PropTypes.func,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleItemPress() {
    const { onPress, locale } = this.props;

    if (onPress) {
      onPress(locale);
    }
  }

  render() {
    const { locale, active, style } = this.props;
    const languageName = Languages.resolveLanguageNamePerLocale(locale);
    const localisedLanguageName = ISO6391.getNativeName(locale);
    const iconName = active ? 'checkbox-on' : 'checkbox-off';

    return (
      <TouchableOpacity onPress={this.handleItemPress}>
        <Row style={style.container} styleName="small">
          <View styleName="vertical">
            <Text style={style.text}>{languageName}</Text>
            {!!localisedLanguageName &&
              <Text style={style.localisedText}>{localisedLanguageName}</Text>
            }
          </View>
          <Icon name={iconName} />
        </Row>
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('LanguageListItem'))(LanguageListItem);
