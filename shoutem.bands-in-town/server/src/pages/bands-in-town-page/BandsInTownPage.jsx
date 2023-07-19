/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  FontIcon,
  FontIconPopover,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { MessageWithLink } from '../../components';
import LOCALIZATION from './localization';
import './style.scss';

const WIDGET_SETUP_LINK =
  'https://www.artists.bandsintown.com/support/widget-installation';

function BandsInTownPage({ shortcut, updateShortcutSettings }) {
  const [inProgress, setInProgress] = useState(false);
  const [widget, setWidget] = useState(shortcut.settings.widget);

  function handleTextChange(event) {
    setWidget(event.target.value);
  }

  function handleSave() {
    setInProgress(true);

    updateShortcutSettings(shortcut, { widget }).then(() =>
      setInProgress(false),
    );
  }

  const hasChanges = shortcut.settings.widget !== widget;

  return (
    <div className="settings-page">
      <form>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.WIDGET_INPUT_LABEL)}
          </ControlLabel>
          <FontIconPopover
            delayHide={2000}
            hideOnMouseLeave={false}
            message={
              <MessageWithLink
                link={WIDGET_SETUP_LINK}
                linkText={i18next.t(LOCALIZATION.WIDGET_INFO_LINK)}
                message={i18next.t(LOCALIZATION.WIDGET_INFO)}
              />
            }
          >
            <FontIcon className="icon-popover" name="info" size="24px" />
          </FontIconPopover>
          <FormControl
            type="textarea"
            className="form-control"
            value={widget}
            onChange={handleTextChange}
          />
        </FormGroup>
      </form>
      <ButtonToolbar className="save-button">
        <Button bsStyle="primary" disabled={!hasChanges} onClick={handleSave}>
          <LoaderContainer isLoading={inProgress}>
            {i18next.t(LOCALIZATION.SAVE_BUTTON)}
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
    </div>
  );
}

BandsInTownPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
  updateShortcutSettings: PropTypes.func.isRequired,
};

export default connect(null, { updateShortcutSettings })(BandsInTownPage);
