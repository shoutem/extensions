import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Uri from 'urijs';
import {
  invalidate,
  shouldLoad,
  shouldRefresh,
  isBusy,
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
  getLanguages,
  getRawLanguages,
  getSchema,
  getResources,
  dataInitialized,
  getLanguageModuleStatus,
} from '../../selectors';
import { updateShortcutSettings } from '../../builder-sdk';
import {
  shoutemUrls,
  createResource,
  updateResource,
  getMainCategoryId,
  getIncludeProperties,
  getReferencedSchema,
  ResourceFormModal,
} from '@shoutem/cms-dashboard';
import {
  loadLanguageModuleStatus,
  loadLanguages,
  loadCategories,
  createCategory,
  loadResources,
  loadSchema,
} from '../../actions';
import { ManageContentButton, SortOptions } from '../../components';
import AdvancedSetup from '../../fragments/advanced-setup';
import ResourceDashboard from '../../fragments/resource-dashboard';
import { CURRENT_SCHEMA } from '../../types';
import {
  resolveHasLanguages,
  isLanguageModuleEnabled,
  translateSchema,
  getSortOptions,
  getParentCategoryId,
  getVisibleCategoryIds,
  calculateDifferenceObject,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export class CmsPage extends Component {
  constructor(props, context) {
    super(props, context);

    shoutemUrls.init(url);

    const appsUrl = new Uri().host(_.get(url, 'apps')).toString();
    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.checkData = this.checkData.bind(this);
    this.handleLoadResources = this.handleLoadResources.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.handleSortOptionsChange = this.handleSortOptionsChange.bind(this);
    this.handleToggleAdvancedSetup = this.handleToggleAdvancedSetup.bind(this);
    this.handleToggleAdvancedSetup = this.handleToggleAdvancedSetup.bind(this);
    this.handleResourceAddClick = this.handleResourceAddClick.bind(this);
    this.handleResourceEditClick = this.handleResourceEditClick.bind(this);
    this.handleResourceModalHide = this.handleResourceModalHide.bind(this);
    this.handleCategorySelected = this.handleCategorySelected.bind(this);
    this.handleCreateResource = this.handleCreateResource.bind(this);
    this.handleUpdateResource = this.handleUpdateResource.bind(this);
    this.handleUpdateResourceRelationships = this.handleUpdateResourceRelationships.bind(
      this,
    );
    this.renderBody = this.renderBody.bind(this);
    this.renderModal = this.renderModal.bind(this);

    const { shortcut, createCategory } = props;

    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const showAdvancedSetup = !_.isEmpty(visibleCategoryIds);

    // create parent category if not exist !!!
    const parentCategoryId = getParentCategoryId(shortcut);
    if (!parentCategoryId) {
      createCategory(shortcut);
    }

    this.state = {
      showAdvancedSetup,
      showResourceModal: false,
      currentResource: null,
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
      categories,
      resources,
      shortcut,
      childCategories,
      languageModuleStatus,
      languages,
    } = nextProps;
    const { selectedCategoryId } = this.state;
    const parentCategoryId = getParentCategoryId(shortcut);

    if (shouldLoad(nextProps, props, 'schema')) {
      this.props.loadSchema();
    }

    if (shouldLoad(nextProps, props, 'languageModuleStatus')) {
      this.props.loadLanguageModuleStatus();
    }

    if (
      isLanguageModuleEnabled(languageModuleStatus) &&
      shouldRefresh(languages)
    ) {
      this.props.loadLanguages();
    }

    if (parentCategoryId && shouldLoad(nextProps, props, 'categories')) {
      this.props.loadCategories();
    }

    if (selectedCategoryId && shouldRefresh(resources)) {
      this.handleLoadResources(shortcut, selectedCategoryId);
    }

    if (parentCategoryId && shouldRefresh(childCategories)) {
      this.props.loadChildCategories(parentCategoryId);
    }

    // we want that main category ("All") is selected by default
    if (parentCategoryId) {
      const mainCategoryId = getMainCategoryId(parentCategoryId, categories);
      if (selectedCategoryId === null && mainCategoryId) {
        this.handleLoadResources(shortcut, mainCategoryId);
        this.setState({ selectedCategoryId: mainCategoryId });
      }
    }
  }

  handleLoadResources(shortcut, categoryId) {
    const { schema } = this.props;

    const sortOptions = getSortOptions(shortcut);
    const visibleCategoryIds = getVisibleCategoryIds(shortcut);
    const include = getIncludeProperties(schema);

    this.props.loadResources(
      categoryId,
      visibleCategoryIds,
      sortOptions,
      include,
    );
  }

  handleCreateCategory() {
    const { shortcut } = this.props;
    return this.props.createCategory(shortcut);
  }

  handleSortOptionsChange(options) {
    const { shortcut } = this.props;
    this.props.updateSortOptions(shortcut, options);
  }

  handleToggleAdvancedSetup() {
    const { showAdvancedSetup } = this.state;
    this.setState({ showAdvancedSetup: !showAdvancedSetup });
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
    const { shortcut } = this.props;
    const { selectedCategoryId } = this.state;

    if (selectedCategoryId === newSelectedCategoryId) {
      return;
    }

    this.setState({ selectedCategoryId: newSelectedCategoryId });
    this.handleLoadResources(shortcut, newSelectedCategoryId);
  }

  async handleCreateResourceRelationship(schema, key, value) {
    const response = await this.props.createResource(schema, null, value);

    const resourceId = _.get(response, 'payload.data.id');
    const relationships = {
      [key]: {
        data: {
          id: resourceId,
          type: schema,
        },
      },
    };

    return relationships;
  }

  async handleUpdateResourceRelationship(schema, key, value) {
    const response = await this.props.updateResource(schema, value);

    const resourceId = _.get(response, 'payload.data.id');
    const relationships = {
      [key]: {
        data: {
          id: resourceId,
          type: schema,
        },
      },
    };

    return relationships;
  }

  async handleUpdateResourceRelationships(resource, initialResource) {
    const { schema } = this.props;
    let relationships = {};
    const promises = [];

    const include = getIncludeProperties(schema);

    _.forEach(include, key => {
      const referencedSchema = getReferencedSchema(schema, key);

      // TODO: support multiple relationshsips, check if value is an array
      const value = _.get(resource, key);
      const initialValue = _.get(initialResource, key);
      const id = _.get(value, 'id');

      // if id exist that means that relationship already exist
      // no need for creating a new resource relationship
      if (id) {
        const changes = calculateDifferenceObject(value, initialValue);

        // if changes update relationship resource
        if (!_.isEmpty(changes)) {
          promises.push(
            this.handleUpdateResourceRelationship(referencedSchema, key, value),
          );
        } else {
          const relationship = { data: { id, type: referencedSchema } };
          _.set(relationships, key, relationship);
        }
      } else {
        if (!_.isEmpty(value)) {
          promises.push(
            this.handleCreateResourceRelationship(referencedSchema, key, value),
          );
        }
      }

      // remove referenced item from attributes
      _.unset(resource, key);
    });

    const values = await Promise.all(promises);
    _.forEach(values, relationship => {
      relationships = _.merge(relationships, relationship);
    });

    return relationships;
  }

  async handleCreateResource(resource) {
    const { selectedCategoryId } = this.state;

    const relationships = await this.handleUpdateResourceRelationships(
      resource,
    );

    await this.props.createResource(
      CURRENT_SCHEMA,
      [selectedCategoryId],
      resource,
      relationships,
    );
  }

  async handleUpdateResource(resource, initialResource) {
    const relationships = await this.handleUpdateResourceRelationships(
      resource,
      initialResource,
    );

    await this.props.updateResource(CURRENT_SCHEMA, resource, relationships);
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
      resources,
      languages,
      languageModuleStatus,
      rawLanguages,
      shortcut,
      initialized,
    } = this.props;
    const { showAdvancedSetup, selectedCategoryId } = this.state;

    const hasContent = initialized && !_.isEmpty(resources);
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
            disabled={!hasContent}
            onSortOptionsChange={this.handleSortOptionsChange}
            schema={schema}
            sortOptions={sortOptions}
          />
          <ManageContentButton
            className="pull-right"
            cmsButtonLabel={i18next.t(LOCALIZATION.BUTTON_ADD_ITEM)}
            onNavigateToCmsClick={this.handleResourceAddClick}
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
        <ResourceDashboard
          appId={appId}
          canonicalName={canonicalName}
          schema={schema}
          parentCategoryId={parentCategoryId}
          languages={resolvedLanguages}
          categories={childCategories}
          resources={resources}
          selectedCategoryId={selectedCategoryId}
          onCategorySelected={this.handleCategorySelected}
          onResourceEditClick={this.handleResourceEditClick}
        />
      </div>
    );
  }

  renderModal(schema) {
    const { currentResource } = this.state;

    return (
      <ResourceFormModal
        schema={schema}
        resource={currentResource}
        googleApiKey={googleApiKey}
        canonicalName={CURRENT_SCHEMA}
        assetManager={this.assetManager}
        onHide={this.handleResourceModalHide}
        onResourceCreate={this.handleCreateResource}
        onResourceUpdate={this.handleUpdateResource}
      />
    );
  }

  render() {
    const {
      schema,
      resources,
      languages,
      languageModuleStatus,
      initialized,
    } = this.props;
    const { showResourceModal } = this.state;

    const isLoading =
      !initialized || isBusy(languageModuleStatus) || isBusy(languages);
    const inProgress = initialized && isBusy(resources);

    const translatedSchema = translateSchema(schema);

    return (
      <LoaderContainer
        className="cms"
        isLoading={isLoading || inProgress}
        isOverlay={inProgress}
      >
        {!showResourceModal && this.renderBody(translatedSchema)}
        {showResourceModal && this.renderModal(translatedSchema)}
      </LoaderContainer>
    );
  }
}

