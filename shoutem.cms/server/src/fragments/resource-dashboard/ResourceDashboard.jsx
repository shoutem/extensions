import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { ConfirmModal } from '@shoutem/react-web-ui';
import {
  createCategory,
  renameCategory,
  deleteCategory,
  deleteResource,
  getMainCategoryId,
  updateResourceCategories,
  updateResourceLanguages,
  CategoryTree,
  CmsTable,
} from '@shoutem/cms-dashboard';
import LOCALIZATION from './localization';
import './style.scss';

export class ResourceDashboard extends Component {
  static propTypes = {
    schema: PropTypes.object,
    parentCategoryId: PropTypes.string,
    selectedCategoryId: PropTypes.string,
    categories: PropTypes.array,
    languages: PropTypes.array,
    updateResourceCategories: PropTypes.func,
    updateResourceLanguages: PropTypes.func,
    createCategory: PropTypes.func,
    renameCategory: PropTypes.func,
    deleteCategory: PropTypes.func,
    deleteResource: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.resourceDeleteModal = createRef();

    this.refreshData = this.refreshData.bind(this);
    this.handleDeleteResourceClick = this.handleDeleteResourceClick.bind(this);
    this.handleCategoryCreate = this.handleCategoryCreate.bind(this);
    this.handleCategoryRename = this.handleCategoryRename.bind(this);
  }

  componentWillMount() {
    this.refreshData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.refreshData(nextProps, this.props);
  }

  refreshData(nextProps, props = {}) {
    const { categories } = props;
    const {
      parentCategoryId: nextParentCategoryId,
      categories: nextCategories,
    } = nextProps;

    if (!_.isEqual(categories, nextCategories)) {
      const mainCategoryId = getMainCategoryId(
        nextParentCategoryId,
        nextCategories,
      );

      this.setState({ mainCategoryId });
    }
  }

  handleCategoryCreate(categoryName) {
    const { parentCategoryId } = this.props;
    return this.props.createCategory(categoryName, parentCategoryId);
  }

  handleCategoryRename(categoryId, categoryName) {
    const { parentCategoryId } = this.props;
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
    const { mainCategoryId } = this.state;
    const {
      selectedCategoryId,
      languages,
      categories,
      resources,
      schema,
    } = this.props;

    const categoryActionWhitelist = {
      [mainCategoryId]: ['rename'],
    };

    return (
      <div className="resources-dashboard">
        <CategoryTree
          categories={categories}
          categoryActionWhitelist={categoryActionWhitelist}
          onCategoryCreate={this.handleCategoryCreate}
          onCategoryUpdate={this.handleCategoryRename}
          onCategoryDelete={this.props.deleteCategory}
          onCategorySelected={this.props.onCategorySelected}
          selectedCategoryId={selectedCategoryId}
          staticCategories={[mainCategoryId]}
        />
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
        <ConfirmModal
          className="resources-dashboard__delete settings-page-modal-small"
          ref={this.resourceDeleteModal}
        />
      </div>
    );
  }
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
  };
}

export default connect(null, mapDispatchToProps)(ResourceDashboard);
