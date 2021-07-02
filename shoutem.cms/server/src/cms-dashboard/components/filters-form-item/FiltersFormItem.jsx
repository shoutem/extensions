import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import classNames from 'classnames';
import i18next from 'i18next';
import { Row, Col, FormGroup } from 'react-bootstrap';
import { SelectReduxFormElement } from '@shoutem/form-builder';
import { getSchemaPropertyOperators } from '../../services';
import { FILTER_OPERATOR_TYPES } from '../../const';
import LOCALIZATION from './localization';

// not using classNames as this is modal and CSS is not working
const styles = {
  filterForm: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 8,
  },
  filterCloseBtn: {
    fontSize: 25,
    color: '#bdc0cb',
    cursor: 'pointer',
  },
};

function getOperatorOptions(operators) {
  return _.compact(
    _.map(operators, operator => {
      if (operator === FILTER_OPERATOR_TYPES.EQUALS) {
        return {
          label: i18next.t(LOCALIZATION.OPEATOR_EQUALS),
          value: operator,
        };
      }

      if (operator === FILTER_OPERATOR_TYPES.LESS_THAN) {
        return {
          label: i18next.t(LOCALIZATION.OPEATOR_LESS_THAN),
          value: operator,
        };
      }

      if (operator === FILTER_OPERATOR_TYPES.GREATER_THAN) {
        return {
          label: i18next.t(LOCALIZATION.OPEATOR_GREATER_THAN),
          value: operator,
        };
      }

      if (operator === FILTER_OPERATOR_TYPES.CONTAINS) {
        return {
          label: i18next.t(LOCALIZATION.OPEATOR_CONTAINS),
          value: operator,
        };
      }

      return null;
    }),
  );
}

export default class FiltersFormItem extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleRemoveFilter() {
    const { index, onRemove } = this.props;

    if (_.isFunction(onRemove)) {
      onRemove(index);
    }
  }

  render() {
    const { schema, filter, categoryOptions } = this.props;

    const category = _.get(filter, 'name.value');
    const operators = getSchemaPropertyOperators(schema, category);
    const operatorOptions = getOperatorOptions(operators);
    const filterCloseBtnClassName = classNames('se-icon', 'se-icon-close');

    return (
      <Row style={styles.filterForm}>
        <Col xs={4}>
          <SelectReduxFormElement
            className="category-picker"
            elementId="category"
            placeholder={i18next.t(LOCALIZATION.SELECT_CATEGORY)}
            field={filter.name}
            clearable={false}
            options={categoryOptions}
          />
        </Col>
        <Col xs={4}>
          <SelectReduxFormElement
            className="operator-picker"
            elementId="operator"
            placeholder={i18next.t(LOCALIZATION.RULE)}
            disabled={!category}
            field={filter.operator}
            clearable={false}
            options={operatorOptions}
          />
        </Col>
        <Col xs={4}>
          <FormGroup className="redux-form-element" controlId="value">
            <input
              className="form-control"
              type="text"
              placeholder={i18next.t(LOCALIZATION.TYPE_IN_VALUE)}
              {...filter.value}
            />
          </FormGroup>
        </Col>
        <span
          style={styles.filterCloseBtn}
          className={filterCloseBtnClassName}
          onClick={this.handleRemoveFilter}
        />
      </Row>
    );
  }
}

FiltersFormItem.propTypes = {
  index: PropTypes.number,
  schema: PropTypes.object,
  filter: PropTypes.object,
  categoryOptions: PropTypes.array,
  onRemove: PropTypes.func,
};
