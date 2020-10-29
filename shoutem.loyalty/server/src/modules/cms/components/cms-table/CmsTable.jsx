import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import { isBusy } from '@shoutem/redux-io';
import {
  EditableTable,
  LoaderContainer,
  IconLabel,
} from '@shoutem/react-web-ui';
import { Button } from 'react-bootstrap';
import LOCALIZATION from './localization';
import './style.scss';

/**
 * Maps columns from tableDescriptor to headers for EditableTable component.
 * Reads property named `header` from each column object.
 * Last column in EditableTable is column with action buttons that has empty string for header.
 */
function getTableHeaders(columns) {
  return [..._.map(columns, 'header'), ''];
}

/**
 * Maps columns from tableDescriptor to rowDescriptors for EditableTable component.
 * Each object in `columns` should have property named `value`.
 * @param columns
 */
function getRowDescriptors(columns) {
  return _.map(columns, descriptor => ({
    property: _.get(descriptor, 'value'),
    required: _.get(descriptor, 'required', false),
  }));
}

export default class CmsTable extends Component {
  constructor(props) {
    super(props);

    const { descriptor } = props;
    const { columns } = descriptor;

    this.state = {
      tableHeaders: getTableHeaders(columns),
      tableRowDescriptors: getRowDescriptors(columns),
    };
  }

  render() {
    const {
      title,
      emptyStateText,
      resources,
      onAddItemBtnClick,
      onUpdateItem,
      onDeleteItem,
      addItemEnabled,
      addItemBtnText,
    } = this.props;

    const { tableHeaders, tableRowDescriptors } = this.state;

    const canUpdate = _.isFunction(onUpdateItem);
    const canDelete = _.isFunction(onDeleteItem);

    return (
      <LoaderContainer
        className="cms-table"
        isLoading={isBusy(resources)}
        isOverlay
      >
        <div className="cms-table__title">
          <h3>{title}</h3>
          <Button
            className="btn-icon pull-right"
            disabled={!addItemEnabled}
            onClick={onAddItemBtnClick}
          >
            <IconLabel iconName="add">{addItemBtnText}</IconLabel>
          </Button>
        </div>
        <EditableTable
          canDelete={canDelete}
          canUpdate={canUpdate}
          emptyStateText={emptyStateText}
          headers={tableHeaders}
          isStatic
          onRowDeleted={onDeleteItem}
          onRowUpdated={onUpdateItem}
          rowDescriptors={tableRowDescriptors}
          rows={resources}
        />
      </LoaderContainer>
    );
  }
}

CmsTable.propTypes = {
  title: PropTypes.string,
  descriptor: PropTypes.object,
  emptyStateText: PropTypes.string,
  resources: PropTypes.array,
  onAddItemBtnClick: PropTypes.func,
  onUpdateItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  addItemEnabled: PropTypes.bool,
  addItemBtnText: PropTypes.string,
};

CmsTable.defaultProps = {
  emptyStateText: i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE),
  addItemEnabled: true,
  addItemBtnText: i18next.t(LOCALIZATION.BUTTON_ADD_ITEM_TITLE),
};
