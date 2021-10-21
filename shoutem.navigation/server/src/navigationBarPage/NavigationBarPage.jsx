import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getExtensionInstallation } from 'environment';
import { updateExtensionSettings } from '../builder-sdk';
import { trackEvent } from '../providers/analytics';
import NavigationBarFirstScreenImageToggle from './components/NavigationBarFirstScreenImageToggle';
import NavigationBarBackgroundImages from './components/NavigationBarBackgroundImages';
import NavigationBarTitleToggle from './components/NavigationBarTitleToggle';
import NavigationBarBackgroundSize from './components/NavigationBarBackgroundSize';
import './style.scss';

const BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN =
  'backgroundImageEnabledFirstScreen';
const SHOW_TITLE = 'showTitle';
const FIT_CONTAINER = 'fitContainer';

export class NavigationBarPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  /**
   * Handle background image upload or delete
   * @param {void} backgroundImage
   */
  handleBackgroundImageChange(
    backgroundImagePropertyName,
    backgroundImage = null,
  ) {
    trackEvent('screens', 'main-navigation-background-image-added');

    this.updateExtensionSettings({
      [backgroundImagePropertyName]: backgroundImage,
    });
  }

  /**
   * Handle background image toggle
   * @param  {Number} selectedValue Option value corresponding *_OPTION constants
   * @return {void}
   */
  handleBackgroundImageToggle(backgroundImageEnabledFirstScreen) {
    trackEvent(
      'screens',
      'main-navigation-navigation-bar-settings-changed',
      'background-settings',
    );

    this.updateExtensionSettings({
      [BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN]: backgroundImageEnabledFirstScreen,
    });
  }

  /**
   * Handle background size toggle. It can either keep original size and fit to height
   * or it can fit image to dimensions of a container.
   * @param {void} fitContainer
   */
  handleBackgroundSizeToggle(fitContainer) {
    trackEvent(
      'screens',
      'main-navigation-navigation-bar-settings-changed',
      'background-size',
    );

    this.updateExtensionSettings({
      [FIT_CONTAINER]: fitContainer,
    });
  }

  /**
   * Handle title toggle
   * @param  {event} evt Event object sent from radio button input control
   * @return {void}
   */
  handleTitleToggle(showTitle) {
    trackEvent(
      'screens',
      'main-navigation-navigation-bar-settings-changed',
      'navigation-title',
    );

    this.updateExtensionSettings({
      [SHOW_TITLE]: showTitle,
    });
  }

  /**
   * Update extension settings with lates changes.
   * Only diff values are required here.
   * @param {void} settings
   */
  updateExtensionSettings(settings) {
    const { updateSettings, extensionInstallation } = this.props;
    return updateSettings(extensionInstallation, settings);
  }

  render() {
    const {
      extensionInstallation: { settings },
    } = this.props;

    const {
      backgroundImage: withoutNotchNavbarBackgroundImage,
      withNotchBackgroundImage,
      backgroundImageEnabledFirstScreen,
      showTitle,
      fitContainer,
    } = settings;

    return (
      <div className="navigation-bar-page">
        <form>
          <NavigationBarBackgroundImages
            withoutNotchBackgroundImage={withoutNotchNavbarBackgroundImage}
            withNotchBackgroundImage={withNotchBackgroundImage}
            onBackgroundImageChange={this.handleBackgroundImageChange}
          />
          <NavigationBarFirstScreenImageToggle
            backgroundImageEnabledFirstScreen={
              backgroundImageEnabledFirstScreen
            }
            onBackgroundImageToggle={this.handleBackgroundImageToggle}
          />
          <NavigationBarBackgroundSize
            fitContainer={fitContainer}
            onBackgroundSizeToggle={this.handleBackgroundSizeToggle}
          />
          <NavigationBarTitleToggle
            showTitle={showTitle}
            onTitleToggle={this.handleTitleToggle}
          />
        </form>
      </div>
    );
  }
}

/**
 * NavigationBarSettings export
 */

NavigationBarPage.propTypes = {
  extensionInstallation: PropTypes.object,
  updateSettings: PropTypes.func,
};

function mapStateToProps() {
  const extensionInstallation = getExtensionInstallation();

  return {
    extensionInstallation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extensionInstallation, settings) =>
      dispatch(updateExtensionSettings(extensionInstallation, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBarPage);
