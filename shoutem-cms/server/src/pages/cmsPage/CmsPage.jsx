import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { invalidate, isInitialized, shouldRefresh, isValid, isBusy } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getShortcut } from 'environment';
import { getCategories, getSchema, getResources, dataInitialized } from '../../selectors';
import { updateShortcutSettings } from '../../builder-sdk';
import {
  loadCategories,
  createCategory,
  navigateToCategoryContent,
  loadResources,
  loadSchema,
} from '../../actions';
import ContentPreview from '../../components/content-preview';
import SortOptions from '../../components/sort-options';
import { CURRENT_SCHEMA } from '../../types';
import { getSortOptions } from '../../services/shortcut';
import './style.scss';

export class CmsPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      creatingCategory: false,
    };

    this.handleOpenInCmsClick = this.handleOpenInCmsClick.bind(this);
    this.createNewCategory = this.createNewCategory.bind(this);
    this.checkData = this.checkData.bind(this);
    this.handleSortOptionsChange = this.handleSortOptionsChange.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.checkData(newProps, true);
  }

  checkData(props, checkIsInitialized = false) {
    const { categories, schema, resources, shortcut } = props;

    if (shouldRefresh(schema)) {
      if (!checkIsInitialized || isInitialized(schema)) {
        this.props.loadSchema();
      }
    }

    if (shouldRefresh(categories)) {
      if (!checkIsInitialized || isInitialized(categories)) {
        this.props.loadCategories();
      }
    }

    if (isValid(categories) && shouldRefresh(resources)) {
      const shortcutSettings = shortcut.settings || {};
      const { parentCategory } = shortcutSettings;

      if (parentCategory && parentCategory.id) {
        const sortOptions = getSortOptions(shortcut);

        this.props.loadResources(parentCategory.id, sortOptions);
      }
    }
  }

  createNewCategory() {
    this.setState({ creatingCategory: true });

    return this.props.createCategory(this.props.shortcut)
      .then(categoryId => {
        this.setState({ creatingCategory: false });
        return categoryId;
      });
  }

  handleSortOptionsChange(options) {
    const { shortcut } = this.props;

    this.props.updateSortOptions(shortcut, options);
  }

  handleOpenInCmsClick() {
    const { shortcut, categories } = this.props;

    const shortcutSettings = shortcut.settings || {};
    const category = shortcutSettings.parentCategory;
    const categoryId = _.get(category, 'id');
    const currentCategory = categoryId && _.find(categories, { id: categoryId });

    if (currentCategory) {
      this.props.navigateToCategory(categoryId);
    } else {
      this.createNewCategory().then(newCategoryId => (
        this.props.navigateToCategory(newCategoryId)
      ));
    }
  }

  render() {
    const { resources, schema, shortcut, initialized } = this.props;
    const { creatingCategory } = this.state;

    const hasContent = initialized && !_.isEmpty(resources);
    const sortOptions = getSortOptions(shortcut);

    return (
      <LoaderContainer className="cms" isLoading={!initialized}>
        <div className="cms__header">
          <SortOptions
            className="pull-left"
            schema={schema}
            disabled={!hasContent}
            sortOptions={sortOptions}
            onSortOptionsChange={this.handleSortOptionsChange}
          />
          <Button
            bsSize="large"
            className="cms__header-items-button pull-right"
            onClick={this.handleOpenInCmsClick}
          >
            <LoaderContainer isLoading={creatingCategory} >
              {hasContent ? 'Edit items' : 'Create items'}
            </LoaderContainer>
          </Button>
        </div>
        <ContentPreview
          resources={resources}
          titleProp={schema.titleProperty}
          hasContent={hasContent}
          inProgress={isBusy(resources)}
        />
      </LoaderContainer>
    );
  }
}

CmsPage.contextTypes = {
  extensionContext: PropTypes.object,
  params: PropTypes.object,
};

CmsPage.propTypes = {
  shortcut: PropTypes.object,
  resources: PropTypes.array,
  categories: PropTypes.array,
  schema: PropTypes.shape({
    titleProperty: PropTypes.string,
  }),
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
  return {
    shortcut,
    initialized: dataInitialized(state, shortcut),
    categories: getCategories(state),
    schema: getSchema(state),
    resources: getResources(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createCategory: (shortcut) => (
      dispatch(createCategory(shortcut))
    ),
    loadCategories: () => dispatch(loadCategories()),
    loadSchema: () => dispatch(loadSchema()),
    loadResources: (categoryId, sortOptions) => dispatch(loadResources(categoryId, sortOptions)),
    navigateToCategory: (categoryId) => (
      navigateToCategoryContent(categoryId)
    ),
    updateSortOptions: (shortcut, sortOptions) => (
      dispatch(updateShortcutSettings(shortcut, sortOptions))
        .then(() => dispatch(invalidate(CURRENT_SCHEMA)))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsPage);
