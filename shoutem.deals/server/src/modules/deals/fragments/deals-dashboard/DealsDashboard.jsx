import React, { createRef, PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ext } from 'src/const';
import { createTransaction, TRANSACTION_ACTIONS } from 'src/modules/stats';
import {
  CategoryTree,
  CmsTable,
  getMainCategoryId,
  loadReferenceResources,
  loadSchema,
  updateResourceCategories,
  updateResourceLanguages,
} from '@shoutem/cms-dashboard';
import { ConfirmModal, IconLabel, Paging } from '@shoutem/react-web-ui';
import { hasNext, hasPrev } from '@shoutem/redux-io';
import DealFormModal from '../../components/deal-form-modal';
import { createDeal, deleteDeal, updateDeal } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

function resolvePageLabel(pageNumber) {
  return i18next.t(LOCALIZATION.PAGE_LABEL, { pageNumber });
}

export class DealsDashboard extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.dealDeleteModal = createRef();

    this.state = {
      mainCategoryId: undefined,
      showDealModal: false,
      currentDeal: null,
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

    if (!_.isEqual(prevCategories, categories)) {
      const mainCategoryId = getMainCategoryId(parentCategoryId, categories);

      this.setState({ mainCategoryId });
    }
  }

  handleAddDealClick() {
    this.setState({ showDealModal: true, currentDeal: null });
  }

  handleUpdateDealClick(deal) {
    this.setState({ showDealModal: true, currentDeal: deal });
  }

  handleDealModalHide() {
    this.setState({ showDealModal: false, currentDeal: null });
  }

  handleDeleteDealClick(deal) {
    const { id, title } = deal;

    this.dealDeleteModal.current.show({
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

  renderBody() {
    const {
      selectedCategoryId,
      categories,
      languages,
      deals,
      dealsSchema,
      onCategorySelected,
      updateResourceCategories: handleUpdateCategories,
      onCategoryCreate,
      onCategoryDelete,
      onCategoryUpdate,
      onNextPageClick,
      onPreviousPageClick,
      updateResourceLanguages,
    } = this.props;
    const { mainCategoryId } = this.state;

    const categoryActionWhitelist = {
      [mainCategoryId]: ['rename'],
    };

    return (
      <>
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
            languages={languages}
            className="deals-cms-table"
            items={deals}
            mainCategoryId={mainCategoryId}
            onDeleteClick={this.handleDeleteDealClick}
            onUpdateClick={this.handleUpdateDealClick}
            onUpdateItemCategories={handleUpdateCategories}
            onUpdateItemLanguages={updateResourceLanguages}
            schema={dealsSchema}
          />
          <ConfirmModal
            className="settings-page-modal-small"
            ref={this.dealDeleteModal}
          />
        </div>
        <Paging
          hasNext={hasNext(deals)}
          hasPrevious={hasPrev(deals)}
          onNextPageClick={onNextPageClick}
          onPreviousPageClick={onPreviousPageClick}
          resolvePageLabel={resolvePageLabel}
        />
      </>
    );
  }

  renderModal() {
    const {
      catalogId,
      assetManager,
      loadSchema,
      loadReferenceResources,
    } = this.props;
    const { currentDeal } = this.state;

    return (
      <DealFormModal
        assetManager={assetManager}
        catalogId={catalogId}
        deal={currentDeal}
        onHide={this.handleDealModalHide}
        onDealCreate={this.handleDealCreate}
        onDealUpdate={this.handleDealUpdate}
        loadSchema={loadSchema}
        loadResources={loadReferenceResources}
      />
    );
  }

  render() {
    const { showDealModal } = this.state;

    return (
      <>
        {!showDealModal && this.renderBody()}
        {showDealModal && this.renderModal()}
      </>
    );
  }
}

DealsDashboard.propTypes = {
  assetManager: PropTypes.object.isRequired,
  catalogId: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  createDeal: PropTypes.func.isRequired,
  deals: PropTypes.array.isRequired,
  dealsSchema: PropTypes.object.isRequired,
  deleteDeal: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  loadReferenceResources: PropTypes.func.isRequired,
  loadSchema: PropTypes.func.isRequired,
  parentCategoryId: PropTypes.string.isRequired,
  selectedCategoryId: PropTypes.string.isRequired,
  updateDeal: PropTypes.func.isRequired,
  updateResourceCategories: PropTypes.func.isRequired,
  updateResourceLanguages: PropTypes.func.isRequired,
  onCategoryCreate: PropTypes.func.isRequired,
  onCategoryDelete: PropTypes.func.isRequired,
  onCategorySelected: PropTypes.func.isRequired,
  onCategoryUpdate: PropTypes.func.isRequired,
  onNextPageClick: PropTypes.func.isRequired,
  onPreviousPageClick: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, shortcutId, extensionName } = ownProps;
  const scope = { shortcutId, extensionName };

  return {
    loadSchema: schema => dispatch(loadSchema(appId, schema, ext(schema))),
    loadReferenceResources: (schema, titleProperty) =>
      dispatch(
        loadReferenceResources(
          appId,
          schema,
          ext('reference-resources'),
          titleProperty,
        ),
      ),
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
    updateResourceLanguages: (languageIds, resource) =>
      dispatch(updateResourceLanguages(appId, languageIds, resource)),
  };
}

export default connect(null, mapDispatchToProps)(DealsDashboard);
