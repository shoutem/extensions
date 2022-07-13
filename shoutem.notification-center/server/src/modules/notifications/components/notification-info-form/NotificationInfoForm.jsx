import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { buildShortcutTree, createOptions } from 'src/services';
import {
  AUDIENCE_TYPES,
  DISPLAY_DATE_TIME_FORMAT,
  TARGET_TYPES,
} from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

export default class NotificationInfoForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  renderTarget() {
    const {
      shortcuts,
      notification: { target, contentUrl, shortcutId },
    } = this.props;

    // undefined will be when target is type of APP
    if (_.isUndefined(target)) {
      return null;
    }

    if (target === TARGET_TYPES.URL) {
      return (
        <Row>
          <Col xs={12}>
            <FormGroup controlId="target">
              <ControlLabel>
                {i18next.t(LOCALIZATION.URL_INPUT_LABEL)}
              </ControlLabel>
              <FormControl value={contentUrl} />
            </FormGroup>
          </Col>
        </Row>
      );
    }

    if (target === TARGET_TYPES.SCREEN) {
      const shortcutTree = buildShortcutTree(shortcuts);
      const shortcutOptions = createOptions(
        shortcutTree,
        'shortcut.key',
        'shortcut.title',
      );
      const shortcut = _.find(shortcutOptions, { value: shortcutId });
      const url = _.get(shortcut, 'label');

      return (
        <Row>
          <Col xs={12}>
            <FormGroup controlId="target">
              <ControlLabel>
                {i18next.t(LOCALIZATION.SCREEN_INPUT_LABEL)}
              </ControlLabel>
              <FormControl value={url} />
            </FormGroup>
          </Col>
        </Row>
      );
    }

    return null;
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
        summaries,
        numberOfMessages,
        deliveryTime,
        type,
      },
      onCancel,
    } = this.props;

    let targetTitle = i18next.t(LOCALIZATION.URL_INPUT_LABEL);
    let url = contentUrl;
    if (target === TARGET_TYPES.SCREEN) {
      targetTitle = i18next.t(LOCALIZATION.SCREEN_INPUT_LABEL);

      const shortcutTree = buildShortcutTree(shortcuts);
      const shortcutOptions = createOptions(
        shortcutTree,
        'shortcut.key',
        'shortcut.title',
      );
      const shortcut = _.find(shortcutOptions, { value: shortcutId });

      url = _.get(shortcut, 'label');
    }

    let audienceValue = i18next.t(LOCALIZATION.AUDIENCE_ALL_VALUE);
    if (audience === AUDIENCE_TYPES.GROUP) {
      const groupNames = _.map(audienceGroups, group => _.truncate(group.name));
      audienceValue = _.join(groupNames, ', ');
    }

    const sendDate = moment(deliveryTime).format(DISPLAY_DATE_TIME_FORMAT);

    return (
      <form className="notification-info-form">
        {this.renderTarget()}
        <Row>
          <Col xs={12}>
            <FormGroup controlId="audience">
              <ControlLabel>
                {i18next.t(LOCALIZATION.AUDIENCE_LABEL)}
              </ControlLabel>
              <FormControl value={audienceValue} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="deliveryTime">
              <ControlLabel>
                {i18next.t(LOCALIZATION.DELIVERY_LABEL)}
              </ControlLabel>
              <FormControl value={sendDate} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="title">
              <ControlLabel>{i18next.t(LOCALIZATION.TITLE_LABEL)}</ControlLabel>
              <FormControl value={title} />
            </FormGroup>
          </Col>
        </Row>
        {type !== 'Silent' && (
          <Row>
            <Col xs={12}>
              <FormGroup controlId="summary">
                <ControlLabel>
                  {i18next.t(LOCALIZATION.MESSAGE_LABEL)}
                </ControlLabel>
                <FormControl componentClass="textarea" value={summary} />
              </FormGroup>
            </Col>
          </Row>
        )}
        {type === 'Silent' && (
          <>
            {_.map(summaries, summary => {
              return (
                <FormGroup>
                  <ControlLabel>
                    {i18next.t(LOCALIZATION.MESSAGE_LABEL)}
                  </ControlLabel>
                  <FormControl componentClass="textarea" value={summary} />
                </FormGroup>
              );
            })}
            <FormGroup>
              <ControlLabel>
                {i18next.t(LOCALIZATION.NUMBER_OF_MESSAGES_LABEL)}
              </ControlLabel>
              <FormControl value={numberOfMessages} />
            </FormGroup>
          </>
        )}
        <ButtonToolbar>
          <Button bsSize="large" onClick={onCancel}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
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
