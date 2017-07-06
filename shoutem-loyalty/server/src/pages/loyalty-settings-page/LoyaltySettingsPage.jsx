import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import api, {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/api';
import { isInitialized, shouldLoad } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import LoyaltyDisabledPlaceholder from '../../components/loyalty-disabled-placeholder';
import { CashierSettings } from '../../modules/cashiers';
import { RulesSettings } from '../../modules/rules';
import { enableLoyalty } from '../../redux';
import { initLoyaltyApi } from '../../services';
import ext from '../../const';
import './style.scss';

class LoyaltySettingsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.resolveStateFromSettings = this.resolveStateFromSettings.bind(this);
    this.handleUpdateExtension = this.handleUpdateExtension.bind(this);
    this.handleEnableLoyalty = this.handleEnableLoyalty.bind(this);

    props.fetchExtension();

    this.state = {
      loyaltyApiInitialized: false,
      appId: api.config.appId,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { extension } = props;
    const { extension: nextExtension } = nextProps;

    if (shouldLoad(nextProps, props, 'extension')) {
      this.props.fetchExtension();
    }

    const nextSettings = _.get(nextExtension, 'settings', {});
    const settings = _.get(extension, 'settings', {});

    this.resolveStateFromSettings(nextSettings, settings);
  }

  resolveStateFromSettings(nextSettings, settings) {
    const { loyaltyApiInitialized } = this.state;
    const { programId, rules, requireReceiptCode } = settings;
    const {
      programId: nextProgramId,
      rules: nextRules,
      requireReceiptCode: nextRequireReceipt,
      apiEndpoint: nextApiEndpoint,
    } = nextSettings;

    if (!programId && nextProgramId) {
      this.setState({ programId: nextProgramId });
    }

    if (!_.isEmpty(nextRules) && rules !== nextRules) {
      this.setState({ rules: nextRules });
    }

    if (requireReceiptCode !== nextRequireReceipt) {
      this.setState({ requireReceiptCode: nextRequireReceipt });
    }

    if (!loyaltyApiInitialized && nextApiEndpoint) {
      initLoyaltyApi(nextApiEndpoint);
      this.setState({ loyaltyApiInitialized: true });
    }
  }

  handleUpdateExtension(settings) {
    const {
      extension,
    } = this.props;
    return this.props.updateExtensionSettings(extension, settings);
  }

  handleEnableLoyalty() {
    const { rules } = this.state;

    return this.props.enableLoyalty(rules)
      .then(programId => (
        this.handleUpdateExtension({ programId })
          .then(() => this.setState({ programId }))
      ));
  }

  render() {
    const { appId, programId, requireReceiptCode } = this.state;
    const { extension } = this.props;

    return (
      <LoaderContainer
        isLoading={!isInitialized(extension)}
        className="loyalty-settings-page"
      >
        {!programId &&
          <LoyaltyDisabledPlaceholder
            onEnableLoyaltyClick={this.handleEnableLoyalty}
          />
        }
        {programId &&
          <div>
            <RulesSettings
              programId={programId}
              requireReceiptCode={requireReceiptCode}
              onUpdateRequiredReceipt={this.handleUpdateExtension}
            />
            <CashierSettings
              appId={appId}
              programId={programId}
            />
          </div>
        }
      </LoaderContainer>
    );
  }
}

LoyaltySettingsPage.propTypes = {
  extension: PropTypes.object,
  fetchExtension: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  enableLoyalty: PropTypes.func,
  createAuthorization: PropTypes.func,
};

function mapStateToProps(state) {
  const extension = getExtension(state, ext());

  return {
    extension,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchExtension: () => dispatch(fetchExtension(ext())),
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
    enableLoyalty: (rules) => dispatch(enableLoyalty(rules)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoyaltySettingsPage);
