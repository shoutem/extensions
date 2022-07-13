import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InlineModal, LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchTriggers,
  JourneyForm,
  JourneysTable,
} from '../../modules/notification-journeys';
import LOCALIZATION from './localization';
import './style.scss';

export default function JourneysPage({ appId }) {
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [currentJourney, setCurrentJourney] = useState();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    dispatch(fetchTriggers(appId))
      .catch(() => setShowErrorAlert(true))
      .finally(() => setIsLoading(false));
  }, [appId, dispatch]);

  const showModal = useCallback(() => setShowAddModal(true), []);
  const hideModal = useCallback(() => setShowAddModal(false), []);
  const hideErrorModal = useCallback(() => {
    setShowErrorAlert(false);
  }, []);

  const handleAddPress = useCallback(() => {
    setCurrentJourney(undefined);
    showModal();
  }, [showModal]);

  const handleEditPress = useCallback(
    item => {
      setCurrentJourney(item);
      showModal();
    },
    [showModal],
  );

  return (
    <LoaderContainer
      isLoading={isLoading}
      className="general-settings-page settings-page is-wide"
    >
      {showErrorAlert && (
        <Alert bsStyle="danger" onDismiss={hideErrorModal}>
          {i18next.t(LOCALIZATION.ERROR_MESSAGE)}
        </Alert>
      )}
      <JourneysTable
        onAddClick={handleAddPress}
        onEditClick={handleEditPress}
        onRowClick={handleEditPress}
      />
      {showAddModal && (
        <InlineModal
          className="journeys-page-modal"
          onHide={hideModal}
          title={i18next.t(LOCALIZATION.ADD_JOURNEY_TITLE)}
        >
          <JourneyForm
            isEdit={!_.isEmpty(currentJourney)}
            initialValues={currentJourney}
            onSubmit={hideModal}
          />
        </InlineModal>
      )}
    </LoaderContainer>
  );
}

JourneysPage.propTypes = {
  appId: PropTypes.string.isRequired,
};
