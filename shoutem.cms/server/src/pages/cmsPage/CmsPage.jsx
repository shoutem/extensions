import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import classNames from 'classnames';
import Uri from 'urijs';
import {
  shouldLoad,
  shouldRefresh,
  isBusy,
  isValid,
  isInitialized,
} from '@shoutem/redux-io';
import { AssetManager } from '@shoutem/assets-sdk';
import { url, appId, googleApiKey, getShortcut } from 'environment';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { Checkbox, ControlLabel } from 'react-bootstrap';
import {
  getCategory,
  getCategories,
  getChildCategories,
  getImporters,
  getLanguages,
  getRawLanguages,
  getSchema,
  dataInitialized,
  getLanguageModuleStatus,
} from '../../selectors';
import { addSchemasToDenormalizer } from '../../denormalizer';
import { trackEvent } from '../../providers/analytics';
import {
  shoutemUrls,
  renameCategory,
  createResourceWithRelationships,
  updateResourceWithRelationships,
  getMainCategoryId,
  ResourceFormModal,
  getReferencedSchemas,
} from '@shoutem/cms-dashboard';
import {
  loadLanguageModuleStatus,
  loadImporters,
  loadLanguages,
  loadCategories,
  createCategory,
  loadReferenceResources,
  loadSchema,
  updateShortcutSortOptions,
} from '../../actions';
import { updateShortcutSettings } from '../../builder-sdk';
import {
  ManageContentButton,
  SortOptions,
  ExportCmsButton,
} from '../../components';
import AdvancedSetup from '../../fragments/advanced-setup';
import ImporterDashboard from '../../fragments/importer-dashboard';
import ResourceDashboard from '../../fragments/resource-dashboard';
import { CURRENT_SCHEMA } from '../../types';
import {
  resolveHasLanguages,
  isLanguageModuleEnabled,
  translateSchema,
  getSortOptions,
  getParentCategoryId,
  getOriginParentCategoryId,
  getVisibleCategoryIds,
  checkStatusOfImporters,
  getImporterCapabilities,
  canExportData,
  getShortcutTitle,
  getCategoryName,
  isManualSorting,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

const DEBOUNCE = 5000;

export class CmsPage extends PureComponent {
  constructor(props, context) {
    super(props, context);
    autoBindReact(this);

    shoutemUrls.init(url);

    const legacyApiUrl = new Uri(`//${_.get(url, 'legacy')}`)
      .protocol(location.protocol)
      .segment('api')
      .toString();

    this.appsUrl = new Uri(`//${_.get(url, 'apps')}`)
      .protocol(location.protocol)
      .toString();

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: this.appsUrl,
    });

    // debounce to avoid multiple API calls
    this.handleRenameCategory = _.debounce(
      this.handleRenameCategory,
      DEBOUNCE,
      { leading: true, trailing: false },
    );

    const { shortcut, createCategory } = props;

    const importerCapabilites = getImporterCapabilities(shortcut);
    const showImporters = !_.isEmpty(importerCapabilites);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const showAdvancedSetup = !_.isEmpty(visibleCategoryIds);
    const isInAppContentSearchEnabled = _.get(
      props,
      'shortcut.settings.isInAppContentSearchEnabled',
      true,
    );

    // create parent category if not exist !!!
    const parentCategoryId = getParentCategoryId(shortcut);
    if (!parentCategoryId) {
      createCategory(shortcut);
    }

    this.state = {
      legacyApiUrl,
      showImporters,
      showAdvancedSetup,
      showAdditionalOptions: false,
      showResourceModal: false,
      currentResource: null,
      parentCategoryId,
      selectedCategoryId: null,
      isInAppContentSearchEnabled,
    };
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      schema: nextSchema,
      categories: nextCategories,
      shortcut: nextShortcut,
      childCategories: nextChildCategories,
      languageModuleStatus: nextLanguageModuleStatus,
      languages: nextLanguages,
      importers: nextImporters,
    } = nextProps;
    const { schema } = props;
    const { showImporters, selectedCategoryId, parentCategoryId } = this.state;

    const originParentCategoryId = getOriginParentCategoryId(nextShortcut);

    const nextParentCategoryId = getParentCategoryId(nextShortcut);
    if (parentCategoryId !== nextParentCategoryId && nextParentCategoryId) {
      this.setState({
        parentCategoryId: nextParentCategoryId,
        selectedCategoryId: null,
      });
    }

    if (shouldLoad(nextProps, props, 'schema')) {
      this.props.loadSchema();
    }

    if (shouldLoad(nextProps, props, 'languageModuleStatus')) {
      this.props.loadLanguageModuleStatus();
    }

    if (
      isLanguageModuleEnabled(nextLanguageModuleStatus) &&
      shouldRefresh(nextLanguages)
    ) {
      this.props.loadLanguages();
    }

    if (nextParentCategoryId && shouldLoad(nextProps, props, 'categories')) {
      this.props.loadCategories();
    }

    if (nextParentCategoryId && shouldRefresh(nextChildCategories)) {
      this.props.loadChildCategories(nextParentCategoryId);
    }

    if (
      showImporters &&
      nextParentCategoryId &&
      shouldLoad(nextProps, props, 'importers')
    ) {
      this.props.loadImporters(nextParentCategoryId);
    }

    // check if some importer is in progress
    if (showImporters) {
      this.props.checkStatusOfImporters(nextImporters);
    }

    // do not load resources if schema is not initialized
    // we need first to add referenced schemas to storage and denormalizer
    if (!isInitialized(nextSchema)) {
      return;
    }

    // add referenced schemas to denormalizer
    const nextSchemaId = _.get(nextSchema, 'id');
    const schemaId = _.get(schema, 'id');
    if (nextSchemaId !== schemaId) {
      const referencedSchemas = getReferencedSchemas(nextSchema);
      addSchemasToDenormalizer(referencedSchemas);
    }

    // we want that main category ("All") is selected by default
    if (nextParentCategoryId) {
      const mainCategoryId = getMainCategoryId(
        nextParentCategoryId,
        nextCategories,
      );
      if (selectedCategoryId === null && mainCategoryId) {
        this.setState({ selectedCategoryId: mainCategoryId });
      }
    }

    // sync parent category name with shortcut title only if it is origin parent category
    const shortcutTitle = getShortcutTitle(nextShortcut);
    const parentCategory = getCategory(nextParentCategoryId);
    const categoryName = getCategoryName(parentCategory);
    if (
      originParentCategoryId === nextParentCategoryId &&
      isInitialized(parentCategory) &&
      !isBusy(nextCategories) &&
      isValid(nextCategories)
    ) {
      if (shortcutTitle !== categoryName) {
        this.handleRenameCategory(nextParentCategoryId, shortcutTitle);
      }
    }
  }

  handleRenameCategory(categoryId, name) {
    return this.props.renameCategory(categoryId, categoryId, name);
  }

  handleCreateCategory() {
    const { shortcut } = this.props;
    return this.props.createCategory(shortcut);
  }

  handleSortOptionsChange(options) {
    const { shortcut } = this.props;
    this.props.updateSortOptions(shortcut, options);
  }

  handleToggleAdditionalOptions() {
    const { showAdditionalOptions } = this.state;
    this.setState({ showAdditionalOptions: !showAdditionalOptions });
  }

  handleResourceAddClick() {
    this.setState({ showResourceModal: true, currentResource: null });
  }

  handleResourceEditClick(currentResource) {
    this.setState({ showResourceModal: true, currentResource });
  }

  handleResourceModalHide() {
    this.setState({ showResourceModal: false, currentResource: null });
  }

  handleCategorySelected(newSelectedCategoryId) {
    const { selectedCategoryId } = this.state;

    if (selectedCategoryId === newSelectedCategoryId) {
      return;
    }

    this.setState({ selectedCategoryId: newSelectedCategoryId });
  }

  handleCreateResource(resource) {
    const { schema, shortcut } = this.props;
    const { selectedCategoryId } = this.state;

    trackEvent('screens', 'content-item-added', _.get(shortcut, 'screen'));

    return this.props.createResourceWithRelationships(
      [selectedCategoryId],
      CURRENT_SCHEMA,
      schema,
      resource,
    );
  }

  handleUpdateResource(resource, initialResource) {
    const { schema, shortcut } = this.props;

    trackEvent('screens', 'content-item-edited', _.get(shortcut, 'screen'));

    return this.props.updateResourceWithRelationships(
      CURRENT_SCHEMA,
      schema,
      resource,
      initialResource,
    );
  }

  handleToggleEnableSearch() {
    const { shortcut, updateShortcutSettings } = this.props;
    const { isInAppContentSearchEnabled } = this.state;

    this.setState(
      { isInAppContentSearchEnabled: !isInAppContentSearchEnabled },
      () =>
        updateShortcutSettings(shortcut, {
          isInAppContentSearchEnabled: !isInAppContentSearchEnabled,
        }),
    );
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

  renderBody(schema) {
    const {
      appId,
      canonicalName,
      childCategories,
      languages,
      languageModuleStatus,
      rawLanguages,
      importers,
      shortcut,
    } = this.props;
    const {
      legacyApiUrl,
      showAdditionalOptions,
      showImporters,
      selectedCategoryId,
      isInAppContentSearchEnabled,
    } = this.state;

    const hasLanguages = resolveHasLanguages(languageModuleStatus, languages);

    const resolvedLanguages = hasLanguages ? rawLanguages : [];
    const sortOptions = getSortOptions(shortcut);
    const parentCategoryId = getParentCategoryId(shortcut);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const extensionInfo = this.resolveExtensionInfo(shortcut);
    const canExportCmsData = canExportData(shortcut);
    const sortable = isManualSorting(shortcut);

    return (
      <div>
        {extensionInfo && <ControlLabel>{extensionInfo}</ControlLabel>}
        <Checkbox
          className="cms__checkbox-enable-search"
          checked={isInAppContentSearchEnabled}
          name="isInAppContentSearchEnabled"
          onChange={this.handleToggleEnableSearch}
        >
          {i18next.t(LOCALIZATION.ENABLE_SEARCH_IN_APP)}
        </Checkbox>
        <div className="cms__header">
          <SortOptions
            className="pull-left"
            onSortOptionsChange={this.handleSortOptionsChange}
            schema={schema}
            sortOptions={sortOptions}
          />
          <div className="content-options">
            {canExportCmsData && (
              <ExportCmsButton appId={appId} categoryId={parentCategoryId} />
            )}
            <ManageContentButton
              cmsButtonLabel={i18next.t(LOCALIZATION.BUTTON_ADD_ITEM)}
              onNavigateToCmsClick={this.handleResourceAddClick}
              onToggleAdditionalOptions={this.handleToggleAdditionalOptions}
              showAdditionalOptions={showAdditionalOptions}
            />
          </div>
        </div>
        {showAdditionalOptions && (
          <div className="additional-options">
            <AdvancedSetup
              onCreateCategory={this.handleCreateCategory}
              parentCategoryId={parentCategoryId}
              schema={schema}
              shortcut={shortcut}
              visibleCategoryIds={visibleCategoryIds}
              showImporters={showImporters}
            />
            {showImporters && (
              <ImporterDashboard
                appId={appId}
                legacyApiUrl={legacyApiUrl}
                assetManager={this.assetManager}
                languages={resolvedLanguages}
                canonicalName={canonicalName}
                parentCategoryId={parentCategoryId}
                schema={schema}
                shortcut={shortcut}
                importers={importers}
              />
            )}
          </div>
        )}
        {selectedCategoryId && (
          <ResourceDashboard
            appId={appId}
            canonicalName={canonicalName}
            schema={schema}
            shortcut={shortcut}
            parentCategoryId={parentCategoryId}
            languages={resolvedLanguages}
            categories={childCategories}
            selectedCategoryId={selectedCategoryId}
            sortOptions={sortOptions}
            sortable={sortable}
            onCategorySelected={this.handleCategorySelected}
            onResourceEditClick={this.handleResourceEditClick}
          />
        )}
      </div>
    );
  }

  renderModal(schema) {
    const { loadReferenceSchema, loadReferenceResources } = this.props;
    const { currentResource } = this.state;

    return (
      <ResourceFormModal
        schema={schema}
        resource={currentResource}
        googleApiKey={googleApiKey}
        canonicalName={CURRENT_SCHEMA}
        assetManager={this.assetManager}
        loadSchema={loadReferenceSchema}
        loadResources={loadReferenceResources}
        onHide={this.handleResourceModalHide}
        onResourceCreate={this.handleCreateResource}
        onResourceUpdate={this.handleUpdateResource}
      />
    );
  }

  render() {
    const {
      schema,
      shortcut,
      languages,
      languageModuleStatus,
      initialized,
    } = this.props;
    const { showResourceModal, selectedCategoryId } = this.state;

    const isLoading =
      !initialized ||
      !selectedCategoryId ||
      isBusy(languageModuleStatus) ||
      isBusy(languages);

    const translatedSchema = translateSchema(schema);
    const canExportCmsData = canExportData(shortcut);

    const cmsClasses = classNames('cms', {
      'cms-extended': canExportCmsData,
    });

    return (
      <LoaderContainer className={cmsClasses} isLoading={isLoading} isOverlay>
        {!showResourceModal && this.renderBody(translatedSchema)}
        {showResourceModal && this.renderModal(translatedSchema)}
      </LoaderContainer>
    );
  }
}

