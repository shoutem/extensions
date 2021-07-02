import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import Select from 'react-select';
import LOCALIZATION from './localization';

export default class ImporterCsvMappingItem extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { cmsOption } = props;
    const key = _.get(cmsOption, 'value');
    const cmsHeaderId = `cms_${key}`;
    const csvHeaderId = `csv_${key}`;

    this.state = {
      cmsHeaderId,
      csvHeaderId,
      value: null,
    };
  }

  handleChange(csvOption) {
    const { cmsOption } = this.props;

    const key = _.get(cmsOption, 'value');
    const value = _.get(csvOption, 'value');

    this.setState({ value });

    return this.props.onChange(key, value);
  }

  render() {
    const { cmsOption, csvOptions } = this.props;
    const { cmsHeaderId, csvHeaderId, value } = this.state;

    const title = _.get(cmsOption, 'label');

    return (
      <tr>
        <td key={cmsHeaderId}>{title}</td>
        <td key={csvHeaderId}>
          <Select
            placeholder={i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_LABEL)}
            onChange={this.handleChange}
            options={csvOptions}
            value={value}
          />
        </td>
      </tr>
    );
  }
}

ImporterCsvMappingItem.propTypes = {
  cmsOption: PropTypes.object,
  csvOptions: PropTypes.array,
  onChange: PropTypes.func,
};
