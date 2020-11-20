import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
import CategorySelector from '../category-selector';

const DEFAULT_DATE_TIME_FORMAT = 'DD MMM YYYY @ hh:mm a';

export default class CmsTableRow extends Component {
  static propTypes = {
    item: PropTypes.object,
    headers: PropTypes.array,
    className: PropTypes.string,
    actionsMenu: PropTypes.node,
    categories: PropTypes.array,
    mainCategoryId: PropTypes.string,
    onUpdateItemCategories: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleCategoriesChanged = this.handleCategoriesChanged.bind(this);
    this.formatValue = this.formatValue.bind(this);
    this.renderTableCell = this.renderTableCell.bind(this);
  }

  handleCategoriesChanged(selectedCategories) {
    const { item } = this.props;
    return this.props.onUpdateItemCategories(selectedCategories, item);
  }

  formatValue(header, value) {
    const { categories, mainCategoryId } = this.props;
    const { format } = header;

    if (format === 'date-time') {
      const dateFormat = _.get(header, 'dateFormat', DEFAULT_DATE_TIME_FORMAT);
      return moment(value).format(dateFormat);
    }

    if (format === 'entity-reference') {
      const titleProp = _.get(header, 'titleProperty', 'id');
      return _.get(value, titleProp, '');
    }

    if (format === 'categories') {
      const categoryIds = _.map(value, 'id');
      return (
        <CategorySelector
          categories={categories}
          mainCategoryId={mainCategoryId}
          onSelectionChanged={this.handleCategoriesChanged}
          selectedCategories={categoryIds}
        />
      );
    }

    return value;
  }

  renderTableCell(header) {
    const { item } = this.props;
    const { id: headerId } = header;

    const value = _.get(item, headerId, '');
    const className = `cms-table-row__${headerId}`;

    return (
      <td className={className} key={headerId}>
        {this.formatValue(header, value)}
      </td>
    );
  }

  render() {
    const { headers, actionsMenu } = this.props;

    return (
      <tr className="cms-table-row">
        {_.map(headers, this.renderTableCell)}
        {actionsMenu}
      </tr>
    );
  }
}
