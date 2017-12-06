import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';

export default class UserGroupModal extends Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleModalEnter = this.handleModalEnter.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleUserGroupNameChange = this.handleUserGroupNameChange.bind(this);

    this.state = {
      inProgress: false,
      currentUserGroup: null,
      show: false,
    };
  }

  show(currentUserGroup) {
    this.setState({
      show: true,
      currentUserGroup,
    });
  }

  handleHide() {
    this.setState({
      inProgress: false,
      show: false,
      currentUserGroup: null,
    });
  }

  handleModalEnter() {
    this.refs.groupName.select();
  }

  handleSaveClick() {
    const { onUserGroupUpdate, onUserGroupCreate } = this.props;
    const { groupName: name, currentUserGroup } = this.state;

    this.setState({ inProgress: true });

    if (currentUserGroup) {
      return onUserGroupUpdate(currentUserGroup.id, { name })
        .then(this.handleHide);
    }

    return onUserGroupCreate(name)
      .then(this.handleHide);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.handleSaveClick();
  }

  handleUserGroupNameChange(event) {
    const groupName = event.target.value;
    this.setState({ groupName });
  }

  render() {
    const {
      inProgress,
      groupName,
      show,
      currentUserGroup,
    } = this.state;

    const initialGroupName = _.get(currentUserGroup, 'name');
    const hasChanges = groupName && initialGroupName !== groupName;
    const modalTitle = initialGroupName ? 'Rename group' : 'Create group';

    return (
      <Modal
        className="settings-page-modal settings-page-modal-small"
        onEnter={this.handleModalEnter}
        onHide={this.handleHide}
        show={show}
      >
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleFormSubmit}>
            <FormGroup>
              <ControlLabel>Enter group name</ControlLabel>
              <input
                autoFocus
                className="form-control"
                defaultValue={initialGroupName}
                onChange={this.handleUserGroupNameChange}
                ref="groupName"
                type="text"
              />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSaveClick}
          >
            <LoaderContainer isLoading={inProgress}>
              Save
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UserGroupModal.propTypes = {
  onUserGroupUpdate: PropTypes.func,
  onUserGroupCreate: PropTypes.func,
};
