import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
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
import { createDeal, updateDeal, deleteDeal } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

export class DealsCmsPage extends PureComponent {
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

    autoBindReact(this);

    this.state = {
      mainCategoryId: undefined,
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate(prevProps) {
    this.refreshData(prevProps);
  }

  refreshData(prevProps = {}) {
    const { parentCategoryId, categories } = this.props;
    const { prevCategories } = prevProps;

    if (!prevCategories) {
      const mainCategoryId = getMainCategoryId(parentCategoryId, categories);
    }

    if (!_.isEqual(prevCategories, categories)) {
      const mainCategoryId = getMainCategoryId(parentCategoryId, categories);

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
      title: i18next.t(LOCALIZATION.DELETE_MODAL_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MODAL_MESSAGE, { title }),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_CONFIRM_TITLE),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_ABORT_TITLE),
      onConfirm: () => this.handleDealDelete(id),
    });
  }

  handleDealCreate(deal, placeId) {
    const { createDeal, catalogId, selectedCategoryId } = this.props;
    const { mainCategoryId } = this.state;

    const categoryIds = [mainCategoryId, selectedCategoryId];

    return createDeal(categoryIds, placeId, deal, catalogId);
  }

  handleDealUpdate(deal, placeId, categories) {
    const { catalogId, updateDeal } = this.props;

    const categoryIds = _.map(categories, 'id');

    return updateDeal(categoryIds, placeId, deal, catalogId);
  }

  handleDealDelete(dealId) {
    const { catalogId, deleteDeal } = this.props;

    return deleteDeal(dealId, catalogId);
  }

  render() {
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
    const { mainCategoryId } = this.state;

    const categoryActionWhitelist = {
      [mainCategoryId]: ['rename'],
    };

    return (
      <div className="deals-dashboard">
        <div className="deals-dashboard__title">
          <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
          <Button
            className="btn-icon pull-right"
            onClick={this.handleAddDealClick}
          >
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.BUTTON_ADD_TITLE)}
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
    deleteDeal: (dealId, catalogId) =>
      dispatch(deleteDeal(appId, dealId, scope)).then(() =>
        dispatch(
          createTransaction(
            catalogId,
            dealId,
            TRANSACTION_ACTIONS.DELETE,
            scope,
          ),
        ),
      ),
    updateDeal: (categoryIds, placeId, deal, catalogId) =>
      dispatch(updateDeal(appId, categoryIds, placeId, deal, scope)).then(() =>
        dispatch(
          createTransaction(
            catalogId,
            deal.id,
            TRANSACTION_ACTIONS.UPDATE,
            scope,
          ),
        ),
      ),
    createDeal: (categoryIds, placeId, deal, catalogId) =>
      dispatch(createDeal(appId, categoryIds, placeId, deal, scope)).then(
        action => {
          const dealId = _.get(action, 'payload.data.id');
          return dispatch(
            createTransaction(
              catalogId,
              dealId,
              TRANSACTION_ACTIONS.CREATE,
              scope,
            ),
          );
        },
      ),
    updateResourceCategories: (categoryIds, resource) =>
      dispatch(updateResourceCategories(appId, categoryIds, resource, scope)),
  };
}

export default connect(null, mapDispatchToProps)(DealsCmsPage);
