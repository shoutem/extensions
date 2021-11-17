import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import classNames from 'classnames';
import i18next from 'i18next';
import { reduxForm } from 'redux-form';
import { getFilterableSchemaKeys, getSchemaProperty } from '../../services';
import FiltersFormItem from '../filters-form-item';
import LOCALIZATION from './localization';

const fields = ['filters[].name', 'filters[].operator', 'filters[].value'];

// not using classNames as this is modal and CSS is not working
const styles = {
  filterForm: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 8,
  },
  addFilterBtnContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: 20,
    width: 100,
  },
  addFilterText: {
    fontWeight: 500,
    fontSize: 15,
    paddingLeft: 5,
    paddingTop: 2,
  },
  addFilterIcon: {
    fontSize: 25,
    color: '#bdc0cb',
  },
};

class FiltersForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { schema, fields } = props;

    const filterableSchemaKeys = getFilterableSchemaKeys(schema);
    const categoryOptions = _.map(filterableSchemaKeys, filterableSchemaKey => {
      const schemaProperty = getSchemaProperty(schema, filterableSchemaKey);

      return { label: schemaProperty.title, value: filterableSchemaKey };
    });

    // add empty field if needed on component load
    if (!_.isEmpty(filterableSchemaKeys) && _.isEmpty(fields.filters)) {
      fields.filters.addField();
    }

    this.state = {
      categoryOptions,
    };
  }

  handleRemoveFilter(index) {
    const { fields } = this.props;
    fields.filters.removeField(index);
  }

  handleAddFilter() {
    const { fields } = this.props;
    fields.filters.addField();
  }

  render() {
    const {
      fields: { filters },
      schema,
    } = this.props;
    const { categoryOptions } = this.state;

    const addFilterIconClassName = classNames('se-icon', 'se-icon-add');

    return (
      <div>
        <h4>{i18next.t(LOCALIZATION.CHOOSE_CATEGORY)}</h4>
        <div>
          {_.map(filters, (filter, index) => (
            <FiltersFormItem
              index={index}
              schema={schema}
              filter={filter}
              categoryOptions={categoryOptions}
              onRemove={this.handleRemoveFilter}
            />
          ))}
        </div>
        <div
          style={styles.addFilterBtnContainer}
          onClick={this.handleAddFilter}
        >
          <span
            style={styles.addFilterIcon}
            className={addFilterIconClassName}
          />
          <div style={styles.addFilterText}>
            {i18next.t(LOCALIZATION.ADD_FILTER)}
          </div>
        </div>
      </div>
    );
  }
}

FiltersForm.propTypes = {
  schema: PropTypes.object,
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'filtersForm',
  fields,
})(FiltersForm);
