import React, { Component, createRef } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  ConfirmModal,
  IconLabel,
  InlineModal,
  LoaderContainer,
  NestedSortable,
} from '@shoutem/react-web-ui';
import { shouldLoad } from '@shoutem/redux-io';
import { isBusy, isInitialized } from '@shoutem/redux-io/status';
import { GroupForm, GroupNode } from '../components';
import {
  createGroup,
  deleteGroup,
  getGroups,
  loadGroups,
  updateGroup,
} from '../redux';
import LOCALIZATION from './localization';
import './style.scss';

class Groups extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.confirmModal = createRef();

    this.state = {
      showGroupModal: false,
      currentGroup: null,
      groups: null,
      tree: undefined,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  async checkData(nextProps, props = {}) {
    const { appId } = nextProps;

    if (shouldLoad(nextProps, props, 'groups')) {
      this.handleLoadGroups(appId);
    }
  }

  async handleLoadGroups(appId) {
    const { loadGroups } = this.props;

    const action = await loadGroups(appId);
    const groups = _.get(action, 'payload.data', []);

    const tree = _.map(groups, group => ({
      id: group.id,
      name: group.name,
      imageUrl: group.imageUrl,
      isNestable: false,
      isDraggable: true,
      isRoot: false,
      disableDrop: false,
    }));

    this.setState({ groups, tree });
  }

  handleCreateGroupClick() {
    this.setState({ showGroupModal: true, currentGroup: null });
  }

  handleHide() {
    this.setState({ showGroupModal: false, currentGroup: null });
  }

  handleOnSelect() {
    // do nothing
  }

  handleEditClick(groupId) {
    const { groups } = this.state;
    const group = _.find(groups, { id: groupId });

    this.setState({ showGroupModal: true, currentGroup: group });
  }

  handleDeleteClick(groupId) {
    const { appId, deleteGroup } = this.props;
    const { groups } = this.state;
    const group = _.find(groups, { id: groupId });
    const groupName = _.get(group, 'name');

    this.confirmModal.current.show({
      title: i18next.t(LOCALIZATION.DELETE_MODAL_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MODAL_MESSAGE, { groupName }),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_MODAL_CONFIRM_LABEL),
      abortLabel: i18next.t(LOCALIZATION.CONFIRM_MODAL_ABORT_LABEL),
      confirmBsStyle: 'danger',
      onConfirm: () => deleteGroup(appId, groupId),
    });
  }

  async handleFormSubmit(group) {
    const { appId, createGroup, updateGroup } = this.props;
    const groupId = _.get(group, 'id');

    if (groupId) {
      await updateGroup(appId, groupId, group);
      return this.handleHide();
    }

    await createGroup(appId, group);
    return this.handleHide();
  }

  handleOnDragAndDropComplete(source, target) {
    const { appId, updateGroup } = this.props;
    const { groups } = this.state;

    if (!source || !target) {
      return;
    }

    if (source.index === target.index) {
      return;
    }

    const groupId = source.id;
    const group = _.find(groups, { id: groupId });
    const data = { ...group, orderIndex: target.index };

    updateGroup(appId, groupId, data);
  }

  renderGroupNode(templateProps) {
    return (
      <GroupNode
        {...templateProps}
        onEditClick={this.handleEditClick}
        onDeleteClick={this.handleDeleteClick}
      />
    );
  }

  render() {
    const { assetManager, groups: reduxGroups } = this.props;
    const { showGroupModal, groups, tree, currentGroup } = this.state;
    const isLoading = !isInitialized(reduxGroups) || isBusy(reduxGroups);
    const noGroups = _.isEmpty(groups);

    return (
      <div className="groups">
        <LoaderContainer isOverlay isLoading={isLoading}>
          <div className="groups-table__title">
            <h3>{i18next.t(LOCALIZATION.LIST_TITLE)}</h3>
            <Button
              className="btn-icon pull-right"
              onClick={this.handleCreateGroupClick}
            >
              <IconLabel iconName="add">
                {i18next.t(LOCALIZATION.ADD_GROUP_LABEL)}
              </IconLabel>
            </Button>
          </div>
          {noGroups && (
            <div className="groups-empty-placeholder">
              {i18next.t(LOCALIZATION.GROUPS_EMPTY_TEXT)}
            </div>
          )}
          <NestedSortable
            showDragHandle
            className="group-structure"
            tree={tree}
            nodeHeaderTemplate={this.renderGroupNode}
            onSelect={this.handleOnSelect}
            onDragAndDropComplete={this.handleOnDragAndDropComplete}
          />
          {showGroupModal && (
            <InlineModal
              className="groups-page-modal"
              onHide={this.handleHide}
              title={i18next.t(LOCALIZATION.ADD_GROUP_MODAL_TITLE)}
            >
              <GroupForm
                assetManager={assetManager}
                initialValues={currentGroup}
                onCancel={this.handleHide}
                onSubmit={this.handleFormSubmit}
              />
            </InlineModal>
          )}
          <ConfirmModal
            className="settings-page-modal-small"
            ref={this.confirmModal}
          />
        </LoaderContainer>
      </div>
    );
  }
}

Groups.propTypes = {
  appId: PropTypes.string,
  groups: PropTypes.array,
  assetManager: PropTypes.object,
  loadGroups: PropTypes.func,
  createGroup: PropTypes.func,
  updateGroup: PropTypes.func,
  deleteGroup: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    groups: getGroups(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadGroups,
      createGroup,
      updateGroup,
      deleteGroup,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
