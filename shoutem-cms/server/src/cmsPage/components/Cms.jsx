import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { isInitialized, shouldRefresh, isValid, isBusy } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getShortcut } from 'environment';
import { getCategories, getSchema, getResources, dataInitialized } from './../selectors';
import {
  loadCategories,
  createCategory,
  navigateToCategoryContent,
  loadResources,
  loadSchema,
} from './../actions';
import ContentTable from './ContentTable';
import './cms.scss';

export class Cms extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      creatingCategory: false,
    };

    this.handleOpenInCmsClick = this.handleOpenInCmsClick.bind(this);
    this.createNewCategory = this.createNewCategory.bind(this);
    this.checkData = this.checkData.bind(this);
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
        this.props.loadResources(parentCategory.id);
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
    const { resources, schema, initialized } = this.props;
    const { creatingCategory } = this.state;

    const hasContent = initialized && !_.isEmpty(resources);

    return (
      <LoaderContainer isLoading={!initialized} className="cms">
        <div className="cms__header">
          <Button
            bsSize="large"
            className="pull-right"
            onClick={this.handleOpenInCmsClick}
          >
            <LoaderContainer isLoading={creatingCategory} >
            {hasContent ? 'Edit items' : 'Create items'}
            </LoaderContainer>
          </Button>
        </div>
        <ContentTable
          resources={resources}
          titleProp={schema.titleProperty}
          hasContent={hasContent}
          inProgress={isBusy(resources)}
        />
      </LoaderContainer>
    );
  }
}

Cms.contextTypes = {
  extensionContext: PropTypes.object,
  params: PropTypes.object,
};

Cms.propTypes = {
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
    loadResources: (categoryId) => dispatch(loadResources(categoryId)),
    navigateToCategory: (categoryId) => (
      navigateToCategoryContent(categoryId)
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cms);
