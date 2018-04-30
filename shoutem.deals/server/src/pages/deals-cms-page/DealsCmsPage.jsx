import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
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
import {
  shouldLoad,
  shouldRefresh,
  isInitialized,
  hasNext,
  hasPrev,
} from '@shoutem/redux-io';
import { dealsApi, types } from 'src/services';
import { initializeSpecialDeals } from 'src/redux';
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
import dealsSchema from '../../../data-schemas/deals.json';
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

class DealsCmsPage extends Component {
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

    this.refreshData = this.refreshData.bind(this);
    this.initializeSpecialDeals = this.initializeSpecialDeals.bind(this);
    this.loadDeals = this.loadDeals.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleCategorySelected = this.handleCategorySelected.bind(this);
    this.handleCategoryCreate = this.handleCategoryCreate.bind(this);
    this.handleCategoryRename = this.handleCategoryRename.bind(this);

    const {
      shortcut: { settings: shortcutSettings },
      extension: { settings: extensionSettings },
      appId,
    } = props;

    const { page } = context;

    const parentCategoryId = _.get(shortcutSettings, 'parentCategory.id');
    const catalogId = _.get(shortcutSettings, 'catalog.id');
    const dealsEndpoint = _.get(extensionSettings, 'dealsEndpoint');
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

  componentWillMount() {
    const { parentCategoryId, catalogId } = this.state;

    if (!parentCategoryId || !catalogId) {
      this.initializeSpecialDeals();
    } else {
      this.refreshData(this.props, null, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.refreshData(nextProps, this.props);
  }

  refreshData(nextProps, props = {}, useDefaultPaging = false) {
    const { selectedCategoryId, parentCategoryId } = this.state;
    const {
      deals: nextDeals,
      categories: nextCategories,
    } = nextProps;

    if (parentCategoryId && shouldRefresh(nextCategories)) {
      this.props.loadDealCategories(parentCategoryId, useDefaultPaging);
    }

    if (selectedCategoryId && shouldRefresh(nextDeals)) {
      this.loadDeals(useDefaultPaging);
    }

    if (shouldLoad(nextProps, props, 'places')) {
      this.props.loadPlaces();
    }
  }

  initializeSpecialDeals() {
    const { shortcut: { title } } = this.props;
    this.setState({ inProgress: true });

    this.props.initializeSpecialDeals(title)
      .then(({ parentCategoryId, catalogId }) => {
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

        this.props.updateShortcutSettings(settingsPatch).then(() => (
          this.setState({
            catalogId,
            parentCategoryId,
            selectedCategoryId: parentCategoryId,
            inProgress: false,
          })
        ));
      });
  }

  loadDeals(useDefaultPaging = true) {
    const { selectedCategoryId } = this.state;

    const paging = resolvePaging(this.refs.paging, useDefaultPaging);
    this.setState({ inProgress: true });

    this.props.loadDeals(selectedCategoryId, paging.limit, paging.offset)
      .then(() => this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }));
  }

  handleNextPageClick() {
    const { deals } = this.props;
    this.setState({
      inProgress: true,
      showLoaderOnRefresh: true,
    });

    this.props.loadNextPage(deals).then(() => (
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      })
    ));
  }

  handlePreviousPageClick() {
    const { deals } = this.props;
    this.setState({
      inProgress: true,
      showLoaderOnRefresh: true,
    });

    this.props.loadPreviousPage(deals).then(() => (
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      })
    ));
  }

  handleCategorySelected(newSelectedCategoryId) {
    const { selectedCategoryId } = this.state;
    if (selectedCategoryId === newSelectedCategoryId) {
      return;
    }

    this.setState({
      selectedCategoryId: newSelectedCategoryId,
      showLoaderOnRefresh: true,
    }, this.loadDeals);
  }

  handleCategoryCreate(categoryName) {
    const { parentCategoryId } = this.state;

    return this.props.createDealCategory(categoryName, parentCategoryId)
      .then(() => this.props.loadDealCategories(parentCategoryId));
  }

  handleCategoryRename(categoryId, categoryName) {
    const { parentCategoryId } = this.state;
    return this.props.renameDealCategory(categoryId, categoryName, parentCategoryId)
      .then(() => this.props.loadDealCategories(parentCategoryId));
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

    const isLoading = (
      (showLoaderOnRefresh && inProgress) ||
      !isInitialized(deals)
    );

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
  const {
    shortcut,
    appId,
    shortcutId,
    extensionName,
  } = ownProps;
  const scope = { shortcutId, extensionName };

  return {
    updateShortcutSettings: (settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
    loadDeals: (categoryId, limit, offset) => (
      dispatch(loadDeals(appId, categoryId, limit, offset, scope))
    ),
    loadNextPage: (deals) => (
      dispatch(loadNextDealsPage(deals))
    ),
    loadPreviousPage: (deals) => (
      dispatch(loadPreviousDealsPage(deals))
    ),
    loadDealCategories: (parentCategoryId) => (
      dispatch(loadDealCategories(appId, parentCategoryId, scope))
    ),
    createDealCategory: (categoryName, parentCategoryId) => (
      dispatch(createDealCategory(appId, categoryName, parentCategoryId, scope))
    ),
    deleteDealCategory: (categoryId) => (
      dispatch(deleteCategory(appId, categoryId, scope))
    ),
    renameDealCategory: (categoryId, categoryName, parentCategoryId) => (
      dispatch(renameCategory(appId, parentCategoryId, categoryId, categoryName, scope))
    ),
    loadPlaces: () => (
      dispatch(loadPlaces(appId, scope))
    ),
    initializeSpecialDeals: (categoryName) => (
      dispatch(initializeSpecialDeals(appId, categoryName, scope))
        .then(([category, catalog]) => ({
          parentCategoryId: _.toString(category.payload.id),
          catalogId: _.get(catalog, 'payload.data.id'),
        }))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DealsCmsPage);