CmsPage.propTypes = {
  initialized: PropTypes.bool,
  shortcut: PropTypes.object,
  resources: PropTypes.array,
  categories: PropTypes.array,
  languageModuleStatus: PropTypes.object,
  languages: PropTypes.array,
  rawLanguages: PropTypes.array,
  schema: PropTypes.shape({
    titleProperty: PropTypes.string,
  }),
  loadLanguageModuleStatus: PropTypes.func,
  loadLanguages: PropTypes.func,
  loadCategories: PropTypes.func,
  createCategory: PropTypes.func,
  loadResources: PropTypes.func,
  loadSchema: PropTypes.func,
  updateSortOptions: PropTypes.func,
  createResource: PropTypes.func,
  updateResource: PropTypes.func,
};

function mapStateToProps(state) {
  const shortcut = getShortcut();
  const initialized = dataInitialized(shortcut)(state);

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
    schema: getSchema(state),
    resources: getResources(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createResource: (schema, categoryIds, resource, relationships) =>
      dispatch(
        createResource(appId, categoryIds, schema, resource, relationships),
      ),
    updateResource: (schema, resource, relationships) =>
      dispatch(updateResource(appId, null, schema, resource, relationships)),
    // if error do nothing, languages are not enabled
    loadLanguageModuleStatus: () => dispatch(loadLanguageModuleStatus()),
    loadLanguages: () => dispatch(loadLanguages()).catch(() => null),
    loadCategories: () => dispatch(loadCategories()),
    loadChildCategories: (parentCategoryId, schema) =>
      dispatch(loadCategories(parentCategoryId, schema, 'child')),
    loadSchema: () => dispatch(loadSchema()),
    loadResources: (categoryId, visibleCategories, sortOptions, include) =>
      dispatch(
        loadResources(
          CURRENT_SCHEMA,
          categoryId,
          visibleCategories,
          sortOptions,
          include,
        ),
      ),
    createCategory: shortcut => dispatch(createCategory(shortcut)),
    updateSortOptions: (shortcut, sortOptions) =>
      dispatch(updateShortcutSettings(shortcut, sortOptions)).then(() =>
        dispatch(invalidate(CURRENT_SCHEMA)),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPage);
