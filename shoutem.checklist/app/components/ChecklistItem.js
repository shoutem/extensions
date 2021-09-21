import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, SimpleHtml, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';

export class ChecklistItem extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    item: PropTypes.string.isRequired,
    // 'index' of 'ChecklistItem' within 'Checklist'
    itemIndex: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    checked: false,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  toggleCheckbox() {
    const { checked, itemIndex, onToggle } = this.props;

    onToggle(itemIndex, !checked);
  }

  render() {
    const { checked, disabled, item, style } = this.props;

    const fill = disabled ? style.disabledIconFill : style.iconFill;
    const name = checked ? 'checkbox-rectangle-on' : 'checkbox-rectangle-off';

    return (
      <View style={style.mainContainer} styleName="horizontal v-start">
        <TouchableOpacity disabled={disabled} onPress={this.toggleCheckbox}>
          <Icon fill={fill} name={name} />
        </TouchableOpacity>
        <SimpleHtml
          body={item}
          imagesMaxWidth={style.imagesMaxWidth}
          style={style.simpleHtml}
        />
      </View>
    );
  }
}

export default connectStyle(ext('ChecklistItem'))(ChecklistItem);
