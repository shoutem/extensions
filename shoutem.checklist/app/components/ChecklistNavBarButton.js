import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export class ChecklistNavBarButton extends PureComponent {
  static propTypes = {
    contactEmail: PropTypes.string,
    isSubmitted: PropTypes.bool,
    onContactPress: PropTypes.func.isRequired,
    onSubmitPress: PropTypes.func.isRequired,
  };

  render() {
    const {
      contactEmail,
      isSubmitted,
      onContactPress,
      onSubmitPress,
      style,
    } = this.props;

    if (isSubmitted) {
      if (!contactEmail) {
        return null;
      }

      return (
        <Button onPress={onContactPress} styleName="clear">
          <Text style={style.buttonText}>
            {I18n.t(ext('checklistScreenHelpButton'))}
          </Text>
        </Button>
      );
    }

    return (
      <Button onPress={onSubmitPress} styleName="clear">
        <Text style={style.buttonText}>
          {I18n.t(ext('checklistScreenSubmitButton'))}
        </Text>
      </Button>
    );
  }
}

export default connectStyle(ext('ChecklistNavBarButton'))(
  ChecklistNavBarButton,
);
