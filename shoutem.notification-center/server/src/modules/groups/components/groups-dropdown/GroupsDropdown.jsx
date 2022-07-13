import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { createOptions } from 'src/services';
import { MultiselectDropdown } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';

export default class GroupsDropdown extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      groupOptions: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { groups } = props;
    const { labelLengthLimit, groups: nextGroups } = nextProps;

    if (groups !== nextGroups) {
      const options = createOptions(nextGroups);
      const groupOptions = _.map(options, option => ({
        value: option.value,
        label: _.truncate(option.label, {
          length: labelLengthLimit,
        }),
      }));

      this.setState({ groupOptions });
    }
  }

  render() {
    const { groupOptions } = this.state;
    const {
      emptyText,
      selectedGroupIds,
      disabled,
      onSelectionChanged,
      showSelectNoneOption,
      ...otherProps
    } = this.props;

    const resolvedEmptyText =
      emptyText || i18next.t(LOCALIZATION.DROPDOWN_PLACEHOLDER);

    return (
      <MultiselectDropdown
        disabled={disabled}
        displayLabelMaxSelectedOptions={1}
        emptyText={resolvedEmptyText}
        onSelectionChanged={onSelectionChanged}
        options={groupOptions}
        showSelectNoneOption={showSelectNoneOption}
        selectedValues={selectedGroupIds}
        {...otherProps}
      />
    );
  }
}

GroupsDropdown.propTypes = {
  name: PropTypes.string,
  error: PropTypes.string,
  selectedGroupIds: PropTypes.array,
  emptyText: PropTypes.string,
  groups: PropTypes.array,
  onSelectionChanged: PropTypes.func,
  disabled: PropTypes.bool,
  showSelectNoneOption: PropTypes.bool,
  labelLengthLimit: PropTypes.number,
};

GroupsDropdown.defaultProps = {
  labelLengthLimit: 40,
};
