import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import _ from 'lodash';
import { ToggleSwitch } from 'src/components';
import { navigateToUrl } from 'src/redux';
import { BarcodeRegexForm } from '../../components';
import {
  loadAuthorizations,
  createAuthorization,
  updateAuthorization,
  getAuthorizationByType,
} from '../../redux';

const BARCODE_AUTH_TYPE = 'regex';

export class ProgramSettings extends Component {
  constructor(props) {
    super(props);

    this.handleRequireReceiptToggle = this.handleRequireReceiptToggle.bind(this);
    this.handleEnableBarcodeScanToggle = this.handleEnableBarcodeScanToggle.bind(this);
    this.handleBarcodeFormSubmit = this.handleBarcodeFormSubmit.bind(this);

    const {
      requireReceiptCode,
      enableBarcodeScan,
    } = props;

    this.state = {
      requireReceiptCode,
      enableBarcodeScan,
      inProgress: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props) {
    if (shouldLoad(nextProps, props, 'authorization')) {
      this.props.loadAuthorizations();
    }
  }

  handleRequireReceiptToggle() {
    const { requireReceiptCode } = this.state;

    this.setState({ inProgress: true });
    const settingsPatch = { requireReceiptCode: !requireReceiptCode };

    this.props.onUpdateExtension(settingsPatch)
      .then(() => this.setState({
        inProgress: false,
        requireReceiptCode: !requireReceiptCode,
      }));
  }

  handleEnableBarcodeScanToggle() {
    const { enableBarcodeScan } = this.state;

    this.setState({ inProgress: true });

    this.props.onUpdateExtension({ enableBarcodeScan: !enableBarcodeScan })
      .then(() => this.setState({
        inProgress: false,
        enableBarcodeScan: !enableBarcodeScan,
      }));
  }

  handleBarcodeFormSubmit(values) {
    const { authorization: { id: authorizationId } } = this.props;

    const authorization = {
      authorizationType: BARCODE_AUTH_TYPE,
      implementationData: values,
    };

    if (!authorizationId) {
      this.props.createAuthorization(authorization);
    } else {
      this.props.updateAuthorization(authorizationId, authorization);
    }
  }

  render() {
    const { authorization } = this.props;
    const {
      requireReceiptCode,
      enableBarcodeScan,
      inProgress,
    } = this.state;

    const regex = _.get(authorization, 'implementationData.regex');

    return (
      <LoaderContainer
        className="program-settings"
        isLoading={!isInitialized(authorization)}
        isOverlay
      >
        <h3>Program settings</h3>
        <LoaderContainer
          isLoading={inProgress}
          isOverlay
        >
          <ToggleSwitch
            message="Require receipt code for purchase validation"
            onToggle={this.handleRequireReceiptToggle}
            value={requireReceiptCode}
          />
          <ToggleSwitch
            message="Enable receipt barcode scanning"
            onToggle={this.handleEnableBarcodeScanToggle}
            value={enableBarcodeScan}
          />
          {enableBarcodeScan &&
            <BarcodeRegexForm
              initialValues={{ regex }}
              navigateToUrl={this.props.navigateToUrl}
              onSubmit={this.handleBarcodeFormSubmit}
            />
          }
        </LoaderContainer>
      </LoaderContainer>
    );
  }
}

ProgramSettings.propTypes = {
  programId: PropTypes.string,
  requireReceiptCode: PropTypes.bool,
  enableBarcodeScan: PropTypes.bool,
  authorization: PropTypes.object,
  onUpdateExtension: PropTypes.func,
  loadAuthorizations: PropTypes.func,
  updateAuthorization: PropTypes.func,
  createAuthorization: PropTypes.func,
  navigateToUrl: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    authorization: getAuthorizationByType(state, BARCODE_AUTH_TYPE),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName, programId } = ownProps;
  const scope = { extensionName };

  return {
    loadAuthorizations: () => (
      dispatch(loadAuthorizations(programId, scope))
    ),
    updateAuthorization: (authorizationId, authorizationPatch) => (
      dispatch(updateAuthorization(programId, authorizationId, authorizationPatch, scope))
    ),
    createAuthorization: (authorization) => (
      dispatch(createAuthorization(programId, authorization, scope))
    ),
    navigateToUrl: (url) => (
      dispatch(navigateToUrl(url))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramSettings);