CmsPage.propTypes = {
  initialized: PropTypes.bool,
  shortcut: PropTypes.object,
  categories: PropTypes.array,
  languageModuleStatus: PropTypes.object,
  languages: PropTypes.array,
  rawLanguages: PropTypes.array,
  importers: PropTypes.array,
  schema: PropTypes.shape({
    titleProperty: PropTypes.string,
  }),
  loadLanguageModuleStatus: PropTypes.func,
  loadImporters: PropTypes.func,
  checkStatusOfImporters: PropTypes.func,
  loadLanguages: PropTypes.func,
  loadCategories: PropTypes.func,
  createCategory: PropTypes.func,
  renameCategory: PropTypes.func,
  loadSchema: PropTypes.func,
  updateSortOptions: PropTypes.func,
  createResourceWithRelationships: PropTypes.func,
  updateResourceWithRelationships: PropTypes.func,
  loadReferenceSchema: PropTypes.func,
  loadReferenceResources: PropTypes.func,
  appId: PropTypes.string,
  canonicalName: PropTypes.string,
  childCategories: PropTypes.array,
  loadChildCategories: PropTypes.func,
};

function mapStateToProps(state) {
  const shortcut = getShortcut();
  const initialized = dataInitialized()(state);

  return {
    appId,
    canonicalName: CURRENT_SCHEMA,
    shortcut,
    initialized,
    categories: getCategories(state),
    childCategories: getChildCategories(state),
    languageModuleStatus: getLanguageModuleStatus(state),
    languages: getLanguages(state),
    rawLanguages: getRawLanguages(state),
    importers: getImporters(state),
    schema: getSchema(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createResourceWithRelationships: (
      categoryIds,
      canonicalName,
      schema,
      resource,
    ) =>
      dispatch(
        createResourceWithRelationships(
          appId,
          categoryIds,
          canonicalName,
          schema,
          resource,
        ),
      ),
    updateResourceWithRelationships: (
      canonicalName,
      schema,
      resource,
      initialResource,
    ) =>
      dispatch(
        updateResourceWithRelationships(
          appId,
          null,
          canonicalName,
          schema,
          resource,
          initialResource,
        ),
      ),
    // if error do nothing, languages are not enabled
    loadLanguageModuleStatus: () => dispatch(loadLanguageModuleStatus()),
    loadImporters: parentCategoryId =>
      dispatch(loadImporters(appId, parentCategoryId)).catch(() => null),
    checkStatusOfImporters: (importers, parentCategoryId) =>
      dispatch(
        checkStatusOfImporters(
          appId,
          parentCategoryId,
          CURRENT_SCHEMA,
          importers,
        ),
      ),
    loadLanguages: () => dispatch(loadLanguages()).catch(() => null),
    loadCategories: () => dispatch(loadCategories()),
    loadChildCategories: (parentCategoryId, schema) =>
      dispatch(loadCategories(parentCategoryId, schema, 'child')),
    loadSchema: () => dispatch(loadSchema()),
    loadReferenceSchema: schema =>
      dispatch(loadSchema(schema, 'reference-schema')),
    loadReferenceResources: schema => dispatch(loadReferenceResources(schema)),
    createCategory: shortcut => dispatch(createCategory(shortcut)),
    updateSortOptions: (shortcut, sortOptions) =>
      dispatch(updateShortcutSortOptions(shortcut, sortOptions)),
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    renameCategory: (parentCategoryId, categoryId, categoryName) =>
      dispatch(
        renameCategory(appId, parentCategoryId, categoryId, categoryName),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPage);
