import React, { PureComponent } from 'react';
import { AppState, Platform } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  clear,
  cloneStatus,
  find as findAction,
  getCollection,
  getOne,
  isBusy,
  isError,
  isInitialized,
  isValid,
  next,
  shouldRefresh,
} from '@shoutem/redux-io';
import {
  DropDownMenu,
  EmptyStateView,
  ListView,
  Screen,
  View,
} from '@shoutem/ui';
import { I18n, selectors as i18nSelectors } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { SkeletonLoading } from '../components';
import Header from '../components/Header';
import { ext } from '../const';
import {
  CATEGORIES_SCHEMA,
  getCategories,
  getScreenState,
  setScreenState as setScreenStateAction,
} from '../redux';

// Hardcoded page limit to be able to fetch all categories as pagination is not
// implemented and it is expected that there would be less than 1000 categories
const CATEGORIES_PAGE_LIMIT = 1000;

/**
 * Returns the categories that should be displayed in the app
 * based on the shortcut settings configured in the builder.
 *
 * @param {[]} allCategories All CMS categories connected to a shortcut.
 * @param {[]} visibleCategories A list of categories that should be visible
 *   in the app. If this list is empty, all categories will be displayed.
 */
function getCategoriesToDisplay(allCategories, visibleCategories) {
  if (_.isEmpty(visibleCategories)) {
    // Show all categories, if the app owner hasn't explicitly
    // selected any visible categories, this is the default state.
    return allCategories;
  }

  // Visible categories have been configured, so show only the selected categories
  const categoriesToDisplay = _.intersectionBy(
    allCategories,
    visibleCategories,
    'id',
  );
  cloneStatus(allCategories, categoriesToDisplay);
  return categoriesToDisplay;
}

/**
 * This is a base screen that contains all of the shared logic
 * required to render a list of CMS resources grouped in categories.
 * Screens that extend this screen will usually only implement the
 * renderRow method, and in some cases define getSectionId, and
 * renderSectionHeader methods if they wish to group their data into
 * sections.
 */
