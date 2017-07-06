import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { FontIcon, IconLabel } from '@shoutem/react-web-ui';
import './style.scss';

const UNSUPPORTED_FORMATS = [
  'array',
  'object',
  'multi-line',
  'attachment',
  'html',
  'location',
  'uri',
  'entity-reference',
  'entity-reference-array',
];

const resolveDisplayOrderIcon = (currentOrder) => (
  currentOrder === 'ascending' ? 'order-ascending' : 'order-descending'
);

class SortOptions extends Component {
  constructor(props) {
    super(props);

    this.onFieldChange = this.onFieldChange.bind(this);
    this.onOrderingChange = this.onOrderingChange.bind(this);
    this.calculateDisplayProperties = this.calculateDisplayProperties.bind(this);

    this.state = {
      currentField: null,
      currentOrder: null,
      displayFields: [],
    };
  }

  componentWillMount() {
    const { schema, sortOptions } = this.props;

    this.calculateDisplayProperties(schema, sortOptions);
  }

  componentWillReceiveProps(nextProps) {
    const { schema, sortOptions } = nextProps;

    this.calculateDisplayProperties(schema, sortOptions);
  }

  onFieldChange(field) {
    const { onSortOptionsChange } = this.props;
    const { currentOrder } = this.state;

    this.setState({ currentField: field });

    onSortOptionsChange({
      sortField: field,
      sortOrder: currentOrder,
    });
  }

  onOrderingChange(order) {
    const { onSortOptionsChange } = this.props;
    const { currentField } = this.state;

    this.setState({ currentOrder: order });

    onSortOptionsChange({
      sortField: currentField.name,
      sortOrder: order,
    });
  }

  calculateDisplayProperties(schema, sortOptions) {
    const properties = _.get(schema, 'properties');
    if (_.isEmpty(properties)) {
      return;
    }

    const fields = _.map(properties, (field, name) => ({
      ...field,
      name,
    }));
    const displayFields = _.filter(fields, (property) => (
      !_.includes(UNSUPPORTED_FORMATS, property.format)
    ));

    // resolve field and order or set defaults
    const field = _.get(sortOptions, 'field', 'name');
    const order = _.get(sortOptions, 'order', 'ascending');

    const currentField = _.get(properties, [field]);

    this.setState({
      displayFields,
      currentField,
      currentOrder: order,
    });
  }

  render() {
    const { className, disabled } = this.props;
    const { currentField, currentOrder, displayFields } = this.state;

    const classes = classNames('sort-options', className);

    const displayFieldTitle = _.get(currentField, 'title', '');
    const displayFieldLabel = `Sort by ${displayFieldTitle}`;
    const displayOrder = _.upperFirst(currentOrder);

    return (
      <div className={classes}>
        <Dropdown
          className="sort-options__field-selector"
          onSelect={this.onFieldChange}
          disabled={disabled}
        >
          <Dropdown.Toggle>
            {displayFieldLabel}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem>
              {displayFieldTitle}
            </MenuItem>
            <MenuItem divider />
            {displayFields.map((field) =>
              <MenuItem key={field.name} eventKey={field.name}>
                {field.title}
              </MenuItem>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          onSelect={this.onOrderingChange}
          disabled={disabled}
          className="sort-options__order-selector"
        >
          <Dropdown.Toggle>
            <FontIcon
              name={resolveDisplayOrderIcon(currentOrder)}
              size="24px"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem>
              <IconLabel
                className="sort-options__order-icon"
                iconName={resolveDisplayOrderIcon(currentOrder)}
                size="24px"
              />
              {displayOrder}
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="ascending">
              <IconLabel
                iconName="order-ascending"
                size="24px"
              >
                Ascending
              </IconLabel>
            </MenuItem>
            <MenuItem eventKey="descending">
              <IconLabel
                iconName="order-descending"
                size="24px"
              >
                Descending
              </IconLabel>
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

SortOptions.propTypes = {
  schema: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  sortOptions: PropTypes.object,
  onSortOptionsChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SortOptions.defaultProps = {
  onSortOptionsChange: _.noop(),
};

export default SortOptions;
