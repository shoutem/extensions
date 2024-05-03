import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { formatToAllDayDate, formatToLocalDate } from '../services/Calendar';
/**
 * Component used to render single list event item
 */
export default class ListEventView extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    const { onPress, event } = this.props;

    if (_.isFunction(onPress)) {
      onPress(event);
    }
  }

  action() {
    const { event, action } = this.props;

    action(event);
  }

  render() {
    const { event, style, onPress } = this.props;

    const caption = event.allDay
      ? formatToAllDayDate(event.start, event.end)
      : formatToLocalDate(event.start);

    return (
      <TouchableOpacity
        disabled={!_.isFunction(onPress)}
        onPress={this.onPress}
        key={event.id}
        style={style}
      >
        <Row>
          <View styleName="vertical stretch space-between sm-gutter-horizontal">
            <Subtitle>{event.name}</Subtitle>
            <Caption>{caption}</Caption>
          </View>
          <Button styleName="tight clear" onPress={this.action}>
            <Icon name="add-event" />
          </Button>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

ListEventView.propTypes = {
  action: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

ListEventView.defaultProps = {
  onPress: undefined,
  style: {},
};
