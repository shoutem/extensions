import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import ImageUploaderReduxFormElement from '../image-uploader-redux-form-element';
import './style.scss';

export default class GalleryReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    assetManager: PropTypes.object,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
    folderName: PropTypes.string,
    editorWidth: PropTypes.string,
    editorHeight: PropTypes.string,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;

    // always add empty field on component load
    if (field) {
      field.addField();
    }
  }

  componentWillReceiveProps(nextProps) {
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

GalleryReduxFormElement.defaultProps = {
  editorWidth: '150px',
  editorHeight: '150px',
};
