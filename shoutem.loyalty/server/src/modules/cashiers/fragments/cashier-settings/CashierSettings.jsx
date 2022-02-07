import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getErrorCode } from 'src/services';
import { InlineModal } from '@shoutem/react-web-ui';
import { shouldLoad } from '@shoutem/redux-io';
import { CashierForm, CashiersTable } from '../../components';
import {
  createCashier,
  deleteCashier,
  getCashiersWithPlace,
  loadCashiers,
  updateCashier,
} from '../../redux';
import { getErrorMessage } from '../../services';
import LOCALIZATION from './localization';

export class CashierSettings extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.setInitialState();
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { currentPlaceId } = props;
    const {
      programId: nextProgramId,
      currentPlaceId: nextCurrentPlaceId,
    } = nextProps;

    const placeIdChanged = currentPlaceId !== nextCurrentPlaceId;

    if (placeIdChanged) {
      this.setState({ currentPlaceId: nextCurrentPlaceId });
    }

    if (placeIdChanged || shouldLoad(nextProps, props, 'cashiers')) {
      this.props.loadCashiers(nextProgramId, nextCurrentPlaceId);
    }
  }

  setInitialState() {
    this.setState({
      showAddCashierModal: false,
      currentCashier: null,
    });
  }

  handleAddCashierClick() {
    this.setState({
      showAddCashierModal: true,
    });
  }

  handleEditCashierClick(cashier) {
    this.setState({
      showAddCashierModal: true,
      currentCashier: cashier,
    });
  }

  handleHideCashierModal() {
    this.setInitialState();
  }

  handleCashierCreated(cashier) {
    const { appId, programId } = this.props;

    return new Promise((resolve, reject) => {
      this.props
        .createCashier(cashier, programId, appId)
        .then(this.setInitialState, action => {
          const errorCode = getErrorCode(action);
          reject(getErrorMessage(errorCode));
        });
    });
  }

  handleCashierUpdated(cashierPatch) {
    const { programId } = this.props;
    const { currentCashier } = this.state;
    const { id } = currentCashier;

    return new Promise((resolve, reject) => {
      this.props
        .updateCashier(id, cashierPatch, programId)
        .then(this.setInitialState, action => {
          const errorCode = getErrorCode(action);
          reject(getErrorMessage(errorCode));
        });
    });
  }

  handleCashierDeleted(cashierId) {
    const { programId } = this.props;
    this.props.deleteCashier(cashierId, programId);
  }

  renderCashierModal() {
    const { places, placesDescriptor, currentPlaceId } = this.props;
    const { currentCashier } = this.state;

    const inEditMode = !!currentCashier;
    const modalTitle = inEditMode
      ? i18next.t(LOCALIZATION.EDIT_CASHIER_TITLE)
      : i18next.t(LOCALIZATION.ADD_CASHIER_TITLE);
    const handleSubmit = inEditMode
      ? this.handleCashierUpdated
      : this.handleCashierCreated;
    const placeId = _.get(currentCashier, 'location', currentPlaceId);

    return (
      <InlineModal
        className="add-cashier-modal settings-page-modal"
        onHide={this.handleHideCashierModal}
        title={modalTitle}
      >
        <CashierForm
          initialPlaceId={placeId}
          initialValues={currentCashier}
          onCancel={this.handleHideCashierModal}
          onSubmit={handleSubmit}
          places={places}
          placesDescriptor={placesDescriptor}
        />
      </InlineModal>
    );
  }

  render() {
    const { cashiers, places } = this.props;
    const { showAddCashierModal } = this.state;

    return (
      <div className="cashier-settings">
        <CashiersTable
          cashiers={cashiers}
          hasPlaces={!_.isEmpty(places)}
          onAddClick={this.handleAddCashierClick}
          onDeleteClick={this.handleCashierDeleted}
          onEditClick={this.handleEditCashierClick}
        />
        {showAddCashierModal && this.renderCashierModal()}
      </div>
    );
  }
}

CashierSettings.propTypes = {
  appId: PropTypes.string,
  programId: PropTypes.string,
  cashiers: PropTypes.array,
  loadCashiers: PropTypes.func,
  createCashier: PropTypes.func,
  updateCashier: PropTypes.func,
  deleteCashier: PropTypes.func,
  currentPlaceId: PropTypes.string,
  places: PropTypes.array,
  placesDescriptor: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    cashiers: getCashiersWithPlace(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadCashiers: (programId, placeId) =>
      dispatch(loadCashiers(programId, placeId, scope)),
    createCashier: (cashier, programId, appId) =>
      dispatch(createCashier(cashier, programId, appId, scope)),
    updateCashier: (cashierId, cashierPatch, programId) =>
      dispatch(updateCashier(cashierId, cashierPatch, programId, scope)),
    deleteCashier: (cashierId, programId) =>
      dispatch(deleteCashier(cashierId, programId, scope)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CashierSettings);
