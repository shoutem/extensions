import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  CategoryTree,
  CmsTable,
  createCategory,
  deleteCategory,
  deleteResource,
  dragAndDropCategory,
  getIncludeProperties,
  getMainCategoryId,
  renameCategory,
  SearchForm,
  updateResourceCategories,
  updateResourceIndex,
  updateResourceLanguages,
} from '@shoutem/cms-dashboard';
import { ConfirmModal, LoaderContainer, Paging } from '@shoutem/react-web-ui';
import {
  hasNext,
  hasPrev,
  isBusy,
  isInitialized,
  shouldRefresh,
} from '@shoutem/redux-io';
import {
  createNotification,
  loadNextResourcesPage,
  loadPreviousResourcesPage,
  loadResources,
} from '../../actions';
import { PagingMore, PushNotificationModal } from '../../components';
import { SORT_OPTIONS } from '../../const';
import { trackEvent } from '../../providers/analytics';
import { getResources } from '../../selectors';
import {
  canFilter,
  canSearch,
  canSendPush,
  getCurrentPagingOffsetFromCollection,
  getCurrentSearchOptionsFromCollection,
  getCurrentSortFromCollection,
  getSortFromSortOptions,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

function resolvePageLabel(pageNumber) {
  return i18next.t(LOCALIZATION.PAGE_LABEL, { pageNumber });
}

export class ResourceDashboard extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.paging = createRef();
    this.resourceDeleteModal = createRef();
    this.pushNotificationModal = createRef();

    const { schema } = props;

    this.state = {
      reordering: false,
      include: getIncludeProperties(schema),
    };
  }

  UNSAFE_componentWillMount() {
    this.checkData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { categories } = props;
    const {
      resources: nextResources,
      selectedCategoryId: nextSelectedCategoryId,
      parentCategoryId: nextParentCategoryId,
      categories: nextCategories,
      sortOptions: nextSortOptions,
    } = nextProps;

    if (!_.isEqual(categories, nextCategories)) {
      const mainCategoryId = getMainCategoryId(
        nextParentCategoryId,
        nextCategories,
      );

      this.setState({ mainCategoryId });
    }

    if (nextSelectedCategoryId && shouldRefresh(nextResources)) {
      const currentSort = getCurrentSortFromCollection(nextResources);
      const nextSort = getSortFromSortOptions(nextSortOptions);

      let limit = DEFAULT_LIMIT;
      let offset = DEFAULT_OFFSET;

      if (nextResources && currentSort === SORT_OPTIONS.MANUAL) {
        if (limit < nextResources.length) {
          limit = nextResources.length;
        }
      }

      if (nextResources && currentSort !== SORT_OPTIONS.MANUAL) {
        offset = getCurrentPagingOffsetFromCollection(
          nextResources,
          DEFAULT_LIMIT,
        );
      }

      // when sort is changed we are returning default pagination limit
      // as manually sorting can increase that limit
      if (currentSort !== nextSort) {
        limit = DEFAULT_LIMIT;
        offset = DEFAULT_OFFSET;
      }

      this.handleLoadResources(
        nextSelectedCategoryId,
        {},
        nextSortOptions,
        offset,
        limit,
      );
    }
  }

  handleLoadResources(
    categoryId,
    filterOptions,
    sortOptions,
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
  ) {
    const { loadResources } = this.props;
    const { include } = this.state;

    return loadResources(
      categoryId,
      filterOptions,
      sortOptions,
      include,
      limit,
      offset,
    );
  }

  handleFilterChange(searchOptions) {
    const { selectedCategoryId, sortOptions } = this.props;
    this.handleLoadResources(selectedCategoryId, searchOptions, sortOptions);
  }

  handleLoadMoreClick() {
    const { resources, loadMore } = this.props;
    return loadMore(resources);
  }

  handleNextPageClick() {
    const { resources, loadNextPage } = this.props;
    return loadNextPage(resources);
  }

  handlePreviousPageClick() {
    const { resources, loadPreviousPage } = this.props;
    return loadPreviousPage(resources);
  }

  handleCategoryCreate(categoryName) {
    const { parentCategoryId, shortcut, createCategory } = this.props;

    trackEvent(
      'screens',
      'content-category-created',
      _.get(shortcut, 'screen'),
    );

    return createCategory(categoryName, parentCategoryId);
  }

  async handleCategoryDelete(categoryId) {
    const {
      shortcut,
      onCategorySelected,
      selectedCategoryId,
      deleteCategory,
    } = this.props;
    const { mainCategoryId } = this.state;

    trackEvent(
      'screens',
      'content-category-deleted',
      _.get(shortcut, 'screen'),
    );

    await deleteCategory(categoryId);

    if (selectedCategoryId === categoryId) {
      if (mainCategoryId && _.isFunction(onCategorySelected)) {
        onCategorySelected(mainCategoryId);
      }
    }
  }

  handleCategoryRename(categoryId, categoryName) {
    const { shortcut, parentCategoryId, renameCategory } = this.props;

    trackEvent(
      'screens',
      'content-category-renamed',
      _.get(shortcut, 'screen'),
    );

    return renameCategory(parentCategoryId, categoryId, categoryName);
  }

  handleResourceIndexChange(index, resource) {
    const { selectedCategoryId, updateResourceIndex } = this.props;

    this.setState({ reordering: true });

    return updateResourceIndex(selectedCategoryId, index, resource)
      .then(() => {
        this.setState({ reordering: false });
      })
      .catch(() => {
        this.setState({ reordering: false });
      });
  }

  handleCategoryDragAndDrop(categoryId, index) {
    const { dragAndDropCategory, parentCategoryId } = this.props;
    return dragAndDropCategory(parentCategoryId, categoryId, index);
  }

  handleDeleteResourceClick(resource) {
    const { deleteResource } = this.props;
    const { id, title } = resource;

    this.resourceDeleteModal.current.show({
      title: i18next.t(LOCALIZATION.DELETE_MODAL_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MODAL_MESSAGE, { title }),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_CONFIRM_TITLE),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_ABORT_TITLE),
      onConfirm: () => deleteResource(id),
    });
  }

  handleSendPushClick(resource) {
    this.pushNotificationModal.current.show({
      resource,
    });
  }

  render() {
    const {
      selectedCategoryId,
      languages,
      modules,
      categories,
      resources,
      schema,
      shortcut,
      sortable,
      onCategorySelected,
      onResourceEditClick,
      updateResourceCategories,
      updateResourceLanguages,
      createNotification,
    } = this.props;
    const { mainCategoryId, reordering } = this.state;

    const categoryActionWhitelist = {
      [mainCategoryId]: ['rename'],
    };

    const isLoading =
      !isInitialized(resources) || isBusy(resources) || reordering;
    const inProgress = isBusy(resources) || reordering;

    const showSearch = canSearch(shortcut);
    const showFilter = canFilter(shortcut);
    const showPush = canSendPush(shortcut, modules);
    const showSearchForm = showSearch || showFilter;

    return (
      <div className="resources-dashboard">
        <LoaderContainer isLoading={isLoading} isOverlay={inProgress}>
          <CategoryTree
            categories={categories}
            categoryActionWhitelist={categoryActionWhitelist}
            onCategoryCreate={this.handleCategoryCreate}
            onCategoryUpdate={this.handleCategoryRename}
            onCategoryDelete={this.handleCategoryDelete}
            onCategorySelected={onCategorySelected}
            onDragAndDropComplete={this.handleCategoryDragAndDrop}
            selectedCategoryId={selectedCategoryId}
            staticCategories={[mainCategoryId]}
          />
          {showSearchForm && (
            <SearchForm
              key={selectedCategoryId}
              schema={schema}
              showSearch={showSearch}
              showFilter={showFilter}
              searchOptions={getCurrentSearchOptionsFromCollection(
                schema,
                resources,
              )}
              onChange={this.handleFilterChange}
            />
          )}
          <CmsTable
            className="resources-cms-table"
            schema={schema}
            languages={languages}
            categories={categories}
            items={resources}
            sortable={sortable}
            canSendPush={showPush}
            mainCategoryId={mainCategoryId}
            onSendPushClick={this.handleSendPushClick}
            onDeleteClick={this.handleDeleteResourceClick}
            onUpdateClick={onResourceEditClick}
            onUpdateItemCategories={updateResourceCategories}
            onUpdateItemLanguages={updateResourceLanguages}
            onUpdateItemIndex={this.handleResourceIndexChange}
          />
          {!sortable && (
            <Paging
              ref={this.paging}
              limit={DEFAULT_LIMIT}
              offset={getCurrentPagingOffsetFromCollection(
                resources,
                DEFAULT_LIMIT,
              )}
              hasNext={hasNext(resources)}
              hasPrevious={hasPrev(resources)}
              onNextPageClick={this.handleNextPageClick}
              onPreviousPageClick={this.handlePreviousPageClick}
              resolvePageLabel={resolvePageLabel}
            />
          )}
          {sortable && hasNext(resources) && (
            <PagingMore onLoadMoreClick={this.handleLoadMoreClick} />
          )}
        </LoaderContainer>
        <ConfirmModal
          className="resources-dashboard__delete settings-page-modal-small"
          ref={this.resourceDeleteModal}
        />
        <PushNotificationModal
          schema={schema}
          shortcut={shortcut}
          languages={languages}
          createPushNotification={createNotification}
          ref={this.pushNotificationModal}
        />
      </div>
    );
  }
}