export class CmsListScreen extends PureComponent {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    clear: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    find: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    next: PropTypes.func.isRequired,
    setScreenState: PropTypes.func.isRequired,
    channelId: PropTypes.number,
    currentLocation: PropTypes.object,
    isSearchSettingEnabled: PropTypes.bool,
    parentCategory: PropTypes.object,
    parentCategoryId: PropTypes.string,
    screenSettings: PropTypes.object,
    selectedCategory: PropTypes.object,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    style: PropTypes.shape({
      categories: DropDownMenu.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
      list: ListView.propTypes.style,
      screen: Screen.propTypes.style,
    }),
  };

  static defaultProps = {
    channelId: undefined,
    currentLocation: undefined,
    isSearchSettingEnabled: false,
    parentCategory: undefined,
    parentCategoryId: undefined,
    screenSettings: {},
    selectedCategory: undefined,
    sortField: undefined,
    sortOrder: undefined,
    style: {
      screen: {},
      list: {},
      emptyState: {},
      categories: {},
    },
  };

  /**
   * Selects the part of the state required by this screen. You can add
   * additional state keys by invoking the mapStateToProps returned by
   * this function in your own mapStateToProps.
   *
   * @param getCmsCollection The selector that returns the primary CMS data to display,
   *   this data should be mapped in state by using the cmsCollection reducer.
   * @returns {function(*=, *)} mapStateToProps function
   */
  static createMapStateToProps(getCmsCollection) {
    return (state, ownProps) => {
      const navigationProps = _.get(ownProps, 'route.params');
      const { screenId } = navigationProps;

      const parentCategoryId = _.get(
        navigationProps,
        'shortcut.settings.parentCategory.id',
      );
      const visibleCategories = _.get(
        navigationProps,
        'shortcut.settings.visibleCategories',
        [],
      );
      const sortField = _.get(navigationProps, 'shortcut.settings.sortField');
      const sortOrder = _.get(navigationProps, 'shortcut.settings.sortOrder');
      const isSearchSettingEnabled = _.get(
        navigationProps,
        'shortcut.settings.isInAppContentSearchEnabled',
        true,
      );

      const allCategories = getCategories(state, parentCategoryId);
      const categoriesToDisplay = getCategoriesToDisplay(
        allCategories,
        visibleCategories,
      );
      const channelId = i18nSelectors.getActiveChannelId(state);

      const collection = getCmsCollection(state);
      if (!collection) {
        throw new Error(
          `Invalid collection selector passed to createMapStateToProps of the
           CmsListScreen. Expected an array but the selector returned: ${collection}`,
        );
      }

      const { selectedCategoryId } = getScreenState(state, screenId);
      const { screenSettings } = getRouteParams(ownProps);

      return {
        parentCategoryId,
        sortField,
        sortOrder,
        isSearchSettingEnabled,
        ...(channelId && { channelId }),
        data: getCollection(collection[selectedCategoryId], state),
        categories: categoriesToDisplay,
        screenSettings,
        selectedCategory: getOne(selectedCategoryId, state, CATEGORIES_SCHEMA),
      };
    };
  }

  /**
   * Creates a mapDispatchToProps with the bound actions required by this screen.
   * If you need to implement a custom mapDispatchToProps for your screen, invoke
   * the mapDispatchToProps returned by this function in your own mapDispatchToProps.
   * However, this shouldn't be necessary in most scenarios, usually you can only
   * provideIf additional action creators to this function directly.
   *
   * @param actionCreators Any custom action creators to include to props
   * @returns {function(*=)} mapStateToProps function
   */
  static createMapDispatchToProps(actionCreators) {
    return dispatch =>
      bindActionCreators(
        {
          ...actionCreators,
          find: findAction,
          setScreenState: setScreenStateAction,
          clear,
          next,
        },
        dispatch,
      );
  }

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.debouncedSearchData = _.debounce(this.searchData, 500);

    this.state = {
      searchEnabled: true,
      searchText: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { schema } = this.state;

    navigation.setOptions({
      ...this.getNavBarProps(),
    });

    if (!schema) {
      throw Error(
        `Invalid Screen state "schema". Screen that extends CMSListScreen must define
         (content) "schema" property in the state.`,
      );
    }
    this.refreshInvalidContent(this.props, true);
    this.checkPermissionStatus(this.props);
    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;

    navigation.setOptions({
      ...this.getNavBarProps(),
    });

    this.refreshInvalidContent(prevProps);
  }

  componentWillUnmount() {
    this.appStateListener?.remove();
  }

  handleAppStateChange(appState) {
    const { currentAppState } = this.state;

    this.setState({ currentAppState: appState });

    if (
      currentAppState === 'background' &&
      appState === 'active' &&
      Platform.OS === 'ios'
    ) {
      this.checkPermissionStatus();
    }
  }

  checkPermissionStatus(props = this.props) {
    // check if we need user location
    const { sortField, checkPermissionStatus } = props;

    const isSortByLocation = sortField === 'location';
    const isLocationAvailable = !!props.currentLocation;

    if (
      isSortByLocation &&
      !isLocationAvailable &&
      _.isFunction(checkPermissionStatus)
    ) {
      checkPermissionStatus();
    }
  }

  onCategorySelected(category) {
    const {
      selectedCategory,
      setScreenState,
      sortField,
      sortOrder,
    } = this.props;
    const { screenId } = getRouteParams(this.props);
    const { searchText } = this.state;

    if (selectedCategory.id === category.id) {
      // The category is already selected.
      return;
    }

    // When we do search, only currently selected collection/category is updated with
    // search results in RIO storage. If we switch category, we have to do search for
    // newly selected category, otherwise RIO will just return last (wrong) state of it.
    this.searchData(searchText, category);

    setScreenState(screenId, {
      selectedCategoryId: category.id,
      sortField,
      sortOrder,
    });
  }

  getNavBarProps() {
    const { screenSettings } = this.props;

    const inlineCategories =
      screenSettings.categoryPickerType === 'navBarDropdown'
        ? this.renderNavbarCategoriesDropDown()
        : null;

    return {
      headerRight: () => <View styleName="container">{inlineCategories}</View>,
    };
  }

  getListProps() {
    return {};
  }

  getQueryParams(options) {
    const { channelId } = this.props;
    const { searchText } = this.state;

    const sortField = _.get(options, 'sortField');
    const sortOrder = _.get(options, 'sortOrder');

    const params = {
      'filter[categories]': _.get(options, 'category.id'),
      'filter[channels]': channelId,
      query: searchText,
    };

    if (!sortField) {
      return { ...params };
    }

    const sort = sortOrder === 'ascending' ? sortField : `-${sortField}`;

    if (sortField === 'location') {
      const { currentLocation } = this.props;

      const latitude = _.get(currentLocation, 'coords.latitude');
      const longitude = _.get(currentLocation, 'coords.longitude');

      const isCurrentLocationAvailable = !!latitude && !!longitude;
      // default to sort by name when location is unavailable
      if (!isCurrentLocationAvailable) {
        return {
          ...params,
          sort: 'name',
        };
      }

      return { ...params, sort, latitude, longitude };
    }

    return { ...params, sort };
  }

  getFetchDataOptions(props) {
    const {
      searchText,
      selectedCategory: category,
      sortField,
      sortOrder,
    } = props;

    return {
      category,
      sortField,
      sortOrder,
      searchText,
    };
  }

  /**
   * Refresh invalid or expired content.
   * Content is invalid when something depending changes.
   * Watch categories, selectedCategory and data.
   * prevProps falls back to this.props if called from
   * componentDidMount, which does not have prevProps.
   * @param prevProps {object} - Previous props or this.props
   * @param initialization {bool} - Is screen initializing
   */
  refreshInvalidContent(prevProps = this.props, initialization = false) {
    const {
      categories,
      currentLocation,
      data,
      parentCategoryId,
      selectedCategory,
      sortField,
      sortOrder,
    } = this.props;

    if (isBusy(categories)) {
      // Do not do anything related to categories until they are loaded.
      return;
    }

    if (parentCategoryId && shouldRefresh(categories, initialization)) {
      // Expired case.
      this.fetchCategories();
      return;
    }

    if (!_.size(categories)) {
      // Without categories data can not be fetched.
      // Unsupported case, CMS list screen requires categories to work.
      return;
    }

    // Categories are required to resolve
    // either selectedCategory or data for selected category.
    if (
      !this.isCategoryValid(selectedCategory) ||
      (prevProps.categories !== categories &&
        !this.isSelectedCategoryValid(this.props))
    ) {
      this.onCategorySelected(categories[0]);
    }

    const shouldRefreshData =
      this.isCategoryValid(selectedCategory) && shouldRefresh(data);
    const hasOrderingChanged =
      sortField !== prevProps.sortField || sortOrder !== prevProps.sortOrder;
    const hasLocationChanged = !_.isEqual(
      currentLocation,
      prevProps.currentLocation,
    );

    if (shouldRefreshData || hasOrderingChanged || hasLocationChanged) {
      this.fetchData(this.getFetchDataOptions(this.props));
    }
  }

  /**
   * Check if selectedCategory is a member of categories, if not it is not valid.
   */
  isSelectedCategoryValid(props) {
    const { categories, selectedCategory } = props;
    return _.some(categories, ['id', selectedCategory.id]);
  }

  isCategoryValid(category) {
    return _.has(category, 'id');
  }

  isCollectionValid(collection) {
    if (
      (!isInitialized(collection) && !isError(collection)) ||
      isBusy(collection)
    ) {
      // If collection is not initialized but has error it means initialization failed.
      // The collection is loading, treat it as valid for now
      return true;
    }
    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, categories, data } = this.props;

    return (
      _.isUndefined(parentCategoryId) ||
      !this.isCollectionValid(categories) ||
      !this.isCollectionValid(data)
    );
  }

  fetchCategories() {
    const { find, parentCategoryId } = this.props;

    if (!parentCategoryId) {
      return;
    }

    find(CATEGORIES_SCHEMA, undefined, {
      query: {
        'filter[parent]': parentCategoryId,
        'page[limit]': CATEGORIES_PAGE_LIMIT,
      },
    });
  }

  fetchData(options) {
    const { find } = this.props;
    const { schema } = this.state;

    find(schema, undefined, {
      query: { ...this.getQueryParams(options) },
    });
  }

  loadMore() {
    const { data, next } = this.props;

    next(data);
  }

  refreshData() {
    this.fetchData(this.getFetchDataOptions(this.props));
  }

  searchData(searchTerm, category) {
    const { selectedCategory } = this.props;
    const { searchText } = this.state;

    const resolvedSearchData = {
      ...this.props,
      searchText: searchTerm || searchText,
      selectedCategory: category || selectedCategory,
    };

    this.fetchData({ ...this.getFetchDataOptions(resolvedSearchData) });
  }

  handleSearchTextChange(searchText) {
    this.setState({ searchText }, () => this.debouncedSearchData());
  }

  handleClearSearchText() {
    this.setState({ searchText: '' }, () => this.searchData());
  }

  renderPlaceholderView() {
    const { categories, data, parentCategoryId, style } = this.props;

    // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
    // content and reload app, because `parentCategoryId` is retrieved through app configuration
    if (_.isUndefined(parentCategoryId)) {
      return (
        <EmptyStateView
          icon="error"
          message={I18n.t('shoutem.application.preview.noContentErrorMessage')}
          style={style.emptyState}
        />
      );
    }

    const { searchEnabled, searchText } = this.state;

    const emptySearchResults = searchEnabled && !_.isEmpty(searchText);

    if (emptySearchResults) {
      return (
        <EmptyStateView
          icon="search"
          message={I18n.t(ext('noSearchResultsText'))}
          style={style.emptyState}
        />
      );
    }

    const message =
      isError(categories) || isError(data)
        ? I18n.t('shoutem.application.unexpectedErrorMessage')
        : I18n.t('shoutem.application.preview.noContentErrorMessage');

    const retryFunction = !this.isCollectionValid(data)
      ? this.refreshData
      : this.fetchCategories;

    return (
      <EmptyStateView
        icon="refresh"
        retryButtonTitle={I18n.t('shoutem.application.tryAgainButton')}
        onRetry={retryFunction}
        message={message}
        style={style.emptyState}
      />
    );
  }

  renderNavbarCategoriesDropDown() {
    const { selectedCategory, categories, style } = this.props;

    if (categories.length <= 1 || !this.isCategoryValid(selectedCategory)) {
      return null;
    }

    return (
      <DropDownMenu
        styleName="navBar"
        options={categories}
        titleProperty="name"
        valueProperty="id"
        onOptionSelected={this.onCategorySelected}
        selectedOption={selectedCategory}
        showSelectedOption
        iconName="down-arrow"
        style={style.categories}
      />
    );
  }

  renderFeaturedItem() {}

  renderLoading() {
    const { screenSettings } = this.props;

    return (
      <SkeletonLoading
        hasFeaturedItem={screenSettings.hasFeaturedItem}
        listType={screenSettings.listType}
      />
    );
  }

  renderData(data) {
    const { screenSettings, style } = this.props;

    const loading = isBusy(data);
    const initialLoad =
      !isValid(data) ||
      (isBusy(data) && (!data || data?.length === 0 || !isInitialized(data)));

    if (initialLoad) {
      return this.renderLoading();
    }

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const renderFeaturedItem = screenSettings.hasFeaturedItem
      ? this.renderFeaturedItem
      : null;

    return (
      <ListView
        data={data}
        loading={loading}
        renderRow={this.renderRow}
        onRefresh={this.refreshData}
        onLoadMore={this.loadMore}
        getSectionId={this.getSectionId}
        renderSectionHeader={this.renderSectionHeader}
        hasFeaturedItem={screenSettings.hasFeaturedItem}
        renderFeaturedItem={renderFeaturedItem}
        style={style}
        initialListSize={1}
        {...this.getListProps()}
      />
    );
  }

  render() {
    const {
      categories,
      data,
      isSearchSettingEnabled,
      screenSettings,
      selectedCategory,
      style,
    } = this.props;
    const { searchEnabled, searchText } = this.state;

    const shouldRenderSearch = isSearchSettingEnabled && searchEnabled;

    return (
      <Screen style={style.screen}>
        <Header
          categories={categories}
          categoryPickerType={screenSettings.categoryPickerType}
          searchText={searchText}
          selectedCategory={selectedCategory}
          onCategorySelected={this.onCategorySelected}
          shouldRenderSearch={shouldRenderSearch}
          onSearchTextChange={this.handleSearchTextChange}
          onClearSearchText={this.handleClearSearchText}
        />
        {this.renderData(data)}
      </Screen>
    );
  }
}
