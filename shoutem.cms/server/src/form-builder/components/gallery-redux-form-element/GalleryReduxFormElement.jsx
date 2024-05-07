import React, { Component } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImageUploaderReduxFormElement from '../image-uploader-redux-form-element';
import './style.scss';

export default class GalleryReduxFormElement extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;

    // always add empty field on component load
    if (field) {
      field.addField();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { field } = nextProps;

    const emptyImage = _.find(field, item => {
      const url = _.get(item, 'value.url');
      return _.isEmpty(url);
    });

    // add new field if all fields have image
    if (!emptyImage) {
      field.addField();
    }
  }

  renderImageForm(field) {
    const elementId = _.get(field, 'name');

    return (
      <ImageUploaderReduxFormElement
        {...this.props}
        elementId={elementId}
        field={field}
        name={null}
      />
    );
  }

  render() {
    const { name, elementId, field } = this.props;

    return (
      <FormGroup className="gallery-form" controlId={elementId}>
        <ControlLabel>{name}</ControlLabel>
        <div className="fields-container">
          {_.map(field, field => this.renderImageForm(field))}
        </div>
      </FormGroup>
    );
  }
}

GalleryReduxFormElement.propTypes = {
  assetManager: PropTypes.object,
  className: PropTypes.string,
  editorHeight: PropTypes.string,
  editorWidth: PropTypes.string,
  elementId: PropTypes.string,
  field: PropTypes.object,
  folderName: PropTypes.string,
  helpText: PropTypes.string,
  name: PropTypes.string,
};

GalleryReduxFormElement.defaultProps = {
  editorWidth: '150px',
  editorHeight: '150px',
};
