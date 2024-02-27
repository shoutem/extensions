import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TouchableOpacity } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { QUESTIONS_SCHEMA } from '../redux';

export class Question extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { onPress, item } = this.props;

    onPress(item);
  }

  resolveItemName() {
    const { item, isBack } = this.props;

    if (isBack) {
      return _.get(item, 'name');
    }

    if (item?.type === QUESTIONS_SCHEMA) {
      return _.get(item, 'buttonLabel');
    }

    return I18n.t(`shoutem.cms.categories.${item.id}`, {
      defaultValue: item.name,
    });
  }

  render() {
    const { isBack, style } = this.props;

    return (
      <TouchableOpacity
        onPress={this.handlePress}
        style={[style.container, isBack && style.backContainer]}
      >
        <Text style={[style.text, isBack && style.backText]}>
          {this.resolveItemName()}
        </Text>
      </TouchableOpacity>
    );
  }
}

Question.propTypes = {
  onPress: PropTypes.func,
  item: PropTypes.object,
  isBack: PropTypes.bool,
  style: PropTypes.any,
};

export default connectStyle(ext('Question'))(Question);
