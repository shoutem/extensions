import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getShortcutState,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import { Paging, LoaderContainer } from '@shoutem/react-web-ui';
import {
  CATEGORIES,
  deleteCategory,
  renameCategory,
} from '@shoutem/cms-dashboard';
import { AssetManager } from '@shoutem/assets-sdk';
import { shouldLoad, shouldRefresh, hasNext, hasPrev } from '@shoutem/redux-io';
import {
  loadDeals,
  loadNextDealsPage,
  loadPreviousDealsPage,
  loadDealCategories,
  createDealCategory,
  loadPlaces,
  getDeals,
  getDealCategories,
  getPlaces,
  DealsDashboard,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from 'src/modules/deals';
import { initializeSpecialDeals } from 'src/redux';
import { dealsApi, types } from 'src/services';
import dealsSchema from '../../../data-schemas/deals.json';
import LOCALIZATION from './localization';
import './style.scss';

function resolvePaging(currentPagingRef, useDefaultPaging) {
  const defaultPaging = {
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
  };

  if (useDefaultPaging) {
    return defaultPaging;
  }

  if (!currentPagingRef) {
    return defaultPaging;
  }

  return currentPagingRef.getPagingInfo();
}

class DealsCmsPage extends PureComponent {
  static propTypes = {
    appId: PropTypes.string,
    shortcut: PropTypes.object,
    extension: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
    deals: PropTypes.array,
    loadDeals: PropTypes.func,
    loadNextPage: PropTypes.func,
    loadPreviousPage: PropTypes.func,
    categories: PropTypes.array,
    loadDealCategories: PropTypes.func,
    createDealCategory: PropTypes.func,
    deleteDealCategory: PropTypes.func,
    renameDealCategory: PropTypes.func,
    places: PropTypes.array,
    loadPlaces: PropTypes.func,
    initializeSpecialDeals: PropTypes.func,
  };

  static contextTypes = {
    page: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    const { shortcut, extension, appId } = props;
    const { page } = context;

    const parentCategoryId = _.get(shortcut, 'settings.parentCategory.id');
    const catalogId = _.get(shortcut, 'settings.catalog.id');
    const dealsEndpoint = _.get(extension, 'settings.services.core.deals');
    const appsUrl = _.get(page, 'pageContext.url.apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    dealsApi.init(dealsEndpoint);

    this.state = {
      parentCategoryId,
      catalogId,
      inProgress: false,
      selectedCategoryId: parentCategoryId,
      showLoaderOnRefresh: false,
    };
  }

  componentDidMount() {
    const { parentCategoryId, catalogId } = this.state;

    if (!parentCategoryId || !catalogId) {
      this.initializeSpecialDeals();
    } else {
      this.refreshData(this.props, true, true);
    }
  }

  componentDidUpdate(prevProps) {
    this.refreshData(prevProps);
  }

  refreshData(prevProps, useDefaultPaging = false, forceLoading) {
    const { deals, categories } = this.props;
    const { selectedCategoryId, parentCategoryId } = this.state;

    if ((parentCategoryId && shouldRefresh(categories)) || forceLoading) {
      const { loadDealCategories } = this.props;

      loadDealCategories(parentCategoryId, useDefaultPaging);
    }

    if ((selectedCategoryId && shouldRefresh(deals)) || forceLoading) {
      this.loadDeals(useDefaultPaging);
    }

    if (shouldLoad(this.props, prevProps, 'places') || forceLoading) {
      const { loadPlaces } = this.props;

      loadPlaces();
    }
  }

  initializeSpecialDeals() {
    const {
      initializeSpecialDeals,
      shortcut: { title },
      updateShortcutSettings,
    } = this.props;
    this.setState({ inProgress: true });

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
          inProgress: false,
        }),
      );
    });
  }

  loadDeals(useDefaultPaging = true) {
    const { loadDeals } = this.props;
    const { selectedCategoryId } = this.state;

    const paging = resolvePaging(this.refs.paging, useDefaultPaging);
    this.setState({ inProgress: true });

    loadDeals(selectedCategoryId, paging.limit, paging.offset).then(() =>
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }),
    );
  }

  handleNextPageClick() {
    const { deals, loadNextPage } = this.props;

    this.setState({
      inProgress: true,
      showLoaderOnRefresh: true,
    });

    loadNextPage(deals).then(() =>
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }),
    );
  }

  handlePreviousPageClick() {
    const { deals, loadPreviousPage } = this.props;

    this.setState({
      inProgress: true,
      showLoaderOnRefresh: true,
    });

    loadPreviousPage(deals).then(() =>
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }),
    );
  }

  handleCategorySelected(newSelectedCategoryId) {
    const { selectedCategoryId } = this.state;

    if (selectedCategoryId === newSelectedCategoryId) {
      return;
    }

    this.setState(
      {
        selectedCategoryId: newSelectedCategoryId,
        showLoaderOnRefresh: true,
      },
      this.loadDeals,
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
      places,
      categories,
      deleteDealCategory: handleCategoryDelete,
    } = this.props;

    const {
      inProgress,
      showLoaderOnRefresh,
      parentCategoryId,
      catalogId,
      selectedCategoryId,
    } = this.state;

    const isLoading = showLoaderOnRefresh && inProgress;

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
          deals={deals}
          dealsSchema={dealsSchema}
          onCategoryCreate={this.handleCategoryCreate}
          onCategoryDelete={handleCategoryDelete}
          onCategorySelected={this.handleCategorySelected}
          onCategoryUpdate={this.handleCategoryRename}
          parentCategoryId={parentCategoryId}
          places={places}
          selectedCategoryId={selectedCategoryId}
        />
        <Paging
          hasNext={hasNext(deals)}
          hasPrevious={hasPrev(deals)}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
          ref="paging"
          resolvePageLabel={pageNumber =>
            i18next.t(LOCALIZATION.PAGE_LABEL, { pageNumber })
          }
        />
      </LoaderContainer>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName, shortcutId } = ownProps;
  const shortcutState = getShortcutState(state, extensionName, shortcutId);

  return {
    deals: getDeals(shortcutState, state),
    categories: getDealCategories(shortcutState, state),
    places: getPlaces(shortcutState, state),
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
    loadPlaces: () => dispatch(loadPlaces(appId, scope)),
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
