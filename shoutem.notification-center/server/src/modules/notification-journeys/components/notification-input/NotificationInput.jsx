import React, { useMemo } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row,
} from 'react-bootstrap';
import Select from 'react-select';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import { ShortcutsDropdown } from '../../../notifications/components/shortcuts-dropdown';
import { DEFAULT_JOURNEY_NOTIFICATION } from '../../const';
import { getNotificationAction } from '../../services';
import { getDelayOptions, getTargetOptions } from './const';
import LOCALIZATION from './localization';
import './style.scss';

export default function NotificationInput({
  shortcuts,
  delay,
  index,
  body,
  title,
  target,
  contentUrl,
  shortcutId,
  onValueChange,
  onDelete,
}) {
  const TARGET_OPTIONS = useMemo(() => getTargetOptions(), []);
  const DELAY_OPTIONS = useMemo(() => getDelayOptions(), []);

  const showShortcuts = useMemo(
    () => target.value === TARGET_OPTIONS[1].value,
    [target.value, TARGET_OPTIONS],
  );

  const delayValue = useMemo(() => delay || DELAY_OPTIONS[0].value, [
    delay,
    DELAY_OPTIONS,
  ]);

  const showDelete = useMemo(() => index !== 0, [index]);

  function handleDelayChange(delayValue) {
    return onValueChange({ delay: delayValue.value }, index);
  }

  function handleBodyChange({ target: { value } }) {
    return onValueChange({ body: value }, index);
  }

  function handleTitleChange({ target: { value } }) {
    return onValueChange({ title: value }, index);
  }

  function handleTargetChange(value) {
    if (value === TARGET_OPTIONS[0] && !!contentUrl) {
      const action = getNotificationAction({
        target: TARGET_OPTIONS[0].value,
        contentUrl,
        title,
      });

      return onValueChange({ target: value, action }, index);
    }

    if (value === TARGET_OPTIONS[1] && !!shortcutId) {
      const action = getNotificationAction({
        target: TARGET_OPTIONS[1].value,
        shortcutId,
      });

      return onValueChange({ target: value, action }, index);
    }

    return onValueChange({ target: value, action: '' }, index);
  }

  function handleUrlChange({ target: { value } }) {
    const action = getNotificationAction({
      target: TARGET_OPTIONS[0].value,
      contentUrl: value,
      title,
    });

    return onValueChange(
      { target: TARGET_OPTIONS[0], contentUrl: value, action },
      index,
    );
  }

  function handleShortcutChange(shortcut) {
    const action = getNotificationAction({
      target: TARGET_OPTIONS[1].value,
      shortcutId: shortcut,
    });

    return onValueChange(
      { target: TARGET_OPTIONS[1], shortcutId: shortcut, action },
      index,
    );
  }

  function handleDeletePress(event) {
    event.stopPropagation();
    onDelete(index);
  }

  return (
    <>
      <h4 className="notification-input__title">
        {i18next.t(LOCALIZATION.NOTIFICATION_INPUT_TITLE, { index: index + 1 })}
      </h4>
      {showDelete && (
        <div className="notification-input__delete">
          <Button className="btn-icon pull-right" onClick={handleDeletePress}>
            <FontIcon name="delete" size="24px" />
          </Button>
        </div>
      )}
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.NOTIFICATION_INPUT_DELAY_LABEL)}
        </ControlLabel>
        <Select
          clearable={false}
          name="delay"
          onChange={handleDelayChange}
          options={DELAY_OPTIONS}
          value={delayValue}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.NOTIFICATION_INPUT_TITLE_LABEL)}
        </ControlLabel>
        <FormControl
          className="form-control"
          type="text"
          onChange={handleTitleChange}
          value={title}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.NOTIFICATION_INPUT_BODY_LABEL)}
        </ControlLabel>
        <FormControl
          className="form-control"
          type="text"
          onChange={handleBodyChange}
          value={body}
        />
      </FormGroup>
      <Row>
        <Col xs={5}>
          <FormGroup controlId="target">
            <ControlLabel>
              {i18next.t(LOCALIZATION.NOTIFICATION_INPUT_TARGET_LABEL)}
            </ControlLabel>
            <Select
              clearable={false}
              elementId="target"
              name="target"
              onChange={handleTargetChange}
              options={TARGET_OPTIONS}
              value={target?.value}
            />
          </FormGroup>
        </Col>
        <Col xs={7}>
          <FormGroup>
            {!showShortcuts && (
              <>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.NOTIFICATION_INPUT_CONTENT_URL_LABEL)}
                </ControlLabel>
                <FormControl
                  className="form-control"
                  type="text"
                  onChange={handleUrlChange}
                  value={contentUrl}
                />
              </>
            )}
            {showShortcuts && (
              <>
                <ControlLabel>
                  {i18next.t(
                    LOCALIZATION.NOTIFICATION_INPUT_CONTENT_SHORTCUT_LABEL,
                  )}
                </ControlLabel>
                <ShortcutsDropdown
                  shortcuts={shortcuts}
                  shortcut={shortcutId}
                  onChange={handleShortcutChange}
                />
              </>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}

NotificationInput.propTypes = {
  index: PropTypes.number.isRequired,
  shortcuts: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  body: PropTypes.string,
  contentUrl: PropTypes.string,
  delay: PropTypes.number,
  shortcutId: PropTypes.string,
  target: PropTypes.object,
  title: PropTypes.string,
};

NotificationInput.defaultProps = {
  ...DEFAULT_JOURNEY_NOTIFICATION,
};
