import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { shouldRefresh, isValid } from '@shoutem/redux-io';
import { denormalizeItem } from 'denormalizer';
import {
  LoaderContainer,
  EmptyResourcePlaceholder,
} from '@shoutem/react-web-ui';
import { ControlLabel } from 'react-bootstrap';
import { ext } from 'context';
import { getShortcut, getExtensionInstallation } from 'environment';
import { trackEvent } from '../../providers/analytics';
import { translateExt18n } from '../../services';
import layoutImage from './../assets/layout.png';
import { updateShortcut, loadHierarchy, HIERARCHY } from './../reducer';
import ScreenGroup from './ScreenGroup';
import LOCALIZATION from './localization';
import './style.scss';

export class LayoutPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleScreenSelected = this.handleScreenSelected.bind(this);
    this.renderScreenHierarchy = this.renderScreenHierarchy.bind(this);
    this.getDefaultScreenSettings = this.getDefaultScreenSettings.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.checkData(newProps);
  }

  getScreenMappings(shortcut) {
    const screens = _.get(shortcut, 'screens', []);
    return _.zipObject(
      _.map(screens, 'canonicalType'),
      _.map(screens, screen =>
        _.pick(screen, ['canonicalName', 'canonicalType']),
      ),
    );
  }

  getDefaultScreenSettings(canonicalType, canonicalName) {
    const { hierarchy } = this.props;

    const originalScreens = _.get(hierarchy, 'originalScreens');
    const originScreen = _.find(originalScreens, { canonicalType });

    // If it's base screen layout - return it's settings.
    // Otherwise, look for it in alternativeScreens and then return settings.
    if (originScreen?.canonicalName === canonicalName) {
      return originScreen?.settings || {};
    }

    const alternativeScreens = originScreen?.alternativeScreens || [];
    const resultScreen = _.find(alternativeScreens, { canonicalName });

    return resultScreen?.settings || {};
  }

  checkData(props) {
    const { hierarchy, shortcut, loadHierarchy } = props;

    if (shouldRefresh(hierarchy)) {
      loadHierarchy(shortcut.id);
    }
  }

  handleScreenSelected(event) {
    const { shortcut } = this.props;
    const {
      canonicalName: selectedCanonicalName,
      canonicalType: selectedCanonicalType,
    } = event;

    const screens = _.get(shortcut, 'screens', []);
    const newScreens = _.map(screens, screen => {
      const { canonicalType, canonicalName } = screen;

      if (canonicalType === selectedCanonicalType) {
        const data = {
          canonicalType: selectedCanonicalType,
          canonicalName: selectedCanonicalName,
        }
        
        // finding default settings for the screen so we can override previous settings saved in DB
        const settings = this.getDefaultScreenSettings(selectedCanonicalType, selectedCanonicalName);
        if (settings) {
          data.settings = settings;
        }

        return data;
      }

      return {
        canonicalType,
        canonicalName,
      };
    });

    trackEvent('screens', 'layout-chosen', _.get(shortcut, 'screen'));

    this.props.updateShortcut({
      id: shortcut.id,
      attributes: {
        screens: newScreens,
      },
    });
  }

  resolveShortcutTitle(shortcut) {
    const defaultShortcutTitle = _.get(
      shortcut,
      'settings.defaultShortcutTitle',
      false,
    );
    return defaultShortcutTitle;
  }

  resolveExtensionTitle(shortcut) {
    const extensionTitle = _.get(shortcut, 'settings.extensionTitle', false);
    return extensionTitle;
  }

  resolveExtensionInfo(shortcut) {
    const { extensionName } = this.props;
    const defaultShortcutTitle = this.resolveShortcutTitle(shortcut);
    const extensionTitle = this.resolveExtensionTitle(shortcut);

    if (!defaultShortcutTitle && !extensionTitle) {
      return false;
    }

    if (!defaultShortcutTitle && extensionTitle) {
      return i18next.t(LOCALIZATION.EXTENSION_TITLE, {
        extensionTitle: translateExt18n(extensionName, extensionTitle),
      });
    }

    if (defaultShortcutTitle && !extensionTitle) {
      return i18next.t(LOCALIZATION.EXTENSION_UNDEFINED_TITLE, {
        defaultShortcutTitle,
      });
    }

    return i18next.t(LOCALIZATION.EXTENSION_DEFAULT_TITLE, {
      defaultShortcutTitle,
      extensionTitle: translateExt18n(extensionName, extensionTitle),
    });
  }

  renderScreenHierarchy(hierarchy) {
    const screens = _.get(hierarchy, 'originalScreens', []);

    if (screens.length === 0) {
      return (
        <EmptyResourcePlaceholder
          className="layout-page__empty-placeholder"
          imageSrc={layoutImage}
          title={i18next.t(LOCALIZATION.EMPTY_LAYOUTS_PLACEHOLDER_TITLE)}
        >
          <span>
            {i18next.t(LOCALIZATION.EMPTY_LAYOUTS_PLACEHOLDER_MESSAGE)}
          </span>
        </EmptyResourcePlaceholder>
      );
    }

    const { shortcut, extensionName } = this.props;
    const screenMapping = this.getScreenMappings(shortcut);

    return (
      <div className="screen_group__container">
        {screens.map(screen => (
          <ScreenGroup
            key={screen.id}
            extensionName={extensionName}
            originalScreen={screen}
            activeScreenDescriptor={screenMapping[screen.canonicalName]}
            onScreenSelected={this.handleScreenSelected}
            shortcutId={shortcut.id}
          />
        ))}
      </div>
    );
  }

  render() {
    const { hierarchy, shortcut } = this.props;

    const isHierarchyValid = hierarchy && isValid(hierarchy);
    const extensionInfo = this.resolveExtensionInfo(shortcut);

    return (
      <div className="layout-page">
        <LoaderContainer isLoading={!isHierarchyValid} size="50px">
          {extensionInfo && <ControlLabel>{extensionInfo}</ControlLabel>}
          {this.renderScreenHierarchy(hierarchy)}
        </LoaderContainer>
      </div>
    );
  }
}

LayoutPage.propTypes = {
  extensionName: PropTypes.string,
  shortcut: PropTypes.object,
  hierarchy: PropTypes.object,
  updateShortcut: PropTypes.func,
  loadHierarchy: PropTypes.func,
};

function mapStateToProps(state) {
  const extensionInstallation = getExtensionInstallation();
  const extensionName = _.get(extensionInstallation, 'canonicalName');

  return {
    extensionName,
    shortcut: getShortcut(),
    hierarchy: denormalizeItem(
      state[ext()].layoutPage.hierarchy,
      undefined,
      HIERARCHY,
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcut: shortcut => dispatch(updateShortcut(shortcut)),
    loadHierarchy: shortcutId => dispatch(loadHierarchy(shortcutId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage);
