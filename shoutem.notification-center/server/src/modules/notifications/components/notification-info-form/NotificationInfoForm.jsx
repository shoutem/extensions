import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import { createOptions, buildShortcutTree } from 'src/services';
import {
  DISPLAY_DATE_TIME_FORMAT,
  AUDIENCE_TYPES,
  TARGET_TYPES,
} from '../../const';
import './style.scss';

export default class NotificationInfoForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  render() {
    const {
      shortcuts,
      notification: {
        target,
        contentUrl,
        shortcutId,
        audience,
        audienceGroups,
        title,
        summary,
        deliveryTime,
      },
      onCancel,
    } = this.props;

    let targetTitle = 'URL to open';
    let url = contentUrl;
    if (target === TARGET_TYPES.SCREEN) {
      targetTitle = 'Screen to open';

      const shortcutTree = buildShortcutTree(shortcuts);
      const shortcutOptions = createOptions(
        shortcutTree,
        'shortcut.key',
        'shortcut.title',
      );
      const shortcut = _.find(shortcutOptions, { value: shortcutId });

      url = _.get(shortcut, 'label');
    }

    let audienceValue = 'All';
    if (audience === AUDIENCE_TYPES.GROUP) {
      const groupNames = _.map(audienceGroups, group => _.truncate(group.name));
      audienceValue = _.join(groupNames, ', ');
    }

    const sendDate = moment(deliveryTime).format(DISPLAY_DATE_TIME_FORMAT);

    return (
      <form className="notification-info-form">
        <Row>
          <Col xs={12}>
            <FormGroup controlId="target">
              <ControlLabel>{targetTitle}</ControlLabel>
              <FormControl value={url} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="audience">
              <ControlLabel>Audience</ControlLabel>
              <FormControl value={audienceValue} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="deliveryTime">
              <ControlLabel>Send date</ControlLabel>
              <FormControl value={sendDate} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="title">
              <ControlLabel>Title</ControlLabel>
              <FormControl value={title} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="summary">
              <ControlLabel>Message</ControlLabel>
              <FormControl componentClass="textarea" value={summary} />
            </FormGroup>
          </Col>
        </Row>
        <ButtonToolbar>
          <Button bsSize="large" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

NotificationInfoForm.propTypes = {
  notification: PropTypes.object,
  shortcuts: PropTypes.array,
  onCancel: PropTypes.func,
};
