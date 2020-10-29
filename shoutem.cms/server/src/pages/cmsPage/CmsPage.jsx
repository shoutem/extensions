import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  invalidate,
  shouldLoad,
  shouldRefresh,
  isInitialized,
  isValid,
  isBusy,
} from '@shoutem/redux-io';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { ControlLabel } from 'react-bootstrap';
import { getShortcut } from 'environment';
import {
  getCategories,
  getLanguages,
  getRawLanguages,
  getSchema,
  getResources,
  dataInitialized,
} from '../../selectors';
import { updateShortcutSettings } from '../../builder-sdk';
import {
  loadLanguages,
  loadCategories,
  createCategory,
  navigateToCategoryContent,
  loadResources,
  loadSchema,
} from '../../actions';
import {
  ManageContentButton,
  ContentPreview,
  SortOptions,
} from '../../components';
import AdvancedSetup from '../../fragments/advanced-setup';
import { CURRENT_SCHEMA } from '../../types';
import {
  getSortOptions,
  getParentCategoryId,
  getVisibleCategoryIds,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export class CmsPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleOpenInCmsClick = this.handleOpenInCmsClick.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.checkData = this.checkData.bind(this);
    this.handleSortOptionsChange = this.handleSortOptionsChange.bind(this);
    this.handleToggleAdvancedSetup = this.handleToggleAdvancedSetup.bind(this);

    const { shortcut } = props;
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const showAdvancedSetup = !_.isEmpty(visibleCategoryIds);

    this.state = {
      showAdvancedSetup,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { categories, resources, shortcut } = nextProps;

    if (shouldLoad(nextProps, props, 'schema')) {
      this.props.loadSchema();
    }

    if (shouldLoad(nextProps, props, 'languages')) {
      this.props.loadLanguages();
    }

    if (shouldLoad(nextProps, props, 'categories')) {
      this.props.loadCategories();
    }

    if (isValid(categories) && shouldRefresh(resources)) {
      const parentCategoryId = getParentCategoryId(shortcut);

      if (parentCategoryId) {
        const sortOptions = getSortOptions(shortcut);
        const visibleCategoryIds = getVisibleCategoryIds(shortcut);
        this.props.loadResources(
          parentCategoryId,
          visibleCategoryIds,
          sortOptions,
        );
      }
    }
  }

  handleCreateCategory() {
    const { shortcut } = this.props;

    return this.props
      .createCategory(shortcut)
      .then(this.props.navigateToCategory);
  }

  handleSortOptionsChange(options) {
    const { shortcut } = this.props;

    this.props.updateSortOptions(shortcut, options);
  }

  handleToggleAdvancedSetup() {
    const { showAdvancedSetup } = this.state;
    this.setState({ showAdvancedSetup: !showAdvancedSetup });
  }

  handleOpenInCmsClick() {
    const { categories, shortcut } = this.props;

    const parentCategoryId = getParentCategoryId(shortcut);
    const parentCategory = _.find(categories, { id: parentCategoryId });

    if (!parentCategory) {
      return this.handleCreateCategory();
    }

    return this.props.navigateToCategory(parentCategoryId);
  }

  resolveShortcutTitle(shortcut) {
    const defaultShortcutTitle = _.get(
      shortcut,
      'settings.defaultShortcutTitle',
      false,
    );
    return defaultShortcutTitle;
  }

  resolveExtensionTitle(shortcut) {
    const extensionTitle = _.get(shortcut, 'settings.extensionTitle', false);
    return extensionTitle;
  }

  resolveExtensionInfo(shortcut) {
    const defaultShortcutTitle = this.resolveShortcutTitle(shortcut);
    const extensionTitle = this.resolveExtensionTitle(shortcut);

    if (!defaultShortcutTitle && !extensionTitle) {
      return false;
    }

    if (!defaultShortcutTitle && extensionTitle) {
      return i18next.t(LOCALIZATION.SHORTCUT_FROM_EXTENSION, {
        extensionTitle,
      });
    }

    if (defaultShortcutTitle && !extensionTitle) {
      return i18next.t(LOCALIZATION.SHORTCUT_DEFAULT_FROM_UNDEFINED_EXTENSION, {
        defaultShortcutTitle,
      });
    }

    return i18next.t(LOCALIZATION.SHORTCUT_DEFAULT_FROM_EXTENSION, {
      defaultShortcutTitle,
      extensionTitle,
    });
  }

  render() {
    const {
      resources,
      languages,
      rawLanguages,
      schema,
      shortcut,
      initialized,
    } = this.props;
    const { showAdvancedSetup } = this.state;

    const hasContent = initialized && !_.isEmpty(resources);
    const hasLanguages = isInitialized(languages) && !_.isEmpty(languages);
    const cmsButtonLabel = hasContent
      ? i18next.t(LOCALIZATION.BUTTON_EDIT_ITEMS)
      : i18next.t(LOCALIZATION.BUTTON_CREATE_ITEMS);

    const sortOptions = getSortOptions(shortcut);
    const parentCategoryId = getParentCategoryId(shortcut);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const extensionInfo = this.resolveExtensionInfo(shortcut);

    const isLoading = !initialized || isBusy(languages);

    return (
      <LoaderContainer className="cms" isLoading={isLoading}>
        {extensionInfo && <ControlLabel>{extensionInfo}</ControlLabel>}
        <div className="cms__header">
          <SortOptions
            className="pull-left"
            disabled={!hasContent}
            onSortOptionsChange={this.handleSortOptionsChange}
            schema={schema}
            sortOptions={sortOptions}
          />
          <ManageContentButton
            className="pull-right"
            cmsButtonLabel={cmsButtonLabel}
            onNavigateToCmsClick={this.handleOpenInCmsClick}
            onToggleAdvancedSetup={this.handleToggleAdvancedSetup}
            showAdvancedSetup={showAdvancedSetup}
          />
        </div>
        {showAdvancedSetup && (
          <AdvancedSetup
            onCreateCategory={this.handleCreateCategory}
            parentCategoryId={parentCategoryId}
            schema={schema}
            shortcut={shortcut}
            visibleCategoryIds={visibleCategoryIds}
          />
        )}
        <ContentPreview
          hasContent={hasContent}
          hasLanguages={hasLanguages}
          languages={rawLanguages}
          resources={resources}
          titleProp={schema.titleProperty}
        />
      </LoaderContainer>
    );
  }
}

