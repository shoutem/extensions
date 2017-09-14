import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import {
  LoaderContainer,
  IconLabel,
  InlineModal,
} from '@shoutem/react-web-ui';
import { isBusy } from '@shoutem/redux-io';
import MemberForm from '../member-form';
import MembersTable from '../members-table';
import './style.scss';

export default class MembersDashboard extends Component {
  constructor(props) {
    super(props);

    this.handleShowMemberModal = this.handleShowMemberModal.bind(this);
    this.handleHideMemberModal = this.handleHideMemberModal.bind(this);
    this.handleAddMemberClick = this.handleAddMemberClick.bind(this);
    this.handleSubmitMember = this.handleSubmitMember.bind(this);
    this.renderMemberModal = this.renderMemberModal.bind(this);

    this.state = {
      showMemberModal: false,
      passwordOnly: false,
      currentMember: null,
      memberExists: false
    }
  }

  handleShowMemberModal(member, passwordOnly = false) {
    this.setState({
      passwordOnly,
      showMemberModal: true,
      currentMember: member,
      memberExists: !_.isEmpty(member),
    });
  }

  handleHideMemberModal() {
    this.setState({
      passwordOnly: false,
      showMemberModal: false,
      currentMember: null,
      memberExists: false,
    })
  }

  handleAddMemberClick() {
    this.handleShowMemberModal();
  }

  handleSubmitMember(member) {
    const { memberExists } = this.state;

    if (memberExists) {
      return this.props.onMemberUpdate(member)
        .then(this.handleHideMemberModal);
    }

    return this.props.onMemberCreate(member)
      .then(this.handleHideMemberModal);
  }

  renderMemberModal() {
    const { userId } = this.props;
    const { passwordOnly, currentMember, memberExists } = this.state;

    const modalTitle = memberExists ? 'Edit app user' : 'Add app user';
    const isOwner = currentMember && currentMember.id === userId;

    return(
      <InlineModal
        onHide={this.handleHideMemberModal}
        title={modalTitle}
      >
        <MemberForm
          initialValues={currentMember}
          onCancel={this.handleHideMemberModal}
          onSubmit={this.handleSubmitMember}
          passwordOnly={passwordOnly}
          canChangeUsername={!isOwner}
        />
      </InlineModal>
    )
  }

  render() {
    const { showMemberModal } = this.state;
    const {
      members,
      onMemberUpdate,
      onMemberDelete,
      userId,
    } = this.props;

    return (
      <div className="members-dashboard">
        {!showMemberModal && (
          <div>
            <div className="members-dashboard__title">
              <h3>App users</h3>
              <Button
                className="btn-icon pull-right"
                onClick={this.handleAddMemberClick}
              >
                <IconLabel iconName="add">
                  Add app user
                </IconLabel>
              </Button>
            </div>
            <LoaderContainer isOverlay isLoading={isBusy(members)}>
              <MembersTable
                members={members}
                onDeleteClick={onMemberDelete}
                onEditClick={this.handleShowMemberModal}
                onMemberUpdate={onMemberUpdate}
                userId={userId}
              />
            </LoaderContainer>
          </div>
        )}
        {showMemberModal && this.renderMemberModal()}
      </div>
    );
  }
}

MembersDashboard.propTypes = {
  members: PropTypes.array,
  onMemberCreate: PropTypes.func,
  onMemberUpdate: PropTypes.func,
  onMemberDelete: PropTypes.func,
  userId: PropTypes.string,
};
