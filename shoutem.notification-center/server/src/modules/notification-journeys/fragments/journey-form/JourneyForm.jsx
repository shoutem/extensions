import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { IconLabel, LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchShortcuts,
  getExtension,
  getShortcuts,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import ext from '../../../../const';
import { NotificationInput } from '../../components';
import { DEFAULT_JOURNEY_NOTIFICATION } from '../../const';
import { getAvailableTriggers } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

function resolveHasChanges(value, initialValue) {
  return value !== initialValue && !_.isEmpty(value);
}

export default function JourneyForm({ initialValues, onSubmit, isEdit }) {
  const dispatch = useDispatch();
  const extension = useSelector(state => getExtension(state, ext()));
  const shortcuts = useSelector(getShortcuts);
  const availableTriggers = useSelector(state =>
    getAvailableTriggers(state, initialValues.trigger?.value),
  );

  const [title, setTitle] = useState(initialValues.title);
  const [trigger, setTrigger] = useState(initialValues.trigger);
  const [notifications, setNotifications] = useState(
    initialValues.notifications,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mandatoryFieldsFilled = useMemo(
    () =>
      !!title &&
      !!trigger.value &&
      _.every(
        notifications,
        notification => !!notification.title && !!notification.body,
      ),
    [title, trigger, notifications],
  );

  const saveEnabled = useMemo(
    () => hasChanges && !isLoading && mandatoryFieldsFilled,
    [hasChanges, isLoading, mandatoryFieldsFilled],
  );

  const triggerOptions = useMemo(
    () =>
      availableTriggers.map(trigger => ({
        value: trigger.id,
        label: trigger.attributes.name,
      })),
    [availableTriggers],
  );

  useEffect(() => {
    dispatch(fetchShortcuts()).then(() => setIsLoading(false));
  }, [dispatch]);

  function handleTitleChange({ target: { value } }) {
    setHasChanges(resolveHasChanges(value, title));
    return setTitle(value);
  }

  function handleTriggerChange(value) {
    setHasChanges(resolveHasChanges(value, trigger));
    return setTrigger(value);
  }

  function handleNotificationChange(updates, index) {
    const updatedNotifications = [...notifications];
    updatedNotifications[index] = { ...notifications[index], ...updates };

    setHasChanges(resolveHasChanges(updatedNotifications, notifications));
    setNotifications(updatedNotifications);
  }

  function handleAddNotification() {
    setNotifications(prevNotifications => [...prevNotifications, {}]);
  }

  function handleNotificationDelete(index) {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);

    setHasChanges(resolveHasChanges(updatedNotifications, notifications));
    setNotifications(updatedNotifications);
  }

  function handleSavePress() {
    setIsLoading(true);

    const journeys = _.get(extension, 'settings.journeys', []);

    if (initialValues.key && !!_.find(journeys, ['key', initialValues.key])) {
      const journeyIndex = _.findIndex(journeys, ['key', initialValues.key]);
      // TODO: Add setter for journeys as non active
      journeys[journeyIndex] = {
        ...journeys[journeyIndex],
        title,
        trigger,
        notifications,
        active: true,
      };
    } else {
      journeys.push({
        title,
        id: trigger.value,
        key: `${title}-${Date.now()}`,
        trigger,
        notifications,
        active: true,
      });
    }

    return dispatch(
      updateExtensionSettings(extension, {
        ...extension.settings,
        journeys,
      }),
    )
      .then(onSubmit)
      .finally(() => setIsLoading(false));
  }

  // TODO: Only one active journey per trigger
  return (
    <LoaderContainer isLoading={isLoading} className="journey-form__container">
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.JOURNEY_TITLE)}</ControlLabel>
        <FormControl
          className="form-control"
          type="text"
          onChange={handleTitleChange}
          value={title}
        />
      </FormGroup>
      <FormGroup controlId="trigger">
        <ControlLabel>{i18next.t(LOCALIZATION.TRIGGER_LABEL)}</ControlLabel>
        <Select
          clearable={false}
          elementId="trigger"
          name="trigger"
          onChange={handleTriggerChange}
          noResultsText={i18next.t(LOCALIZATION.NO_AVAILABLE_TRIGGERS)}
          options={triggerOptions}
          value={trigger?.value}
        />
      </FormGroup>
      <div className="journey-form__add-new-notification">
        <Button className="btn-icon pull-right" onClick={handleAddNotification}>
          <IconLabel iconName="add">
            {i18next.t(LOCALIZATION.ADD_NEW_NOTIFICATION)}
          </IconLabel>
        </Button>
      </div>
      {_.map(notifications, (notification, index) => (
        <NotificationInput
          shortcuts={shortcuts}
          shortcutId={notification?.shortcutId}
          delay={notification?.delay}
          key={index}
          index={index}
          body={notification?.body}
          title={notification?.title}
          target={notification?.target}
          contentUrl={notification?.contentUrl}
          onValueChange={handleNotificationChange}
          onDelete={handleNotificationDelete}
        />
      ))}
      <ButtonToolbar>
        <Button
          bsStyle="primary"
          disabled={!saveEnabled}
          onClick={handleSavePress}
        >
          <LoaderContainer isLoading={isLoading}>
            {i18next.t(LOCALIZATION.SAVE_BUTTON)}
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
      {isEdit && (
        <HelpBlock className="journey-form__warning-text">
          {i18next.t(LOCALIZATION.UPDATE_WARNING)}
        </HelpBlock>
      )}
    </LoaderContainer>
  );
}

JourneyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    notifications: PropTypes.array,
    title: PropTypes.string,
    trigger: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  }),
  isEdit: PropTypes.bool,
};

JourneyForm.defaultProps = {
  initialValues: {
    notifications: [DEFAULT_JOURNEY_NOTIFICATION],
    title: '',
    trigger: {
      label: '',
      value: '',
    },
  },
  isEdit: false,
};
