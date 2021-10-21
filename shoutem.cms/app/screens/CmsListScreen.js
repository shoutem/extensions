import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { bindActionCreators } from 'redux';
import { AppState, InteractionManager, Platform } from 'react-native';
import _ from 'lodash';
import {
  DropDownMenu,
  EmptyStateView,
  ListView,
  Screen,
  View,
} from '@shoutem/ui';

import {
  find as findAction,
  clear,
  next,
  shouldRefresh,
  isBusy,
  isInitialized,
  isError,
  cloneStatus,
  getCollection,
  getOne,
} from '@shoutem/redux-io';
import { selectors as i18nSelectors, I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import SearchInput from '../components/SearchInput';
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
    // The parent category that is used to display
    // the available categories in the drop down menu
    parentCategory: PropTypes.any,
    // CMS categories of the primary data
    categories: PropTypes.array.isRequired,
    // Primary CMS data to display
    data: PropTypes.array.isRequired,
    // The currently selected category on this screen
    selectedCategory: PropTypes.object,
    style: PropTypes.shape({
      screen: Screen.propTypes.style,
      list: ListView.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
      categories: DropDownMenu.propTypes.style,
    }),

    // actions
    find: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    setScreenState: PropTypes.func.isRequired,
  };

  static defaultProps = {
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

      return {
        parentCategoryId,
        sortField,
        sortOrder,
        isSearchSettingEnabled,
        ...(channelId && { channelId }),
        data: getCollection(collection[selectedCategoryId], state),
        categories: categoriesToDisplay,
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

    navigation.setOptions({
      ...this.getNavBarProps(),
    });

    if (!this.state.schema) {
      throw Error(
        `Invalid Screen state "schema". Screen that extends CMSListScreen must define 
         (content) "schema" property in the state.`,
      );
    }
    this.refreshInvalidContent(this.props, true);
    this.checkPermissionStatus(this.props);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;

    navigation.setOptions({
      ...this.getNavBarProps(),
    });

    this.refreshInvalidContent(prevProps);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
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
    const { title } = getRouteParams(this.props);
    const { renderCategoriesInline } = this.state;

    const inlineCategories = renderCategoriesInline
      ? null
      : this.renderCategoriesDropDown('navBar');

    return {
      headerRight: () => <View styleName="container">{inlineCategories}</View>,
      title,
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
    const category = props.selectedCategory;
    const sortField = props.sortField;
    const sortOrder = props.sortOrder;
    const searchText = props.searchText;

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
    const { categories, data, selectedCategory } = this.props;

    if (isBusy(categories)) {
      // Do not do anything related to categories until they are loaded.
      return;
    }

    if (
      this.props.parentCategoryId &&
      shouldRefresh(categories, initialization)
    ) {
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
      (categories !== this.props.categories &&
        !this.isSelectedCategoryValid(this.props))
    ) {
      this.onCategorySelected(categories[0]);
    }

    const category = this.props.selectedCategory;

    const shouldRefreshData =
      this.isCategoryValid(category) && shouldRefresh(data);
    const hasOrderingChanged =
      this.props.sortField !== prevProps.sortField ||
      this.props.sortOrder !== prevProps.sortOrder;
    const hasLocationChanged = !_.isEqual(
      this.props.currentLocation,
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

    InteractionManager.runAfterInteractions(() =>
      find(CATEGORIES_SCHEMA, undefined, {
        query: {
          'filter[parent]': parentCategoryId,
          'page[limit]': CATEGORIES_PAGE_LIMIT,
        },
      }),
    );
  }

  fetchData(options) {
    const { find } = this.props;
    const { schema } = this.state;

    InteractionManager.runAfterInteractions(() =>
      find(schema, undefined, {
        query: { ...this.getQueryParams(options) },
      }),
    );
  }

  loadMore() {
    this.props.next(this.props.data);
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

  renderCategoriesDropDown(styleName) {
    const { selectedCategory, categories, style } = this.props;

    if (categories.length <= 1 || !this.isCategoryValid(selectedCategory)) {
      return null;
    }

    return (
      <DropDownMenu
        styleName={styleName}
        options={categories}
        titleProperty={'name'}
        valueProperty={'id'}
        onOptionSelected={this.onCategorySelected}
        selectedOption={selectedCategory}
        showSelectedOption
        iconName="down-arrow"
        style={style.categories}
      />
    );
  }

  renderSearch() {
    const { searchText } = this.state;

    return (
      <SearchInput
        onChangeText={this.handleSearchTextChange}
        onClearPress={this.handleClearSearchText}
        input={searchText}
      />
    );
  }

  renderFeaturedItem() {}

  renderData(data) {
    const { style } = this.props;

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const { screenSettings } = getRouteParams(this.props);
    const renderFeaturedItem = screenSettings.hasFeaturedItem
      ? this.renderFeaturedItem
      : null;
    const loading = isBusy(data) || !isInitialized(data);

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
    const { data, isSearchSettingEnabled, style } = this.props;
    const { renderCategoriesInline, searchEnabled } = this.state;

    return (
      <Screen style={style.screen}>
        {isSearchSettingEnabled && searchEnabled && this.renderSearch()}
        {renderCategoriesInline && this.renderCategoriesDropDown('horizontal')}
        {this.renderData(data)}
      </Screen>
    );
  }
}
