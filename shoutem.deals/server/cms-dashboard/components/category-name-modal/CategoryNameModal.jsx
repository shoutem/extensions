import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import i18next from 'i18next';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';

export default class CategoryNameModal extends Component {
  static propTypes = {
    onCategoryUpdate: PropTypes.func,
    onCategoryCreate: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleModalEnter = this.handleModalEnter.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);

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
      ? 'Rename category'
      : 'Create category';

    return (
      <Modal
        className="settings-page-modal settings-page-modal-small"
        onEnter={this.handleModalEnter}
        onHide={this.handleHide}
        show={show}
      >
        <Modal.Header>
          <Modal.Title>{i18next.t(modalTitle)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleFormSubmit}>
            <FormGroup>
              <ControlLabel>{i18next.t('Enter category name')}</ControlLabel>
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
          <Button onClick={this.handleHide}>{i18next.t('Cancel')}</Button>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSaveClick}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t('Save')}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