ResourceDashboard.propTypes = {
  categories: PropTypes.array.isRequired,
  createCategory: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  deleteResource: PropTypes.func.isRequired,
  dragAndDropCategory: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  loadNextPage: PropTypes.func.isRequired,
  loadPreviousPage: PropTypes.func.isRequired,
  loadResources: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired,
  parentCategoryId: PropTypes.string.isRequired,
  renameCategory: PropTypes.func.isRequired,
  resources: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  shortcut: PropTypes.object.isRequired,
  updateResourceCategories: PropTypes.func.isRequired,
  updateResourceIndex: PropTypes.func.isRequired,
  updateResourceLanguages: PropTypes.func.isRequired,
  onCategorySelected: PropTypes.func.isRequired,
  onResourceEditClick: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.string,
  sortable: PropTypes.bool,
  sortOptions: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { selectedCategoryId } = ownProps;

  return {
    resources: getResources(state, selectedCategoryId),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, canonicalName } = ownProps;

  return {
    createNotification: notification =>
      dispatch(createNotification(notification)),
    createCategory: (categoryName, parentCategoryId) =>
      dispatch(
        createCategory(appId, canonicalName, categoryName, parentCategoryId),
      ),
    renameCategory: (parentCategoryId, categoryId, categoryName) =>
      dispatch(
        renameCategory(appId, parentCategoryId, categoryId, categoryName),
      ),
    deleteCategory: categoryId => dispatch(deleteCategory(appId, categoryId)),
    dragAndDropCategory: (parentCategoryId, categoryId, index) =>
      dispatch(dragAndDropCategory(appId, parentCategoryId, categoryId, index)),
    deleteResource: resourceId =>
      dispatch(deleteResource(appId, resourceId, canonicalName)),
    updateResourceCategories: (categoryIds, resource) =>
      dispatch(updateResourceCategories(appId, categoryIds, resource)),
    updateResourceLanguages: (languageIds, resource) =>
      dispatch(updateResourceLanguages(appId, languageIds, resource)),
    updateResourceIndex: (categoryId, index, resource) =>
      dispatch(updateResourceIndex(appId, categoryId, index, resource)),
    loadResources: (
      categoryId,
      searchOptions,
      sortOptions,
      include,
      limit,
      offset,
    ) =>
      dispatch(
        loadResources(
          canonicalName,
          categoryId,
          sortOptions,
          include,
          limit,
          offset,
          searchOptions,
        ),
      ),
    loadNextPage: resources => dispatch(loadNextResourcesPage(resources)),
    loadMore: resources => dispatch(loadNextResourcesPage(resources, true)),
    loadPreviousPage: resources =>
      dispatch(loadPreviousResourcesPage(resources)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceDashboard);
