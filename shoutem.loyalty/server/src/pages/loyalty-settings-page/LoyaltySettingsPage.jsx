import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoyaltyDisabledPlaceholder } from 'src/components';
import { CashierSettings } from 'src/modules/cashiers';
import { CmsSelect } from 'src/modules/cms';
import {
  enableLoyalty,
  getLoyaltyPlaces,
  loadLoyaltyPlaces,
  PROGRAMS,
  ProgramSettings,
} from 'src/modules/program';
import { RulesSettings } from 'src/modules/rules';
import { getProgramId, initializeApiEndpoints } from 'src/services';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { shouldLoad } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

const PLACES_DESCRIPTOR = {
  filterKeyProp: 'id',
  filterLabelProp: 'name',
};

class LoyaltySettingsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const {
      ownExtension: { settings },
    } = props;
    initializeApiEndpoints(settings);

    const { rules, requireReceiptCode, enableBarcodeScan } = settings;
    const programId = getProgramId(settings);

    this.state = {
      programId,
      rules,
      requireReceiptCode,
      enableBarcodeScan,
      currentPlaceId: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { appId } = this.props;

    if (shouldLoad(nextProps, props, 'places')) {
      this.props.loadPlaces(appId);
    }
  }

  handleUpdateExtension(settingsPatch) {
    const { ownExtension } = this.props;
    return this.props.updateExtensionSettings(ownExtension, settingsPatch);
  }

  handlePlaceChange(placeId) {
    this.setState({ currentPlaceId: placeId });
  }

  handleEnableLoyalty() {
    const { rules } = this.state;

    return this.props
      .enableLoyalty(rules)
      .then(programId => {
        const program = {
          type: PROGRAMS,
          id: programId,
        };

        return Promise.all([
          programId,
          this.handleUpdateExtension({ program }),
        ]);
      })
      .then(([programId]) => this.setState({ programId }));
  }

  renderLoyaltySettings() {
    const {
      programId,
      requireReceiptCode,
      enableBarcodeScan,
      currentPlaceId,
      rules,
    } = this.state;
    const { appId, places, ownExtensionName } = this.props;

    const showPlaceSelect = !_.isEmpty(places);

    // Program settings are applied on global level.
    // When place is chosen, only settings that can be applied to specific place can be shown.
    const showProgramSettings = !currentPlaceId;

    return (
      <div>
        {showPlaceSelect && (
          <CmsSelect
            allItemsLabel={i18next.t(LOCALIZATION.FORM_ALL_STORES_TITLE)}
            descriptor={PLACES_DESCRIPTOR}
            dropdownLabel={i18next.t(LOCALIZATION.FORM_SELECT_STORE_TITLE)}
            onFilterChange={this.handlePlaceChange}
            resources={places}
          />
        )}
        {showProgramSettings && (
          <ProgramSettings
            enableBarcodeScan={enableBarcodeScan}
            extensionName={ownExtensionName}
            onUpdateExtension={this.handleUpdateExtension}
            programId={programId}
            requireReceiptCode={requireReceiptCode}
          />
        )}
        <RulesSettings
          currentPlaceId={currentPlaceId}
          extensionName={ownExtensionName}
          onUpdateExtension={this.handleUpdateExtension}
          programId={programId}
          requireReceiptCode={requireReceiptCode}
          ruleTemplates={rules}
        />
        <CashierSettings
          appId={appId}
          currentPlaceId={currentPlaceId}
          extensionName={ownExtensionName}
          places={places}
          placesDescriptor={PLACES_DESCRIPTOR}
          programId={programId}
        />
      </div>
    );
  }

  render() {
    const { programId } = this.state;

    return (
      <div className="loyalty-settings-page settings-page">
        {!programId && (
          <LoyaltyDisabledPlaceholder
            onEnableLoyaltyClick={this.handleEnableLoyalty}
          />
        )}
        {programId && this.renderLoyaltySettings()}
      </div>
    );
  }
}

LoyaltySettingsPage.propTypes = {
  appId: PropTypes.string,
  appOwnerId: PropTypes.string,
  ownExtension: PropTypes.object,
  updateExtensionSettings: PropTypes.func,
  enableLoyalty: PropTypes.func,
  createAuthorization: PropTypes.func,
  places: PropTypes.array,
  loadPlaces: PropTypes.func,
  ownExtensionName: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    places: getLoyaltyPlaces(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appOwnerId, ownExtensionName } = ownProps;

  const context = { appOwnerId };
  const scope = { extensionName: ownExtensionName };

  return {
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
    enableLoyalty: (rules, authorizationTypes) =>
      dispatch(enableLoyalty(rules, authorizationTypes, context, scope)),
    loadPlaces: (appId, categoryId) =>
      dispatch(loadLoyaltyPlaces(appId, categoryId, scope)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoyaltySettingsPage);
