import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { EditableTable, FontIcon, IconLabel } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import ext from '../../../../const';
import { getJourneys } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

function getHeaders() {
  return [i18next.t(LOCALIZATION.TABLE_TITLE), '', ''];
}

export default function JourneysTable({ onAddClick, onEditClick, onRowClick }) {
  const dispatch = useDispatch();
  const extension = useSelector(state => getExtension(state, ext()));
  const journeys = useSelector(getJourneys);

  function getRowDescriptors() {
    const titleDescriptor = {
      property: 'title',
      isRequired: true,
    };

    const editDescriptor = {
      getDisplayValue: renderEditValue,
      isRequired: false,
    };

    const deleteDescriptor = {
      getDisplayValue: renderDeleteValue,
      isRequired: false,
    };

    return [titleDescriptor, editDescriptor, deleteDescriptor];
  }

  function renderEditValue(item) {
    const isActive = _.get(item, 'active', false);

    if (isActive) {
      return (
        <Button
          className="btn-icon pull-right"
          onClick={() => onEditClick(item)}
        >
          <FontIcon name="edit" size="24px" />
        </Button>
      );
    }

    return null;
  }

  const handleDeleteClick = useCallback(
    item => {
      const updatedJourneys = _.filter(
        extension.settings.journeys,
        journey => journey.id !== item.id,
      );

      dispatch(
        updateExtensionSettings(extension, {
          ...extension.settings,
          journeys: updatedJourneys,
        }),
      );
    },
    [dispatch, extension],
  );

  function renderDeleteValue(item) {
    return (
      <Button
        className="btn-icon pull-right"
        onClick={event => {
          event.stopPropagation();
          handleDeleteClick(item);
        }}
      >
        <FontIcon name="delete" size="24px" />
      </Button>
    );
  }

  return (
    <>
      <div className="journeys-table__title-row">
        <h3>{i18next.t(LOCALIZATION.JOURNEYS_TITLE)}</h3>
        <Button className="btn-icon pull-right" onClick={onAddClick}>
          <IconLabel iconName="add">
            {i18next.t(LOCALIZATION.ADD_NEW_JOURNEY)}
          </IconLabel>
        </Button>
      </div>
      <EditableTable
        isStatic
        canUpdate={false}
        canDelete={false}
        className="journeys-table"
        emptyStateText={i18next.t(LOCALIZATION.NO_JOURNEYS_TEXT)}
        headers={getHeaders()}
        rowDescriptors={getRowDescriptors()}
        rows={journeys}
        onRowClick={onRowClick}
      />
    </>
  );
}

JourneysTable.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};
