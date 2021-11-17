import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import { resolveResourceForm } from '../resource-form';
import {
  mapModelToView,
  mapViewToModel,
  getEditorCreateTitle,
  getEditorUpdateTitle,
} from '../../services';
import './style.scss';

export default class ResourceFormModal extends Component {
  static propTypes = {
    schema: PropTypes.object.required,
    canonicalName: PropTypes.string,
    assetManager: PropTypes.object,
    resource: PropTypes.object,
    googleApiKey: PropTypes.string,
    loadSchema: PropTypes.func,
    loadResources: PropTypes.func,
    onHide: PropTypes.func,
    onResourceCreate: PropTypes.func,
    onResourceUpdate: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { schema, resource } = props;

    this.state = {
      resourceForm: resolveResourceForm(schema),
      initialValues: mapModelToView(schema, resource),
      inProgress: false,
    };
  }

  handleHide() {
    const { onHide } = this.props;

    if (_.isFunction(onHide)) {
      onHide();
    }
  }

  async handleFormSubmit(resource) {
    await this.handleSaveResource(resource);
    this.handleHide();
  }

  async handleSaveResource(resource) {
    const {
      schema,
      resource: initialResource,
      onResourceCreate,
      onResourceUpdate,
    } = this.props;

    const resourceToSave = mapViewToModel(schema, resource);
    const id = _.get(resourceToSave, 'id');

    if (id && _.isFunction(onResourceUpdate)) {
      await onResourceUpdate(resourceToSave, initialResource);
      return;
    }

    if (_.isFunction(onResourceCreate)) {
      await onResourceCreate(resourceToSave);
    }
  }

  render() {
    const {
      resource,
      schema,
      googleApiKey,
      assetManager,
      canonicalName,
      loadSchema,
      loadResources,
    } = this.props;
    const { resourceForm: ResourceForm, initialValues } = this.state;

    const modalTitle = resource
      ? getEditorUpdateTitle(schema)
      : getEditorCreateTitle(schema);

    return (
      <div className="resource-form-modal">
        <div className="resource-form-modal-title-container">
          <Button className="btn-icon pull-left" onClick={this.handleHide}>
            <FontIcon name="back" size="24px" />
          </Button>
          {modalTitle && (
            <h3 className="resource-form-modal-title">{modalTitle}</h3>
          )}
        </div>
        <ResourceForm
          schema={schema}
          canonicalName={canonicalName}
          assetManager={assetManager}
          ownInitialValues={initialValues}
          initialValues={initialValues}
          googleApiKey={googleApiKey}
          loadSchema={loadSchema}
          loadResources={loadResources}
          onCancel={this.handleHide}
          onSubmit={this.handleFormSubmit}
        />
      </div>
    );
  }
}
