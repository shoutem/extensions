import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

class DownloadPage extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      enableDownload: props.shortcut.settings?.enableDownload,
    };
  }

  handleToggle(event) {
    if (!event.target) {
      return;
    }

    const { shortcut, updateShortcutSettings } = this.props;

    const enableDownload = event.target.checked;

    this.setState({ enableDownload });
    updateShortcutSettings(shortcut, { enableDownload });
  }

  render() {
    const { enableDownload } = this.state;

    return (
      <div className="settings-page">
        <Checkbox checked={enableDownload} onChange={this.handleToggle}>
          {i18next.t(LOCALIZATION.ENABLE_DOWNLOAD_CHECKBOX_LABEL)}
        </Checkbox>
        <p>{i18next.t(LOCALIZATION.DOWNLOAD_EXPLANATION)}</p>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(null, mapDispatchToProps)(DownloadPage);
