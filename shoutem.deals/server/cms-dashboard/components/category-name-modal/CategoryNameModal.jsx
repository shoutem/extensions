import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';

export default class CategoryNameModal extends Component {
  static propTypes = {
    onCategoryUpdate: PropTypes.func,
    onCategoryCreate: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
      currentCategory: null,
      show: false,
    };
  }

  show(currentCategory) {
    this.setState({
      show: true,
      currentCategory,
    });
  }

  handleHide() {
    this.setState({
      inProgress: false,
      show: false,
      currentCategory: null,
    });
  }

  handleModalEnter() {
    this.refs.categoryName.select();
  }

  handleSaveClick() {
    const { onCategoryCreate, onCategoryUpdate } = this.props;
    const { name, currentCategory } = this.state;

    this.setState({ inProgress: true });

    if (currentCategory) {
      return onCategoryUpdate(currentCategory.id, name).then(this.handleHide);
    }

    return onCategoryCreate(name).then(this.handleHide);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.handleSaveClick();
  }

  handleCategoryNameChange(event) {
    const name = event.target.value;
    this.setState({ name });
  }

  render() {
    const { inProgress, name, show, currentCategory } = this.state;

    const initialCategoryName = _.get(currentCategory, 'name');
    const hasChanges = name && initialCategoryName !== name;
    const modalTitle = initialCategoryName
      ? i18next.t(LOCALIZATION.RENAME_CATEGORY_BUTTON)
      : i18next.t(LOCALIZATION.CREATE_CATEGORY_BUTTON);

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
                {i18next.t(LOCALIZATION.ENTER_CATEGORY_NAME)}
              </ControlLabel>
              <input
                autoFocus
                className="form-control"
                defaultValue={initialCategoryName}
                onChange={this.handleCategoryNameChange}
                ref="categoryName"
                type="text"
              />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>
            {i18next.t(LOCALIZATION.BUTTON_ABORT_LABEL)}
          </Button>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSaveClick}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_CONFIRM_LABEL)}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
