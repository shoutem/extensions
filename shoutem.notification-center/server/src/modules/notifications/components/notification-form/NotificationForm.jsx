import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  Row,
} from 'react-bootstrap';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { getFormState } from 'src/redux';
import {
  Switch,
  DateTimePicker,
  LoaderContainer,
  RadioSelector,
  ReduxFormElement,
} from '@shoutem/react-web-ui';
import { GroupsDropdown } from '../../../groups';
import {
  AUDIENCE_TYPES,
  DELIVERY_TYPES,
  RECURRING_PERIOD_TYPES,
  DISPLAY_DATE_FORMAT,
  DISPLAY_TIME_FORMAT,
  TARGET_TYPES,
} from '../../const';
import { validateNotification } from '../../services';
import { ShortcutsDropdown } from '../shortcuts-dropdown';
import { SummaryFields } from '../summary-fields';
import LOCALIZATION from './localization';
import './style.scss';

class NotificationForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.TARGET_OPTIONS = [
      {
        value: TARGET_TYPES.APP,
        label: i18next.t(LOCALIZATION.TARGET_APP_LABEL),
      },
      {
        value: TARGET_TYPES.URL,
        label: i18next.t(LOCALIZATION.TARGET_URL_LABEL),
      },
      {
        value: TARGET_TYPES.SCREEN,
        label: i18next.t(LOCALIZATION.TARGET_SCREEN_LABEL),
      },
    ];
    this.AUDIENCE_OPTIONS = [
      {
        value: AUDIENCE_TYPES.ALL,
        label: i18next.t(LOCALIZATION.AUDIENCE_ALL_LABEL),
      },
      {
        value: AUDIENCE_TYPES.GROUP,
        label: i18next.t(LOCALIZATION.AUDIENCE_GROUP_LABEL),
      },
    ];
    this.DELIVERY_OPTIONS = [
      {
        value: DELIVERY_TYPES.NOW,
        label: i18next.t(LOCALIZATION.DELIVERY_NOW_LABEL),
      },
      {
        value: DELIVERY_TYPES.SCHEDULED,
        label: i18next.t(LOCALIZATION.DELIVERY_SCHEDULED_LABEL),
      },
    ];
    this.RECURRING_PERIOD_OPTIONS = [
      {
        value: RECURRING_PERIOD_TYPES.NONE,
        label: i18next.t(LOCALIZATION.RECURRING_PERIOD_NONE),
      },
      {
        value: RECURRING_PERIOD_TYPES.EVERY_DAY,
        label: i18next.t(LOCALIZATION.RECURRING_PERIOD_EVERY_DAY),
      },
      {
        value: RECURRING_PERIOD_TYPES.EVERY_7_DAYS,
        label: i18next.t(LOCALIZATION.RECURRING_PERIOD_EVERY_7_DAYS),
      },
      {
        value: RECURRING_PERIOD_TYPES.EVERY_30_DAYS,
        label: i18next.t(LOCALIZATION.RECURRING_PERIOD_EVERY_30_DAYS),
      },
    ];

    if (props.settings?.scheduledNotificationsEnabled) {
      this.DELIVERY_OPTIONS.push({
        value: DELIVERY_TYPES.USER_SCHEDULED,
        label: i18next.t(LOCALIZATION.DELIVERY_USER_SCHEDULED_LABEL),
      });
    }
  }

  componentDidMount() {
    const {
      fields: { delivery, summaries },
      isEdit,
    } = this.props;

    // Delivery remains saved if user navigates somehwhere else by
    // *not* using Cancel or Back buttons in InlineModal
    // We don't want to clear if it's in edit mode tho
    if (!isEdit && delivery.value === DELIVERY_TYPES.USER_SCHEDULED) {
      summaries.onChange(['']);
    }
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
      fields: { delivery, summaries, target },
      isEdit,
      touch,
    } = this.props;

    if (
      item.value === DELIVERY_TYPES.USER_SCHEDULED &&
      delivery.value !== DELIVERY_TYPES.USER_SCHEDULED
    ) {
      summaries.onChange(['']);

      if (isEdit) {
        touch('numberOfMessages');
      }
    }

    if (item.value !== DELIVERY_TYPES.USER_SCHEDULED) {
      summaries.onChange([]);
    }

    delivery.onChange(item.value);
  }

  handleRecurringPeriodSelect(item) {
    const {
      fields: { recurringPeriod },
    } = this.props;

    recurringPeriod.onChange(item.value);
  }

  handleSummariesChange() {
    const { touch } = this.props;
    touch('numberOfMessages');
  }

  render() {
    const {
      groups,
      shortcuts,
      submitting,
      invalid,
      recurringEnabled,
      fields,
      fields: {
        id,
        target,
        contentUrl,
        shortcutId,
        audience,
        audienceGroupIds,
        title,
        summary,
        numberOfMessages,
        delivery,
        deliveryTime,
        recurringPeriod,
      },
      onCancel,
      handleSubmit,
      error,
    } = this.props;

    const inEditMode = !!id.value;

    const audienceGroupsDisabled = audience.value === AUDIENCE_TYPES.ALL;
    const deliveryTimeDisabled = delivery.value === DELIVERY_TYPES.NOW;
    const showNotifcationActions =
      delivery.value !== DELIVERY_TYPES.USER_SCHEDULED;
    const numberOfMessagesDisabled =
      delivery.value !== DELIVERY_TYPES.USER_SCHEDULED;
    const showUrl = target.value === TARGET_TYPES.URL;
    const showShortcuts = target.value === TARGET_TYPES.SCREEN;
    const resolvedTimeFormat =
      delivery.value === DELIVERY_TYPES.USER_SCHEDULED
        ? false
        : DISPLAY_TIME_FORMAT;

    return (
      <form className="notification-form" onSubmit={handleSubmit}>
        <Row>
          <Col xs={5}>
            <FormGroup controlId="audience">
              <ControlLabel>
                {i18next.t(LOCALIZATION.AUDIENCE_LABEL)}
              </ControlLabel>
              <RadioSelector
                className="notification-form__radio-selector"
                groupName="audience"
                options={this.AUDIENCE_OPTIONS}
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
            <FormGroup
              className="recurring-switch-group"
              controlId="recurring-switch"
            >
              <ControlLabel>
                {i18next.t(LOCALIZATION.ENABLE_RECURRING_LABEL)}
              </ControlLabel>
              <Switch
                onChange={this.props.toogleRecurringFeature}
                value={recurringEnabled}
              />
            </FormGroup>
          </Col>
          <Col xs={7} className="notification-form__recurring-period-select">
            <FormGroup controlId="recurring-select">
              <ControlLabel>
                {i18next.t(LOCALIZATION.RECURRING_PERIOD_LABEL)}
              </ControlLabel>
              <Select
                className="notification-form__recurring-period-selector"
                clearable={false}
                disabled={!recurringEnabled}
                elementId="recurringPeriod"
                name="recurringPeriod"
                onChange={this.handleRecurringPeriodSelect}
                options={this.RECURRING_PERIOD_OPTIONS}
                value={recurringPeriod.value}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <FormGroup controlId="delivery">
              <ControlLabel>
                {i18next.t(LOCALIZATION.DELIVERY_LABEL)}
              </ControlLabel>
              <Select
                className="notification-form__delivery-selector"
                clearable={false}
                elementId="delivery"
                name="delivery"
                onChange={this.handleDeliverySelect}
                options={this.DELIVERY_OPTIONS}
                value={delivery.value}
              />
            </FormGroup>
          </Col>
          <Col xs={7}>
            <ReduxFormElement
              disabled={submitting || deliveryTimeDisabled}
              elementId="deliveryTime"
              field={deliveryTime}
            >
              <DateTimePicker
                clearable={false}
                utc={false}
                inputProps={{
                  placeholder: i18next.t(LOCALIZATION.DATE_PICKER_LABEL),
                  disabled: submitting || deliveryTimeDisabled,
                }}
                dateFormat={DISPLAY_DATE_FORMAT}
                timeFormat={resolvedTimeFormat}
              />
            </ReduxFormElement>
          </Col>
        </Row>
        {showNotifcationActions && (
          <Row>
            <Col xs={5}>
              <FormGroup controlId="target">
                <ControlLabel>
                  {i18next.t(LOCALIZATION.TARGET_LABEL)}
                </ControlLabel>
                <Select
                  clearable={false}
                  disabled={submitting}
                  elementId="target"
                  name="target"
                  onChange={this.handleTargetChanged}
                  options={this.TARGET_OPTIONS}
                  value={target.value}
                />
              </FormGroup>
            </Col>
            <Col xs={7}>
              {showUrl && (
                <ReduxFormElement
                  disabled={submitting}
                  elementId="contentUrl"
                  field={contentUrl}
                  name={i18next.t(LOCALIZATION.CONTENT_URL_INPUT_LABEL)}
                />
              )}
              {showShortcuts && (
                <ReduxFormElement
                  disabled={submitting}
                  elementId="shortcutId"
                  field={shortcutId}
                  name={i18next.t(LOCALIZATION.SCREEN_INPUT_LABEL)}
                >
                  <ShortcutsDropdown
                    shortcuts={shortcuts}
                    shortcut={shortcutId.value}
                  />
                </ReduxFormElement>
              )}
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12}>
            <ReduxFormElement
              elementId="title"
              name={i18next.t(LOCALIZATION.TITLE_INPUT_LABEL)}
              maxLength={255}
              disabled={submitting}
              field={title}
            />
          </Col>
        </Row>
        {delivery.value !== DELIVERY_TYPES.USER_SCHEDULED && (
          <Row>
            <Col xs={12}>
              <ReduxFormElement
                disabled={submitting}
                elementId="summary"
                name={i18next.t(LOCALIZATION.SUMMARY_INPUT_LABEL)}
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
        )}
        {delivery.value === DELIVERY_TYPES.USER_SCHEDULED && (
          <>
            <FormGroup>
              <SummaryFields
                fields={fields}
                name={i18next.t(LOCALIZATION.SUMMARY_INPUT_LABEL)}
                onSummariesChange={this.handleSummariesChange}
                submitting={submitting}
              />
            </FormGroup>
            <Row>
              <Col xs={12}>
                <ReduxFormElement
                  className="notification-form__daily-number"
                  disabled={submitting || numberOfMessagesDisabled}
                  elementId="numberOfMessages"
                  name={i18next.t(LOCALIZATION.NUMBER_OF_NOTIFICATIONS)}
                  field={numberOfMessages}
                >
                  <FormControl type="number" min={1} {...numberOfMessages} />
                </ReduxFormElement>
              </Col>
            </Row>
          </>
        )}
        <ButtonToolbar>
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={submitting || invalid}
            type="submit"
          >
            <LoaderContainer isLoading={submitting}>
              {inEditMode
                ? i18next.t(LOCALIZATION.BUTTON_SAVE)
                : i18next.t(LOCALIZATION.BUTTON_CREATE)}
            </LoaderContainer>
          </Button>
          <Button bsSize="large" disabled={submitting} onClick={onCancel}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
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
  isEdit: PropTypes.bool,
  settings: PropTypes.object,
  scheduledNotificationsEnabled: PropTypes.bool,
  recurringEnabled: PropTypes.bool,
  toogleRecurringFeature: PropTypes.func,
};

// iconUrl and imageUrl fields are necessary even we don't use it
// server is returning those fields and when updating notification
// we need to pass them back to the server
export default reduxForm({
  getFormState,
  form: 'notificationForm',
  fields: [
    'id',
    'target',
    'contentUrl',
    'shortcutId',
    'audience',
    'audienceGroupIds',
    'title',
    'summary',
    'summaries',
    'numberOfMessages',
    'delivery',
    'deliveryTime',
    'recurringPeriod',
    'iconUrl',
    'imageUrl',
  ],
  validate: validateNotification,
})(NotificationForm);
