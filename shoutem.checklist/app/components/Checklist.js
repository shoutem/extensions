import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { SimpleHtml, Title, View } from '@shoutem/ui';
import { ChecklistItem } from '../components';
import { ext } from '../const';

export class Checklist extends PureComponent {
  static propTypes = {
    checklist: PropTypes.object,
    checklistStatus: PropTypes.object,
    disabled: PropTypes.bool,
    onItemToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleItemToggle(itemIndex, itemStatus) {
    const { checklist, onItemToggle } = this.props;
    const { id } = checklist;

    onItemToggle(id, itemIndex, itemStatus);
  }

  render() {
    const { checklist, checklistStatus, disabled, style } = this.props;
    const { description, checklistItems, title } = checklist;

    return (
      <View style={style.mainContainer}>
        <Title styleName="md-gutter-bottom">{title}</Title>
        <SimpleHtml
          body={description}
          imagesMaxWidth={style.imagesMaxWidth}
          style={style.simpleHtml}
        />
        {checklistItems.map((item, index) => {
          return (
            <ChecklistItem
              checked={checklistStatus[index]}
              disabled={disabled}
              item={item}
              itemIndex={index}
              key={index}
              onToggle={this.handleItemToggle}
            />
          );
        })}
      </View>
    );
  }
}

export default connectStyle(ext('Checklist'))(Checklist);
