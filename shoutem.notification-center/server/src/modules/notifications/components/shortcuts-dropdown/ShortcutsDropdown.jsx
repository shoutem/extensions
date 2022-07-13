import React, { Component } from 'react';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { buildShortcutTree, createOptions } from 'src/services';
import LOCALIZATION from './localization';

export default class ShortcutsDropdown extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      shortcutOptions: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { shortcuts } = props;
    const { shortcuts: nextShortcuts } = nextProps;

    if (shortcuts !== nextShortcuts) {
      const shortcutTree = buildShortcutTree(nextShortcuts);
      const shortcutOptions = createOptions(
        shortcutTree,
        'shortcut.key',
        'shortcut.title',
        ['level'],
      );
      this.setState({ shortcutOptions });
    }
  }

  handleBlur() {
    const { onBlur, shortcut } = this.props;

    if (_.isFunction(onBlur)) {
      onBlur(shortcut);
    }
  }

  handleOnChange(item) {
    const { onChange } = this.props;
    const value = _.get(item, 'value');

    if (_.isFunction(onChange)) {
      onChange(value);
    }
  }

  renderOption(item) {
    const indentation = item.level * 20 + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
    };

    return <span style={indentationStyle}>{item.label}</span>;
  }

  render() {
    const { shortcut, ...otherProps } = this.props;
    const { shortcutOptions } = this.state;

    return (
      <Select
        {...otherProps}
        name="shortcut"
        clearable={false}
        placeholder={i18next.t(LOCALIZATION.DROPDOWN_PLACEHOLDER)}
        value={shortcut}
        options={shortcutOptions}
        onBlur={this.handleBlur}
        onChange={this.handleOnChange}
        optionRenderer={this.renderOption}
      />
    );
  }
}

ShortcutsDropdown.propTypes = {
  shortcut: PropTypes.string,
  shortcuts: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};
