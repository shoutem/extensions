import React from 'react';
import { ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import './style.scss';

export default function SettingField({
  fieldKey,
  title,
  textValue,
  onChange,
  errorText,
  popoverMessage,
}) {
  function handleChange(event) {
    onChange(event, fieldKey);
  }

  return (
    <div>
      <ControlLabel>{title}</ControlLabel>
      {!!popoverMessage && (
        <FontIconPopover message={popoverMessage}>
          <FontIcon className="icon-popover" name="info" size="24px" />
        </FontIconPopover>
      )}
      <FormControl
        className="form-control"
        onChange={handleChange}
        type="text"
        value={textValue}
      />
      {errorText && <HelpBlock className="text-error">{errorText}</HelpBlock>}
    </div>
  );
}

SettingField.propTypes = {
  fieldKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  popoverMessage: PropTypes.string,
  textValue: PropTypes.string,
};

SettingField.defaultProps = {
  errorText: null,
  popoverMessage: null,
  textValue: '',
};
