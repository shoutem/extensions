import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Row,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import ext from 'src/const';
import { getFormState } from 'src/redux';
import {
  ImageUploader,
  LoaderContainer,
  ReduxFormElement,
  Switch,
} from '@shoutem/react-web-ui';
import { validateGroup } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

class GroupForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleImageUploadSuccess(url) {
    const {
      fields: { imageUrl },
      touch,
    } = this.props;

    imageUrl.onChange(url);
    touch(['imageUrl']);
  }

  handleImageDeleteSuccess() {
    const {
      fields: { imageUrl },
      touch,
    } = this.props;
    imageUrl.onChange('');
    touch(['imageUrl']);
  }

  resolveFilename(file) {
    const timestamp = new Date().getTime();
    const fileName = file.name ? `${timestamp}-${file.name}` : `${timestamp}`;

    return fileName;
  }

  render() {
    const {
      assetManager,
      submitting,
      invalid,
      fields: { id, name, imageUrl, subscribeByDefault },
      onCancel,
      handleSubmit,
      error,
    } = this.props;

    const inEditMode = !!id.value;
    const isImageError = imageUrl.touched && imageUrl.error;

    return (
      <form className="group-form" onSubmit={handleSubmit}>
        <Row>
          <ReduxFormElement
            elementId="name"
            name={i18next.t(LOCALIZATION.FORM_NAME_INPUT_DESCRIPTION)}
            maxLength={255}
            disabled={submitting}
            field={name}
          />
        </Row>
        <Row>
          <FormGroup
            controlId="imageUrl"
            validationState={isImageError ? 'error' : 'success'}
          >
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_IMAGE_LABEL)}
            </ControlLabel>
            <ImageUploader
              onUploadSuccess={this.handleImageUploadSuccess}
              onDeleteSuccess={this.handleImageDeleteSuccess}
              resolveFilename={this.resolveFilename}
              src={imageUrl.value}
              elementId="imageUrl"
              helpText={i18next.t(LOCALIZATION.FORM_IMAGE_HELP_TEXT)}
              previewSize="custom"
              width={120}
              height={120}
              folderName={ext()}
              assetManager={assetManager}
              disabled={submitting}
              preview={imageUrl.value}
              field={imageUrl}
            />
            <div className="has-error image-error">
              {isImageError && <HelpBlock>{imageUrl.error}</HelpBlock>}
            </div>
          </FormGroup>
        </Row>
        <Row className="switch">
          <ReduxFormElement
            disabled={submitting}
            elementId="subscribeByDefault"
            field={subscribeByDefault}
            name={i18next.t(LOCALIZATION.SUBSCRIBE_TOGGLE_TEXT)}
          >
            <Switch />
          </ReduxFormElement>
        </Row>
        <ButtonToolbar>
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={submitting || invalid}
            type="submit"
          >
            <LoaderContainer isLoading={submitting}>
              {inEditMode
                ? i18next.t(LOCALIZATION.BUTTON_SAVE)
                : i18next.t(LOCALIZATION.BUTTON_ADD)}
            </LoaderContainer>
          </Button>
          <Button bsSize="large" disabled={submitting} onClick={onCancel}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
          </Button>
        </ButtonToolbar>
        {error && (
          <div className="has-error">
            <HelpBlock>{error}</HelpBlock>
          </div>
        )}
      </form>
    );
  }
}

GroupForm.propTypes = {
  assetManager: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  touch: PropTypes.func,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'groupForm',
  fields: ['id', 'name', 'imageUrl', 'subscribeByDefault'],
  validate: validateGroup,
})(GroupForm);
