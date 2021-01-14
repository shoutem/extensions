import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Uri from 'urijs';
import {
  shouldLoad,
  shouldRefresh,
  isBusy,
  isInitialized,
} from '@shoutem/redux-io';
import { AssetManager } from '@shoutem/assets-sdk';
import { url, appId, googleApiKey } from 'environment';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { ControlLabel } from 'react-bootstrap';
import { getShortcut } from 'environment';
import {
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
import {
  shoutemUrls,
  createResourceWithRelationships,
  updateResourceWithRelationships,
  getMainCategoryId,
  ResourceFormModal,
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
import { ManageContentButton, SortOptions } from '../../components';
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
  getVisibleCategoryIds,
  checkStatusOfImporters,
  getImporterCapabilities,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';
import { getReferencedSchemas } from '../../cms-dashboard';

export class CmsPage extends Component {
  constructor(props, context) {
    super(props, context);

    shoutemUrls.init(url);

    const legacyApiUrl = new Uri(`//${_.get(url, 'legacy')}`)
      .protocol(location.protocol)
      .segment('api')
      .toString();

    const appsUrl = new Uri(`//${_.get(url, 'apps')}`)
      .protocol(location.protocol)
      .toString();

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.checkData = this.checkData.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.handleSortOptionsChange = this.handleSortOptionsChange.bind(this);
    this.handleToggleAdditionalOptions = this.handleToggleAdditionalOptions.bind(
      this,
    );
    this.handleResourceAddClick = this.handleResourceAddClick.bind(this);
    this.handleResourceEditClick = this.handleResourceEditClick.bind(this);
    this.handleResourceModalHide = this.handleResourceModalHide.bind(this);
    this.handleCategorySelected = this.handleCategorySelected.bind(this);
    this.handleCreateResource = this.handleCreateResource.bind(this);
    this.handleUpdateResource = this.handleUpdateResource.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.renderModal = this.renderModal.bind(this);

    const { shortcut, createCategory } = props;

    const importerCapabilites = getImporterCapabilities(shortcut);
    const showImporters = !_.isEmpty(importerCapabilites);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const showAdvancedSetup = !_.isEmpty(visibleCategoryIds);

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
      parentCategoryId: parentCategoryId,
      selectedCategoryId: null,
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
    const { schema } = this.props;
    const { selectedCategoryId } = this.state;

    return this.props.createResourceWithRelationships(
      [selectedCategoryId],
      CURRENT_SCHEMA,
      schema,
      resource,
    );
  }

  handleUpdateResource(resource, initialResource) {
    const { schema } = this.props;

    return this.props.updateResourceWithRelationships(
      CURRENT_SCHEMA,
      schema,
      resource,
      initialResource,
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
    } = this.state;

    const hasLanguages = resolveHasLanguages(languageModuleStatus, languages);

    const resolvedLanguages = hasLanguages ? rawLanguages : [];
    const sortOptions = getSortOptions(shortcut);
    const parentCategoryId = getParentCategoryId(shortcut);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const extensionInfo = this.resolveExtensionInfo(shortcut);

    return (
      <div>
        {extensionInfo && <ControlLabel>{extensionInfo}</ControlLabel>}
        <div className="cms__header">
          <SortOptions
            className="pull-left"
            onSortOptionsChange={this.handleSortOptionsChange}
            schema={schema}
            sortOptions={sortOptions}
          />
          <ManageContentButton
            className="pull-right"
            cmsButtonLabel={i18next.t(LOCALIZATION.BUTTON_ADD_ITEM)}
            onNavigateToCmsClick={this.handleResourceAddClick}
            onToggleAdditionalOptions={this.handleToggleAdditionalOptions}
            showAdditionalOptions={showAdditionalOptions}
          />
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
            parentCategoryId={parentCategoryId}
            languages={resolvedLanguages}
            categories={childCategories}
            selectedCategoryId={selectedCategoryId}
            sortOptions={sortOptions}
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
    const { schema, languages, languageModuleStatus, initialized } = this.props;
    const { showResourceModal, selectedCategoryId } = this.state;

    const isLoading =
      !initialized ||
      !selectedCategoryId ||
      isBusy(languageModuleStatus) ||
      isBusy(languages);

    const translatedSchema = translateSchema(schema);

    return (
      <LoaderContainer className="cms" isLoading={isLoading} isOverlay>
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
  loadSchema: PropTypes.func,
  updateSortOptions: PropTypes.func,
  createResourceWithRelationships: PropTypes.func,
  updateResourceWithRelationships: PropTypes.func,
  loadReferenceSchema: PropTypes.func,
  loadReferenceResources: PropTypes.func,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPage);
