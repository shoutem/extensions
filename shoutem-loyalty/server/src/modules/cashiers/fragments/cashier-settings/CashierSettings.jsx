import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { LoaderContainer, InlineModal } from '@shoutem/react-web-ui';
import { isInitialized, shouldLoad } from '@shoutem/redux-io';
import { getErrorCode } from '../../../../services';
import CashiersTable from '../../components/cashiers-table';
import CashierForm from '../../components/cashier-form';
import {
  loadCashiers,
  createCashier,
  updateCashier,
  deleteCashier,
  getCashiers,
} from '../../redux';
import { resolveErrorMessage } from '../../services';
import './style.scss';

export class CashierSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.showAddCashierModal = this.showAddCashierModal.bind(this);
    this.hideAddCashierModal = this.hideAddCashierModal.bind(this);
    this.handleCashierCreated = this.handleCashierCreated.bind(this);
    this.handleCashierUpdated = this.handleCashierUpdated.bind(this);
    this.handleCashierDeleted = this.handleCashierDeleted.bind(this);

    this.state = {
      showAddCashierModal: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { programId } = nextProps;

    if (shouldLoad(nextProps, props, 'cashiers')) {
      this.props.loadCashiers(programId);
    }
  }

  showAddCashierModal() {
    this.setState({ showAddCashierModal: true });
  }

  hideAddCashierModal() {
    this.setState({ showAddCashierModal: false });
  }

  handleCashierCreated(cashier) {
    const { appId, programId } = this.props;

    return new Promise((resolve, reject) => {
      this.props.createCashier(cashier, programId, appId)
        .then(() => this.setState({ showAddCashierModal: false }),
          (action) => {
            const errorCode = getErrorCode(action);
            reject(resolveErrorMessage(errorCode));
          });
    });
  }

  handleCashierUpdated(cashierId, cashierPatch) {
    const { programId } = this.props;
    this.props.updateCashier(cashierId, cashierPatch, programId);
  }

  handleCashierDeleted(cashierId) {
    const { programId } = this.props;
    this.props.deleteCashier(cashierId, programId);
  }

  render() {
    const { cashiers } = this.props;
    const { showAddCashierModal } = this.state;

    return (
      <div className="cashier-settings">
        <LoaderContainer isLoading={!isInitialized(cashiers)}>
          <CashiersTable
            cashiers={cashiers}
            onAddCashierClick={this.showAddCashierModal}
            onEditCashierClick={this.handleCashierUpdated}
            onDeleteCashierClick={this.handleCashierDeleted}
          />
        </LoaderContainer>
        {showAddCashierModal &&
          <InlineModal
            title="Add a cashier"
            onHide={this.hideAddCashierModal}
          >
            <CashierForm
              onCancel={this.hideAddCashierModal}
              onSubmit={this.handleCashierCreated}
            />
          </InlineModal>
        }
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
};

function mapStateToProps(state) {
  return {
    cashiers: getCashiers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCashiers: (programId) => (
      dispatch(loadCashiers(programId))
    ),
    createCashier: (cashier, programId, appId) => (
      dispatch(createCashier(cashier, programId, appId))
    ),
    updateCashier: (cashierId, cashierPatch, programId) => (
      dispatch(updateCashier(cashierId, cashierPatch, programId))
    ),
    deleteCashier: (cashierId, programId) => (
      dispatch(deleteCashier(cashierId, programId))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CashierSettings);
