import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { ConfirmModal, IconLabel } from '@shoutem/react-web-ui';
import {
  CategoryTree,
  CmsTable,
  getMainCategoryId,
  updateResourceCategories,
} from '@shoutem/cms-dashboard';
import { createTransaction, TRANSACTION_ACTIONS } from 'src/modules/stats';
import DealFormModal from '../../components/deal-form-modal';
import {
  createDeal,
  updateDeal,
  deleteDeal,
} from '../../redux';
import './style.scss';

export class DealsCmsPage extends Component {
  static propTypes = {
    assetManager: PropTypes.object,
    catalogId: PropTypes.string,
    deals: PropTypes.array,
    dealsSchema: PropTypes.object,
    places: PropTypes.array,
    parentCategoryId: PropTypes.string,
    selectedCategoryId: PropTypes.string,
    categories: PropTypes.array,
    createDeal: PropTypes.func,
    deleteDeal: PropTypes.func,
    updateDeal: PropTypes.func,
    updateResourceCategories: PropTypes.func,
    onCategorySelected: PropTypes.func,
    onCategoryCreate: PropTypes.func,
    onCategoryDelete: PropTypes.func,
    onCategoryUpdate: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.refreshData = this.refreshData.bind(this);
    this.handleAddDealClick = this.handleAddDealClick.bind(this);
    this.handleUpdateDealClick = this.handleUpdateDealClick.bind(this);
    this.handleDeleteDealClick = this.handleDeleteDealClick.bind(this);
    this.handleDealCreate = this.handleDealCreate.bind(this);
    this.handleDealUpdate = this.handleDealUpdate.bind(this);
    this.handleDealDelete = this.handleDealDelete.bind(this);
  }

  componentWillMount() {
    this.refreshData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refreshData(nextProps, this.props);
  }

  refreshData(nextProps, props = {}) {
    const { categories } = props;
    const {
      parentCategoryId: nextParentCategoryId,
      categories: nextCategories,
    } = nextProps;

    if (!_.isEqual(categories, nextCategories)) {
      const mainCategoryId = getMainCategoryId(nextParentCategoryId, nextCategories);
      this.setState({ mainCategoryId });
    }
  }

  handleAddDealClick() {
    this.refs.dealFormModal.show();
  }

  handleUpdateDealClick(deal) {
    this.refs.dealFormModal.show(deal);
  }

  handleDeleteDealClick(deal) {
    const { id, title } = deal;

    this.refs.confirm.show({
      title: 'Delete item',
      message: `Are you sure you want to delete ${title}?`,
      confirmLabel: 'Delete',
      confirmBsStyle: 'danger',
      onConfirm: () => this.handleDealDelete(id),
    });
  }

  handleDealCreate(deal, placeId) {
    const { mainCategoryId } = this.state;
    const { catalogId, selectedCategoryId } = this.props;

    const categoryIds = [mainCategoryId, selectedCategoryId];
    return this.props.createDeal(categoryIds, placeId, deal, catalogId);
  }

  handleDealUpdate(deal, placeId, categories) {
    const { catalogId } = this.props;

    const categoryIds = _.map(categories, 'id');
    return this.props.updateDeal(categoryIds, placeId, deal, catalogId);
  }

  handleDealDelete(dealId) {
    const { catalogId } = this.props;
    return this.props.deleteDeal(dealId, catalogId);
  }

  render() {
    const { mainCategoryId } = this.state;
    const {
      catalogId,
      selectedCategoryId,
      categories,
      assetManager,
      deals,
      dealsSchema,
      places,
      onCategorySelected,
      updateResourceCategories: handleUpdateCategories,
      onCategoryCreate,
      onCategoryDelete,
      onCategoryUpdate,
    } = this.props;

    const categoryActionWhitelist = {
      [mainCategoryId]: ['rename'],
    };

    return (
      <div className="deals-dashboard">
        <div className="deals-dashboard__title">
          <h3>Deals</h3>
          <Button
            className="btn-icon pull-right"
            onClick={this.handleAddDealClick}
          >
            <IconLabel iconName="add">
              Add item
            </IconLabel>
          </Button>
        </div>
        <CategoryTree
          categories={categories}
          categoryActionWhitelist={categoryActionWhitelist}
          onCategoryCreate={onCategoryCreate}
          onCategoryDelete={onCategoryDelete}
          onCategorySelected={onCategorySelected}
          onCategoryUpdate={onCategoryUpdate}
          selectedCategoryId={selectedCategoryId}
          staticCategories={[mainCategoryId]}
        />
        <CmsTable
          categories={categories}
          className="deals-cms-table"
          items={deals}
          mainCategoryId={mainCategoryId}
          onDeleteClick={this.handleDeleteDealClick}
          onUpdateClick={this.handleUpdateDealClick}
          onUpdateItemCategories={handleUpdateCategories}
          schema={dealsSchema}
        />
        <ConfirmModal
          className="deals-dashboard__delete settings-page-modal-small"
          ref="confirm"
        />
        <DealFormModal
          assetManager={assetManager}
          catalogId={catalogId}
          onDealCreate={this.handleDealCreate}
          onDealUpdate={this.handleDealUpdate}
          places={places}
          ref="dealFormModal"
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, shortcutId, extensionName } = ownProps;
  const scope = { shortcutId, extensionName };

  return {
    deleteDeal: (dealId, catalogId) => (
      dispatch(deleteDeal(appId, dealId, scope)).then(() => (
        dispatch(createTransaction(catalogId, dealId, TRANSACTION_ACTIONS.DELETE, scope))
      ))
    ),
    updateDeal: (categoryIds, placeId, deal, catalogId) => (
      dispatch(updateDeal(appId, categoryIds, placeId, deal, scope)).then(() => (
        dispatch(createTransaction(catalogId, deal.id, TRANSACTION_ACTIONS.UPDATE, scope))
      ))
    ),
    createDeal: (categoryIds, placeId, deal, catalogId) => (
      dispatch(createDeal(appId, categoryIds, placeId, deal, scope)).then(action => {
        const dealId = _.get(action, 'payload.data.id');
        return dispatch(createTransaction(catalogId, dealId, TRANSACTION_ACTIONS.CREATE, scope));
      })
    ),
    updateResourceCategories: (categoryIds, resource) => (
      dispatch(updateResourceCategories(appId, categoryIds, resource, scope))
    ),
  };
}

export default connect(null, mapDispatchToProps)(DealsCmsPage);