CmsPage.propTypes = {
  shortcut: PropTypes.object,
  resources: PropTypes.array,
  categories: PropTypes.array,
  languages: PropTypes.array,
  rawLanguages: PropTypes.array,
  schema: PropTypes.shape({
    titleProperty: PropTypes.string,
  }),
  loadLanguages: PropTypes.func,
  loadCategories: PropTypes.func,
  createCategory: PropTypes.func,
  navigateToCategory: PropTypes.func,
  loadResources: PropTypes.func,
  loadSchema: PropTypes.func,
  updateSortOptions: PropTypes.func,
  initialized: PropTypes.bool,
};

function mapStateToProps(state) {
  const shortcut = getShortcut();
  const initialized = dataInitialized(shortcut)(state);

  return {
    shortcut,
    initialized,
    categories: getCategories(state),
    languages: getLanguages(state),
    rawLanguages: getRawLanguages(state),
    schema: getSchema(state),
    resources: getResources(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // if error do nothing, languages are not enabled
    loadLanguages: () => dispatch(loadLanguages()).catch(() => null),
    loadCategories: () => dispatch(loadCategories()),
    loadSchema: () => dispatch(loadSchema()),
    loadResources: (categoryId, visibleCategories, sortOptions) =>
      dispatch(loadResources(categoryId, visibleCategories, sortOptions)),
    createCategory: shortcut => dispatch(createCategory(shortcut)),
    navigateToCategory: categoryId => navigateToCategoryContent(categoryId),
    updateSortOptions: (shortcut, sortOptions) =>
      dispatch(updateShortcutSettings(shortcut, sortOptions)).then(() =>
        dispatch(invalidate(CURRENT_SCHEMA)),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPage);
