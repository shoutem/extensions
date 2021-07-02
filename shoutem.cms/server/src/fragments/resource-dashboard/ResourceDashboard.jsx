import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { LoaderContainer, ConfirmModal, Paging } from '@shoutem/react-web-ui';
import {
  shouldRefresh,
  isBusy,
  isInitialized,
  hasNext,
  hasPrev,
} from '@shoutem/redux-io';
import {
  createCategory,
  renameCategory,
  deleteCategory,
  deleteResource,
  getMainCategoryId,
  getIncludeProperties,
  updateResourceCategories,
  updateResourceLanguages,
  CategoryTree,
  CmsTable,
  SearchForm,
} from '@shoutem/cms-dashboard';
import { trackEvent } from '../../providers/analytics';
import {
  loadResources,
  loadNextResourcesPage,
  loadPreviousResourcesPage,
} from '../../actions';
import { getResources } from '../../selectors';
import {
  getCurrentPagingOffsetFromCollection,
  getCurrentSearchOptionsFromCollection,
  canSearch,
  canFilter,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

const DEFAULT_LIMIT = 10;

function resolvePageLabel(pageNumber) {
  return i18next.t(LOCALIZATION.PAGE_LABEL, { pageNumber });
}

export class ResourceDashboard extends Component {
  static propTypes = {
    schema: PropTypes.object,
    shortcut: PropTypes.object,
    parentCategoryId: PropTypes.string,
    selectedCategoryId: PropTypes.string,
    sortOptions: PropTypes.object,
    categories: PropTypes.array,
    languages: PropTypes.array,
    resources: PropTypes.array,
    updateResourceCategories: PropTypes.func,
    updateResourceLanguages: PropTypes.func,
    loadResources: PropTypes.func,
    createCategory: PropTypes.func,
    renameCategory: PropTypes.func,
    deleteCategory: PropTypes.func,
    deleteResource: PropTypes.func,
    loadNextPage: PropTypes.func,
    loadPreviousPage: PropTypes.func,
    onCategorySelected: PropTypes.func,
    onResourceEditClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.paging = createRef();
    this.resourceDeleteModal = createRef();

    const { schema } = props;

    this.state = {
      include: getIncludeProperties(schema),
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
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
      const offset = getCurrentPagingOffsetFromCollection(
        nextResources,
        DEFAULT_LIMIT,
      );

      this.handleLoadResources(
        nextSelectedCategoryId,
        {},
        nextSortOptions,
        offset,
      );
    }
  }

  handleLoadResources(categoryId, filterOptions, sortOptions, offset) {
    const { include } = this.state;

    this.props.loadResources(
      categoryId,
      filterOptions,
      sortOptions,
      include,
      DEFAULT_LIMIT,
      offset,
    );
  }

  handleFilterChange(searchOptions) {
    const { selectedCategoryId, sortOptions } = this.props;
    this.handleLoadResources(selectedCategoryId, searchOptions, sortOptions, 0);
  }

  handleNextPageClick() {
    const { resources } = this.props;
    return this.props.loadNextPage(resources);
  }

  handlePreviousPageClick() {
    const { resources } = this.props;
    return this.props.loadPreviousPage(resources);
  }

  handleCategoryCreate(categoryName) {
    const { parentCategoryId, shortcut } = this.props;

    trackEvent(
      'screens',
      'content-category-created',
      _.get(shortcut, 'screen'),
    );

    return this.props.createCategory(categoryName, parentCategoryId);
  }

  async handleCategoryDelete(categoryId) {
    const { shortcut, onCategorySelected, selectedCategoryId } = this.props;
    const { mainCategoryId } = this.state;

    trackEvent(
      'screens',
      'content-category-deleted',
      _.get(shortcut, 'screen'),
    );

    await this.props.deleteCategory(categoryId);

    if (selectedCategoryId === categoryId) {
      if (mainCategoryId && _.isFunction(onCategorySelected)) {
        onCategorySelected(mainCategoryId);
      }
    }
  }

  handleCategoryRename(categoryId, categoryName) {
    const { shortcut, parentCategoryId } = this.props;

    trackEvent(
      'screens',
      'content-category-renamed',
      _.get(shortcut, 'screen'),
    );

    return this.props.renameCategory(
      parentCategoryId,
      categoryId,
      categoryName,
    );
  }

  handleDeleteResourceClick(resource) {
    const { id, title } = resource;

    this.resourceDeleteModal.current.show({
      title: i18next.t(LOCALIZATION.DELETE_MODAL_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MODAL_MESSAGE, { title }),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_CONFIRM_TITLE),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_ABORT_TITLE),
      onConfirm: () => this.props.deleteResource(id),
    });
  }

  render() {
    const {
      selectedCategoryId,
      languages,
      categories,
      resources,
      schema,
      shortcut,
    } = this.props;
    const { mainCategoryId } = this.state;

    const categoryActionWhitelist = {
      [mainCategoryId]: ['rename'],
    };

    const isLoading = !isInitialized(resources) || isBusy(resources);
    const inProgress = isBusy(resources);

    const showSearch = canSearch(shortcut);
    const showFilter = canFilter(shortcut);
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
            onCategorySelected={this.props.onCategorySelected}
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
            mainCategoryId={mainCategoryId}
            onDeleteClick={this.handleDeleteResourceClick}
            onUpdateClick={this.props.onResourceEditClick}
            onUpdateItemCategories={this.props.updateResourceCategories}
            onUpdateItemLanguages={this.props.updateResourceLanguages}
          />
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
        </LoaderContainer>
        <ConfirmModal
          className="resources-dashboard__delete settings-page-modal-small"
          ref={this.resourceDeleteModal}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { selectedCategoryId } = ownProps;

  return {
    resources: getResources(state, selectedCategoryId),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, canonicalName } = ownProps;

  return {
    createCategory: (categoryName, parentCategoryId) =>
      dispatch(
        createCategory(appId, canonicalName, categoryName, parentCategoryId),
      ),
    renameCategory: (parentCategoryId, categoryId, categoryName) =>
      dispatch(
        renameCategory(appId, parentCategoryId, categoryId, categoryName),
      ),
    deleteCategory: categoryId => dispatch(deleteCategory(appId, categoryId)),
    deleteResource: resourceId =>
      dispatch(deleteResource(appId, resourceId, canonicalName)),
    updateResourceCategories: (categoryIds, resource) =>
      dispatch(updateResourceCategories(appId, categoryIds, resource)),
    updateResourceLanguages: (languageIds, resource) =>
      dispatch(updateResourceLanguages(appId, languageIds, resource)),
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
    loadPreviousPage: resources =>
      dispatch(loadPreviousResourcesPage(resources)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceDashboard);
