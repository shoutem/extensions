import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  HelpBlock,
  ControlLabel,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import Select from 'react-select';
import {
  LoaderContainer,
  ReduxFormElement,
  RadioSelector,
  DateTimePicker,
} from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { GroupsDropdown } from '../../../groups';
import { validateNotification } from '../../services';
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_TIME_FORMAT,
  AUDIENCE_TYPES,
  DELIVERY_TYPES,
  TARGET_OPTIONS,
  AUDIENCE_OPTIONS,
  DELIVERY_OPTIONS,
  TARGET_TYPES,
} from '../../const';
import { ShortcutsDropdown } from '../shortcuts-dropdown';
import './style.scss';

class NotificationForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleTargetChanged(item) {
    const {
      fields: { target },
    } = this.props;
    const value = _.get(item, 'value');
    target.onChange(value);
  }

  handleAudienceGroupsChange(newGroups) {
    const {
      touch,
      fields: { audienceGroupIds },
    } = this.props;
    audienceGroupIds.onChange(newGroups);
    touch('audienceGroupIds');
  }

  handleAudienceGroupsTouched(isOpen) {
    const { touch } = this.props;

    if (!isOpen) {
      touch('audienceGroupIds');
    }
  }

  handleAudienceSelect(item) {
    const {
      fields: { audience },
    } = this.props;
    audience.onChange(item);
  }

  handleDeliverySelect(item) {
    const {
      fields: { delivery },
    } = this.props;
    delivery.onChange(item);
  }

  render() {
    const {
      groups,
      shortcuts,
      submitting,
      invalid,
      fields: {
        id,
        target,
        contentUrl,
        shortcutId,
        audience,
        audienceGroupIds,
        title,
        summary,
        delivery,
        deliveryTime,
      },
      onCancel,
      handleSubmit,
      error,
    } = this.props;

    const inEditMode = !!id.value;

    const audienceGroupsDisabled = audience.value === AUDIENCE_TYPES.ALL;
    const deliveryTimeDisabled = delivery.value === DELIVERY_TYPES.NOW;
    const showShortcuts = target.value === TARGET_TYPES.SCREEN;

    return (
      <form className="notification-form" onSubmit={handleSubmit}>
        <Row>
          <Col xs={5}>
            <FormGroup controlId="target">
              <ControlLabel>Select what to open</ControlLabel>
              <Select
                name="target"
                elementId="target"
                clearable={false}
                onChange={this.handleTargetChanged}
                options={TARGET_OPTIONS}
                value={target.value}
              />
            </FormGroup>
          </Col>
          <Col xs={7}>
            {!showShortcuts && (
              <ReduxFormElement
                elementId="contentUrl"
                name="URL to open"
                disabled={submitting}
                field={contentUrl}
              />
            )}
            {showShortcuts && (
              <ReduxFormElement
                disabled={submitting}
                elementId="shortcutId"
                name="Screen to open"
                field={shortcutId}
              >
                <ShortcutsDropdown
                  shortcuts={shortcuts}
                  shortcut={shortcutId.value}
                />
              </ReduxFormElement>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <FormGroup controlId="audience">
              <ControlLabel>Audience</ControlLabel>
              <RadioSelector
                className="notification-form__radio-selector"
                groupName="audience"
                options={AUDIENCE_OPTIONS}
                activeValue={audience.value}
                onSelect={this.handleAudienceSelect}
              />
            </FormGroup>
          </Col>
          <Col xs={7} className="notification-form__select">
            <ReduxFormElement
              disabled={submitting || audienceGroupsDisabled}
              elementId="audienceGroupIds"
              field={audienceGroupIds}
            >
              <GroupsDropdown
                className="notification-form__groups"
                onSelectionChanged={this.handleAudienceGroupsChange}
                onToggle={this.handleAudienceGroupsTouched}
                selectedGroupIds={audienceGroupIds.value}
                groups={groups}
              />
            </ReduxFormElement>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <FormGroup controlId="delivery">
              <ControlLabel>Delivery date and time</ControlLabel>
              <RadioSelector
                className="notification-form__radio-selector"
                groupName="delivery"
                options={DELIVERY_OPTIONS}
                activeValue={delivery.value}
                onSelect={this.handleDeliverySelect}
              />
            </FormGroup>
          </Col>
          <Col xs={7} className="notification-form__date-select">
            <ReduxFormElement
              disabled={submitting || deliveryTimeDisabled}
              elementId="deliveryTime"
              field={deliveryTime}
            >
              <DateTimePicker
                clearable={false}
                utc={false}
                inputProps={{
                  placeholder: 'Select date and time',
                  disabled: submitting || deliveryTimeDisabled,
                }}
                dateFormat={DISPLAY_DATE_FORMAT}
                timeFormat={DISPLAY_TIME_FORMAT}
              />
            </ReduxFormElement>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ReduxFormElement
              elementId="title"
              name="Title"
              maxLength={255}
              disabled={submitting}
              field={title}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ReduxFormElement
              disabled={submitting}
              elementId="summary"
              name="Message"
              field={summary}
            >
              <FormControl
                componentClass="textarea"
                maxLength={255}
                {...summary}
              />
            </ReduxFormElement>
          </Col>
        </Row>
        <ButtonToolbar>
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={submitting || invalid}
            type="submit"
          >
            <LoaderContainer isLoading={submitting}>
              {inEditMode ? 'Save' : 'Create'}
            </LoaderContainer>
          </Button>
          <Button bsSize="large" disabled={submitting} onClick={onCancel}>
            Cancel
          </Button>
        </ButtonToolbar>
        {error && (
          <div className="has-error">
            <HelpBlock>{error}</HelpBlock>
          </div>
        )}
      </form>
    );
  }
}

NotificationForm.propTypes = {
  handleSubmit: PropTypes.func,
  groups: PropTypes.array,
  shortcuts: PropTypes.array,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  touch: PropTypes.func,
  error: PropTypes.string,
};

// iconUrl and imageUrl fields are necessary even we don't use it
// server is returning those fields and when updating notification
// we need to pass them back to the server
export default reduxForm({
  getFormState,
  form: 'groupForm',
  fields: [
    'id',
    'target',
    'contentUrl',
    'shortcutId',
    'audience',
    'audienceGroupIds',
    'title',
    'summary',
    'delivery',
    'deliveryTime',
    'iconUrl',
    'imageUrl',
  ],
  validate: validateNotification,
})(NotificationForm);
