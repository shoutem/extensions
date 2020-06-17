import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import {
  LoaderContainer,
  IconLabel,
  InlineModal,
  ConfirmModal,
  NestedSortable,
} from '@shoutem/react-web-ui';
import { shouldLoad } from '@shoutem/redux-io';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { isInitialized, isBusy } from '@shoutem/redux-io/status';
import { GroupNode, GroupForm } from '../components';
import {
  getGroups,
  loadGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../redux';
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

  handleOnSelect(groupId) {
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

    this.confirmModal.current.show({
      title: 'Delete group',
      message: `Are you sure you want to delete "${group.name}"? You will lose all users from that group already selected in the settings category.`,
      confirmLabel: 'Delete',
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
            <h3>List of notification groups</h3>
            <Button
              className="btn-icon pull-right"
              onClick={this.handleCreateGroupClick}
            >
              <IconLabel iconName="add">Add group</IconLabel>
            </Button>
          </div>
          {noGroups && (
            <div className="groups-empty-placeholder">No groups yet</div>
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
              title="Add group"
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
