import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import CategorySelector from '../category-selector';
import LanguageSelector from '../language-selector';
import TextTableColumn from '../text-table-column';

const DEFAULT_DATE_TIME_FORMAT = 'DD MMM YYYY @ hh:mm a';

export default class CmsTableRow extends Component {
  static propTypes = {
    item: PropTypes.object,
    headers: PropTypes.array,
    className: PropTypes.string,
    actionsMenu: PropTypes.node,
    languages: PropTypes.array,
    categories: PropTypes.array,
    mainCategoryId: PropTypes.string,
    onUpdateItemCategories: PropTypes.func,
    onUpdateItemLanguages: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleCategoriesChanged(selectedCategories) {
    const { item } = this.props;
    return this.props.onUpdateItemCategories(selectedCategories, item);
  }

  handleLanguagesChanged(selectedLanguages) {
    const { item } = this.props;
    return this.props.onUpdateItemLanguages(selectedLanguages, item);
  }

  formatValue(header, value) {
    const { languages, categories, mainCategoryId, actionsMenu } = this.props;
    const { format } = header;

    if (format === 'date-time') {
      const dateFormat = _.get(header, 'dateFormat', DEFAULT_DATE_TIME_FORMAT);
      return value ? moment(value).format(dateFormat) : '';
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

    if (format === 'languages') {
      const languageIds = _.map(value, 'id');
      return (
        <LanguageSelector
          languages={languages}
          onSelectionChanged={this.handleLanguagesChanged}
          selectedLanguages={languageIds}
        />
      );
    }

    if (format === 'actions') {
      return actionsMenu;
    }

    return <TextTableColumn value={value} />;
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
    const { headers } = this.props;

    return (
      <tr className="cms-table-row">{_.map(headers, this.renderTableCell)}</tr>
    );
  }
}
