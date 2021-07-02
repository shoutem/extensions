import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import SelectReduxFormElement from '../select-redux-form-element';

export default class EntityReferenceReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    canonicalName: PropTypes.string,
    field: PropTypes.object,
    touch: PropTypes.func,
    loadSchema: PropTypes.func,
    loadResources: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      loading: true,
      titlePropery: null,
      options: [],
    };
  }

  componentDidMount() {
    this.handleInit();
  }

  async handleInit() {
    const { canonicalName, loadSchema, loadResources } = this.props;

    try {
      if (_.isFunction(loadSchema)) {
        const schemaResponse = await loadSchema(canonicalName);
        const titleProperty = _.get(
          schemaResponse,
          'payload.data.attributes.titleProperty',
        );

        this.setState({ titleProperty });

        if (_.isFunction(loadResources)) {
          const resourcesResponse = await loadResources(canonicalName);
          const resources = _.get(resourcesResponse, 'payload.data');

          const options = _.map(resources, resource => {
            const id = _.get(resource, 'id');
            const title = _.get(resource, ['attributes', titleProperty]);

            return { value: id, label: title };
          });

          this.setState({ options });
        }
      }
    } catch (error) {
      // ignore error
    }

    this.setState({ loading: false });
  }

  handleSelectionChanged(newSelectedItem) {
    const { field, touch, canonicalName } = this.props;

    const value = _.get(newSelectedItem, 'value');
    field.onChange({
      id: value,
      type: canonicalName,
    });

    if (_.isFunction(touch)) {
      touch([field.name]);
    }
  }

  handleClose() {
    const { field, touch } = this.props;

    if (_.isFunction(touch)) {
      touch([field.name]);
    }
  }

  render() {
    const { field, name, placeholder, ...otherProps } = this.props;
    const { loading, titleProperty, options } = this.state;

    const value = _.get(field, 'value.id');
    const isEmpty = _.isEmpty(options);

    if (isEmpty && value && titleProperty) {
      const title = _.get(field, ['value', titleProperty]);
      if (title) {
        options.push({ value, label: title });
      }
    }

    const referenceField = _.cloneDeep(field);
    referenceField.value = value;

    return (
      <SelectReduxFormElement
        {...otherProps}
        placeholder={placeholder}
        name={name}
        field={referenceField}
        options={options}
        isLoading={loading}
        onChange={this.handleSelectionChanged}
        onClose={this.handleClose}
      />
    );
  }
}
