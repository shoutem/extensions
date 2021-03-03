import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { shouldLoad, shouldRefresh } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { loadCategories, updateShortcutCategories } from '../../actions';
import {
  ParentCategorySelector,
  ChildCategorySelector,
  ToggleContent,
} from '../../components';
import { getCategories } from '../../selectors';
import { ALL_CATEGORIES_OPTION_KEY } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function getVisibleCategoryIds(visibleCategoryIds) {
  // keyword 'all' in 'visibleCategoryIds' is used only on settings page UI,
  // to properly display checkbox named 'All categories'.
  // When saving it to settings or using it as category filter on API, we just need to
  // send empty array.
  const allCategoriesSelected = _.includes(
    visibleCategoryIds,
    ALL_CATEGORIES_OPTION_KEY,
  );
  return allCategoriesSelected ? [] : visibleCategoryIds;
}

export class AdvancedSetup extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { parentCategoryId, visibleCategoryIds } = props;

    this.state = {
      parentCategoryId,
      visibleCategoryIds,
      createCategoryInProgress: false,
      saveInProgress: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { parentCategoryId } = props;
    const {
      parentCategoryId: nextParentCategoryId,
      childCategories: nextChildCategories,
    } = nextProps;

    if (parentCategoryId !== nextParentCategoryId) {
      this.setState({ parentCategoryId: nextParentCategoryId });
    }

    if (shouldLoad(nextProps, props, 'rootCategories')) {
      this.props.loadRootCategories();
    }

    if (nextParentCategoryId && shouldRefresh(nextChildCategories)) {
      this.props.loadChildCategories(nextParentCategoryId);
    }
  }

  handleSave() {
    const { parentCategoryId, visibleCategoryIds } = this.state;
    this.setState({ saveInProgress: true });

    const resolvedVisibleCategoryIds = getVisibleCategoryIds(
      visibleCategoryIds,
    );
    this.props
      .updateAdvancedOptions(parentCategoryId, resolvedVisibleCategoryIds)
      .then(() => this.setState({ saveInProgress: false }));
  }

  handleCancel() {
    const { parentCategoryId, visibleCategoryIds } = this.props;

    this.setState({
      parentCategoryId,
      visibleCategoryIds,
    });

    this.props.loadChildCategories(parentCategoryId);
  }

  handleParentCategoryChange(parentCategoryId) {
    this.setState({
      parentCategoryId,
      visibleCategoryIds: [],
    });

    this.props.loadChildCategories(parentCategoryId);
  }

  handleVisibleCategoriesChange(visibleCategoryIds = []) {
    this.setState({ visibleCategoryIds });
  }

  handleCreateCategory() {
    this.setState({ createCategoryInProgress: true });

    this.props
      .onCreateCategory()
      .then(() => this.setState({ createCategoryInProgress: false }));
  }

  render() {
    const {
      rootCategories,
      childCategories,
      parentCategoryId,
      visibleCategoryIds,
      schema,
      showImporters,
    } = this.props;

    const {
      parentCategoryId: currentParentCategoryId,
      visibleCategoryIds: currentVisibleCategoryIds,
      createCategoryInProgress,
      saveInProgress,
    } = this.state;

    const actionButtonsDisabled =
      parentCategoryId === currentParentCategoryId &&
      _.isEqual(visibleCategoryIds, currentVisibleCategoryIds);

    const formClasses = classNames({
      form: showImporters,
    });

    return (
      <ToggleContent title={i18next.t(LOCALIZATION.TITLE)}>
        <LoaderContainer
          className="advanced-setup"
          isLoading={createCategoryInProgress}
          isOverlay
        >
          <form className={formClasses}>
            <Row>
              <Col md={6}>
                <ParentCategorySelector
                  categories={rootCategories}
                  onCategorySelected={this.handleParentCategoryChange}
                  onCreateCategorySelected={this.handleCreateCategory}
                  parentCategoryId={currentParentCategoryId}
                  schemaTitle={schema.title}
                />
              </Col>
              <Col md={6}>
                <ChildCategorySelector
                  categories={childCategories}
                  disabled={!currentParentCategoryId}
                  onVisibleCategoriesChange={this.handleVisibleCategoriesChange}
                  visibleCategoryIds={currentVisibleCategoryIds}
                />
              </Col>
            </Row>
            <ButtonGroup className="advanced-setup__btns">
              <Button
                bsStyle="primary"
                disabled={actionButtonsDisabled}
                onClick={this.handleSave}
              >
                <LoaderContainer isLoading={saveInProgress}>
                  {i18next.t(LOCALIZATION.BUTTON_SAVE)}
                </LoaderContainer>
              </Button>
              <Button
                disabled={actionButtonsDisabled}
                onClick={this.handleCancel}
              >
                {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
              </Button>
            </ButtonGroup>
          </form>
          {showImporters && <div className="divider" />}
        </LoaderContainer>
      </ToggleContent>
    );
  }
}

AdvancedSetup.propTypes = {
  schema: PropTypes.object,
  shortcut: PropTypes.object,
  rootCategories: PropTypes.array,
  childCategories: PropTypes.array,
  parentCategoryId: PropTypes.string,
  visibleCategoryIds: PropTypes.array,
  showImporters: PropTypes.bool,
  loadRootCategories: PropTypes.func,
  loadChildCategories: PropTypes.func,
  onCreateCategory: PropTypes.func,
  updateAdvancedOptions: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    rootCategories: getCategories(state, 'advancedParent'),
    childCategories: getCategories(state, 'advancedChild'),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { schema: fullSchema, shortcut } = ownProps;
  const { canonicalName: schema } = fullSchema;

  return {
    loadRootCategories: () =>
      dispatch(loadCategories('null', schema, 'advancedParent')),
    loadChildCategories: parentCategoryId =>
      dispatch(loadCategories(parentCategoryId, schema, 'advancedChild')),
    updateAdvancedOptions: (parentCategoryId, visibleCategoryIds) =>
      dispatch(
        updateShortcutCategories(
          shortcut,
          parentCategoryId,
          visibleCategoryIds,
          schema,
        ),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSetup);
