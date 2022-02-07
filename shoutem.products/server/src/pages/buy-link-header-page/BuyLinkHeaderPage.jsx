import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { Checkbox, LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

class BuyLinkHeaderPage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  handleToggle() {
    const {
      shortcut,
      shortcut: {
        settings: { addAuthHeaderToBuyLink },
      },
      updateShortcutSettings,
    } = this.props;

    this.setState({ inProgress: true });
    updateShortcutSettings(shortcut, { addAuthHeaderToBuyLink: !addAuthHeaderToBuyLink })
      .catch(error =>
        // eslint-disable-next-line no-console
        console.error('Failed to update addAuthHeaderToBuyLink setting:', error),
      )
      .finally(() => this.setState({ inProgress: false }));
  }

  render() {
    const {
      shortcut: {
        settings: { addAuthHeaderToBuyLink },
      },
    } = this.props;
    const { inProgress } = this.state;

    return (
      <div className="settings-page">
        <p>{i18next.t(LOCALIZATION.ACCESS_TOKEN_HEADER_EXPLANATION)}</p>
        <LoaderContainer isLoading={inProgress}>
          <Checkbox checked={addAuthHeaderToBuyLink} onChange={this.handleToggle}>
            {i18next.t(LOCALIZATION.ADD_BUY_LINK_HEADER_LABEL)}
          </Checkbox>
        </LoaderContainer>
      </div>
    );
  }
}

BuyLinkHeaderPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
  updateShortcutSettings: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(null, mapDispatchToProps)(BuyLinkHeaderPage);
