import React, {
  PureComponent,
} from 'react';

import { InteractionManager } from 'react-native';

import { bindActionCreators } from 'redux';
import _ from 'lodash';

import {
  DropDownMenu,
  ListView,
  Screen,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import {
  find as findAction,
  clear,
  next,

  shouldRefresh,
  isBusy,
  isInitialized,
  isError,

  getCollection,
  getOne,
} from '@shoutem/redux-io';

import {
  getScreenState,
  setScreenState as setScreenStateAction,
} from '@shoutem/core/navigation';

import {
  CATEGORIES_SCHEMA,

  getCategories,
} from '../redux';

function printChangedProps(props, nextProps) {
  const screenName = `[CMSListScreen] ${nextProps.title} -`;
  console.log(`${screenName} componentWillReceiveProps`);

  let firstChange = true;
  for (const propName of _.keys(nextProps)) {
    if (props[propName] !== nextProps[propName]) {
      if (firstChange) {
        console.log(`${screenName} changed props:`);
        firstChange = false;
      }

      console.log(` -> ${propName}`);
    }
  }
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
    // A unique id of a screen instance
    screenId: React.PropTypes.string.isRequired,
    // The parent category that is used to display
    // the available categories in the drop down menu
    parentCategory: React.PropTypes.any,
    // CMS categories of the primary data
    categories: React.PropTypes.array.isRequired,
    // Primary CMS data to display
    data: React.PropTypes.array.isRequired,
    // The shortcut title
    title: React.PropTypes.string.isRequired,
    // The currently selected category on this screen
    selectedCategory: React.PropTypes.object,
    style: React.PropTypes.shape({
      screen: Screen.propTypes.style,
      list: ListView.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
      categories: DropDownMenu.propTypes.style,
    }),

    // actions
    find: React.PropTypes.func.isRequired,
    next: React.PropTypes.func.isRequired,
    clear: React.PropTypes.func.isRequired,
    setScreenState: React.PropTypes.func.isRequired,
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
      const { screenId } = ownProps;
      const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
      const collection = getCmsCollection(state);
      if (!collection) {
        throw new Error('Invalid collection selector passed to createMapStateToProps ' +
          `of the CmsListScreen. Expected an array but the selector returned: ${collection}`,
        );
      }

      const { selectedCategoryId } = getScreenState(state, screenId);

      return {
        parentCategoryId,
        data: getCollection(collection[selectedCategoryId], state),
        categories: getCategories(state, parentCategoryId),
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
    return (dispatch) => (
      bindActionCreators(
        {
          ...actionCreators,
          find: findAction,
          setScreenState: setScreenStateAction,
          clear,
          next,
        },
        dispatch,
      )
    );
  }

  constructor(props, context) {
    super(props, context);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.onCategorySelected = this.onCategorySelected.bind(this);

    this.state = {};
  }

  componentWillMount() {
    if (!this.state.schema) {
      throw Error(
        'Invalid Screen state "schema". Screen that extends CMSListScreen ' +
        'must define (content) "schema" property in the state.',
      );
    }
    this.refreshInvalidContent(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    if (process.env.NODE_ENV === 'development') {
      printChangedProps(this.props, nextProps);
    }

    this.refreshInvalidContent(nextProps);
  }

  componentDidUpdate() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CMSListScreen] ${this.props.title} - componentDidUpdate`);
    }
  }

  onCategorySelected(category) {
    const { selectedCategory, setScreenState, screenId } = this.props;
    if (selectedCategory.id === category.id) {
      // The category is already selected.
      return;
    }

    setScreenState(screenId, {
      selectedCategoryId: category.id,
    });
  }

  getNavBarProps() {
    const { title } = this.props;
    const { renderCategoriesInline } = this.state;
    const inlineCategories = renderCategoriesInline ? null : this.renderCategoriesDropDown();

    return {
      renderRightComponent: () => (
        <View virtual styleName="container">
          {inlineCategories}
        </View>
      ),
      title: (title || '').toUpperCase(),
    };
  }

  /**
   * Refresh invalid or expired content.
   * Content is invalid when something depending changes.
   * Watch categories, selectedCategory and data.
   * @param nextProps
   * @param initialization {bool} - Is screen initializing
   */
  refreshInvalidContent(nextProps, initialization = false) {
    const { categories, data, selectedCategory } = nextProps;

    if (isBusy(categories)) {
      // Do not do anything related to categories until they are loaded.
      return;
    }

    if (this.props.parentCategoryId && shouldRefresh(categories, initialization)) {
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
      (categories !== this.props.categories && !this.isSelectedCategoryValid(nextProps))
    ) {
      this.onCategorySelected(categories[0]);
    }

    const nextCategory = nextProps.selectedCategory;
    if (this.isCategoryValid(nextCategory) && shouldRefresh(data)) {
      this.fetchData(nextCategory);
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
    return category && (category.id !== undefined);
  }

  isCollectionValid(collection) {
    if ((!isInitialized(collection) && !isError(collection)) || isBusy(collection)) {
      // If collection is not initialized but has error it means initialization failed.
      // The collection is loading, treat it as valid for now
      return true;
    }

    // The collection is considered valid if there were no errors while
    // fetching it, and if it is not empty
    return collection && !isError(collection) && (collection.length > 0);
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, categories, data } = this.props;
    return _.isUndefined(parentCategoryId) ||
      !this.isCollectionValid(categories) ||
      !this.isCollectionValid(data);
  }

  fetchCategories() {
    const { find, parentCategoryId } = this.props;

    if (!parentCategoryId) {
      return;
    }

    InteractionManager.runAfterInteractions(() =>
      find(CATEGORIES_SCHEMA, undefined, {
        'filter[parent]': parentCategoryId,
      }),
    );
  }

  fetchData(category) {
    const { find } = this.props;
    const { schema } = this.state;

    InteractionManager.runAfterInteractions(() =>
      find(schema, undefined, {
        'filter[categories]': category.id,
      }),
    );
  }

  loadMore() {
    this.props.next(this.props.data);
  }

  refreshData() {
    this.fetchData(this.props.selectedCategory);
  }

  renderPlaceholderView() {
    const { categories, data, parentCategoryId, style } = this.props;

    // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
    // content and reload app, because `parentCategoryId` is retrieved through app configuration
    if (_.isUndefined(parentCategoryId)) {
      return (
        <EmptyStateView
          icon="error"
          message="Please create content and reload your app."
          style={style.emptyState}
        />
      );
    }

    const message = (isError(categories) || isError(data)) ?
      'Unexpected error occurred.' : 'Nothing here at this moment.';

    const retryFunction = !this.isCollectionValid(data) ? this.refreshData : this.fetchCategories;

    return (
      <EmptyStateView
        icon="refresh"
        retryButtonTitle="TRY AGAIN"
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
        titleProperty={"name"}
        valueProperty={"id"}
        onOptionSelected={this.onCategorySelected}
        selectedOption={selectedCategory}
        style={style.categories}
      />
    );
  }

  renderData(data) {
    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const loading = isBusy(data) || !isInitialized(data);
    const { style } = this.props;

    return (
      <ListView
        data={data}
        loading={loading}
        renderRow={this.renderRow}
        onRefresh={this.refreshData}
        onLoadMore={this.loadMore}
        getSectionId={this.getSectionId}
        renderSectionHeader={this.renderSectionHeader}
        style={style.list}
      />
    );
  }

  render() {
    const { data, style } = this.props;

    return (
      <Screen style={style.screen}>
        <NavigationBar {...this.getNavBarProps()} />
        {this.state.renderCategoriesInline ? this.renderCategoriesDropDown('horizontal') : null}
        {this.renderData(data)}
      </Screen>
    );
  }
}
