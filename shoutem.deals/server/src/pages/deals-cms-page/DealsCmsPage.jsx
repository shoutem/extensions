import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  createDealCategory,
  DealsDashboard,
  DEFAULT_LIMIT,
  getDealCategories,
  getDeals,
  loadDealCategories,
  loadDeals,
  loadNextDealsPage,
  loadPreviousDealsPage,
} from 'src/modules/deals';
import {
  getLanguageModuleStatus,
  getLanguages,
  getRawLanguages,
  isLanguageModuleEnabled,
  languagesApi,
  loadLanguageModuleStatus,
  loadLanguages,
  resolveHasLanguages,
} from 'src/modules/languages';
import { initializeSpecialDeals } from 'src/redux';
import { dealsApi, types } from 'src/services';
import { AssetManager } from '@shoutem/assets-sdk';
import {
  CATEGORIES,
  deleteCategory,
  renameCategory,
} from '@shoutem/cms-dashboard';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  getShortcutState,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import {
  isBusy,
  isInitialized,
  shouldLoad,
  shouldRefresh,
} from '@shoutem/redux-io';
import dealsSchema from '../../../data-schemas/deals.json';
import { getCurrentPagingOffsetFromCollection } from '../../services';

class DealsCmsPage extends PureComponent {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    const { shortcut, extension, appId } = props;
    const { page } = context;

    const parentCategoryId = _.get(shortcut, 'settings.parentCategory.id');
    const catalogId = _.get(shortcut, 'settings.catalog.id');
    const dealsEndpoint = _.get(extension, 'settings.services.core.deals');
    const cmsEndpoint = _.get(extension, 'settings.services.core.cms');
    const appsUrl = _.get(page, 'pageContext.url.apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    dealsApi.init(dealsEndpoint);
    languagesApi.init(cmsEndpoint);

    this.state = {
      parentCategoryId,
      catalogId,
      initializing: false,
      selectedCategoryId: parentCategoryId,
    };
  }

  UNSAFE_componentWillMount() {
    const { parentCategoryId, catalogId } = this.state;

    if (!parentCategoryId || !catalogId) {
      this.initializeSpecialDeals();
    }

    this.checkData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      loadLanguageModuleStatus,
      loadLanguages,
      loadDealCategories,
    } = this.props;

    const {
      languageModuleStatus: nextLanguageModuleStatus,
      languages: nextLanguages,
    } = nextProps;
    const { selectedCategoryId, parentCategoryId } = this.state;

    if (shouldLoad(nextProps, props, 'languageModuleStatus')) {
      loadLanguageModuleStatus();
    }

    if (
      isLanguageModuleEnabled(nextLanguageModuleStatus) &&
      shouldRefresh(nextLanguages)
    ) {
      loadLanguages();
    }

    if (parentCategoryId && shouldLoad(nextProps, props, 'categories')) {
      loadDealCategories(parentCategoryId);
    }

    if (selectedCategoryId && shouldLoad(nextProps, props, 'deals')) {
      this.handleLoadDeals();
    }
  }

  initializeSpecialDeals() {
    const {
      initializeSpecialDeals,
      shortcut: { title },
      updateShortcutSettings,
    } = this.props;
    this.setState({ initializing: true });

    initializeSpecialDeals(title).then(({ parentCategoryId, catalogId }) => {
      const settingsPatch = {
        parentCategory: {
          id: parentCategoryId,
          type: CATEGORIES,
        },
        catalog: {
          id: catalogId,
          type: types.CATALOGS,
        },
      };

      updateShortcutSettings(settingsPatch).then(() =>
        this.setState({
          catalogId,
          parentCategoryId,
          selectedCategoryId: parentCategoryId,
          initializing: false,
        }),
      );
    });
  }

  handleLoadDeals() {
    const { deals, loadDeals } = this.props;
    const { selectedCategoryId } = this.state;

    const offset = getCurrentPagingOffsetFromCollection(deals, DEFAULT_LIMIT);

    return loadDeals(selectedCategoryId, DEFAULT_LIMIT, offset);
  }

  handleNextPageClick() {
    const { deals, loadNextPage } = this.props;
    return loadNextPage(deals);
  }

  handlePreviousPageClick() {
    const { deals, loadPreviousPage } = this.props;
    return loadPreviousPage(deals);
  }

  handleCategorySelected(newSelectedCategoryId) {
    const { selectedCategoryId } = this.state;

    if (selectedCategoryId === newSelectedCategoryId) {
      return;
    }

    this.setState(
      { selectedCategoryId: newSelectedCategoryId },
      this.handleLoadDeals,
    );
  }

  handleCategoryCreate(categoryName) {
    const { createDealCategory, loadDealCategories } = this.props;
    const { parentCategoryId } = this.state;

    return createDealCategory(categoryName, parentCategoryId).then(() =>
      loadDealCategories(parentCategoryId),
    );
  }

  handleCategoryRename(categoryId, categoryName) {
    const { loadDealCategories, renameDealCategory } = this.props;
    const { parentCategoryId } = this.state;

    return renameDealCategory(
      categoryId,
      categoryName,
      parentCategoryId,
    ).then(() => loadDealCategories(parentCategoryId));
  }

  render() {
    const {
      appId,
      deals,
      categories,
      languageModuleStatus,
      languages,
      rawLanguages,
      deleteDealCategory: handleCategoryDelete,
    } = this.props;

    const {
      initializing,
      parentCategoryId,
      catalogId,
      selectedCategoryId,
    } = this.state;

    const hasLanguages = resolveHasLanguages(languageModuleStatus, languages);
    const resolvedLanguages = hasLanguages ? rawLanguages : [];

    const isLoading =
      initializing ||
      !isInitialized(deals) ||
      isBusy(deals) ||
      isBusy(languageModuleStatus) ||
      isBusy(languages);

    const inProgress = isBusy(deals);

    return (
      <LoaderContainer
        className="deals-cms-page settings-page is-wide"
        isLoading={isLoading}
        isOverlay={inProgress}
      >
        <DealsDashboard
          appId={appId}
          assetManager={this.assetManager}
          catalogId={catalogId}
          categories={categories}
          languages={resolvedLanguages}
          deals={deals}
          dealsSchema={dealsSchema}
          onCategoryCreate={this.handleCategoryCreate}
          onCategoryDelete={handleCategoryDelete}
          onCategorySelected={this.handleCategorySelected}
          onCategoryUpdate={this.handleCategoryRename}
          onPreviousPageClick={this.handlePreviousPageClick}
          onNextPageClick={this.handleNextPageClick}
          parentCategoryId={parentCategoryId}
          selectedCategoryId={selectedCategoryId}
        />
      </LoaderContainer>
    );
  }
}

DealsCmsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  createDealCategory: PropTypes.func.isRequired,
  deals: PropTypes.array.isRequired,
  deleteDealCategory: PropTypes.func.isRequired,
  extension: PropTypes.object.isRequired,
  initializeSpecialDeals: PropTypes.func.isRequired,
  languageModuleStatus: PropTypes.object.isRequired,
  languages: PropTypes.array.isRequired,
  loadDealCategories: PropTypes.func.isRequired,
  loadDeals: PropTypes.func.isRequired,
  loadLanguageModuleStatus: PropTypes.func.isRequired,
  loadLanguages: PropTypes.func.isRequired,
  loadNextPage: PropTypes.func.isRequired,
  loadPreviousPage: PropTypes.func.isRequired,
  rawLanguages: PropTypes.array.isRequired,
  renameDealCategory: PropTypes.func.isRequired,
  shortcut: PropTypes.object.isRequired,
  updateShortcutSettings: PropTypes.func.isRequired,
};

DealsCmsPage.contextTypes = {
  page: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName, shortcutId } = ownProps;
  const shortcutState = getShortcutState(state, extensionName, shortcutId);

  return {
    deals: getDeals(shortcutState, state),
    categories: getDealCategories(shortcutState, state),
    languageModuleStatus: getLanguageModuleStatus(state),
    languages: getLanguages(state),
    rawLanguages: getRawLanguages(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { shortcut, appId, shortcutId, extensionName } = ownProps;
  const scope = { shortcutId, extensionName };

  return {
    updateShortcutSettings: settings =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    loadDeals: (categoryId, limit, offset) =>
      dispatch(loadDeals(appId, categoryId, limit, offset, scope)),
    loadNextPage: deals => dispatch(loadNextDealsPage(deals)),
    loadPreviousPage: deals => dispatch(loadPreviousDealsPage(deals)),
    loadDealCategories: parentCategoryId =>
      dispatch(loadDealCategories(appId, parentCategoryId, scope)),
    createDealCategory: (categoryName, parentCategoryId) =>
      dispatch(
        createDealCategory(appId, categoryName, parentCategoryId, scope),
      ),
    deleteDealCategory: categoryId =>
      dispatch(deleteCategory(appId, categoryId, scope)),
    renameDealCategory: (categoryId, categoryName, parentCategoryId) =>
      dispatch(
        renameCategory(
          appId,
          parentCategoryId,
          categoryId,
          categoryName,
          scope,
        ),
      ),
    loadLanguageModuleStatus: () => dispatch(loadLanguageModuleStatus(appId)),
    loadLanguages: () => dispatch(loadLanguages(appId)).catch(() => null),
    initializeSpecialDeals: categoryName =>
      dispatch(initializeSpecialDeals(appId, categoryName, scope)).then(
        ([category, catalog]) => ({
          parentCategoryId: _.toString(category.payload.id),
          catalogId: _.get(catalog, 'payload.data.id'),
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DealsCmsPage);
