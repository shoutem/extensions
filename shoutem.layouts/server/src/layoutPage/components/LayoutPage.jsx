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

    // When switching screens, we just need to change canonicalName.
    // Other settings (user's and default) will be handled on server side.
    // We also need to send the complete screen array to server, modifying only
    // canonicalName for screen of corresponding canonicalType.
    const screens = _.get(shortcut, 'screens', []);
    const newScreens = _.map(screens, screen => {
      const { canonicalType, canonicalName } = screen;

      if (canonicalType === selectedCanonicalType) {
        return {
          canonicalType: selectedCanonicalType,
          canonicalName: selectedCanonicalName,
        };
      }

      return {
        canonicalType,
        canonicalName,
      };
    });

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
