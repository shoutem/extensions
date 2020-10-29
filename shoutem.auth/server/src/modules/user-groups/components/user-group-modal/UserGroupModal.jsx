import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';

export default class UserGroupModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

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
      return onUserGroupUpdate(currentUserGroup.id, { name }).then(
        this.handleHide,
      );
    }

    return onUserGroupCreate(name).then(this.handleHide);
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
    const { inProgress, groupName, show, currentUserGroup } = this.state;

    const initialGroupName = _.get(currentUserGroup, 'name');
    const hasChanges = groupName && initialGroupName !== groupName;
    const modalTitle = initialGroupName
      ? i18next.t(LOCALIZATION.RENAME_GROUP_TITLE)
      : i18next.t(LOCALIZATION.CREATE_GROUP_TITLE);

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
              <ControlLabel>
                {i18next.t(LOCALIZATION.FORM_GROUP_NAME_TITLE)}
              </ControlLabel>
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
          <Button onClick={this.handleHide}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL_TITLE)}
          </Button>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSaveClick}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_SUBMIT_TITLE)}
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
