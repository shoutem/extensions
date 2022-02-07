import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { AffiliateDisabledPlaceholder } from '../../components';
import {
  GeneralStats,
  TransactionsDasboard,
  TransactionsFilter,
} from '../../fragments';
import {
  enableAffiliate,
  getUserCard,
  isDataLoading,
  PROGRAMS,
} from '../../redux';
import './style.scss';

export default function PointsPage(props) {
  const {
    appId,
    ownExtension: { settings },
    extensionName,
  } = props;

  const dispatch = useDispatch();

  const [selectedUserId, setSelectedUserId] = useState(null);

  const programId = settings.program?.id;

  const extension = useSelector(state => getExtension(state, extensionName));
  const isLoading = useSelector(isDataLoading);
  const userCardId = useSelector(state => getUserCard(state, selectedUserId));

  function handleEnableAffiliate() {
    return dispatch(enableAffiliate()).then(programId => {
      const program = {
        type: PROGRAMS,
        id: programId,
      };

      return dispatch(
        // Spreading settings is a must, otherwise we override settings.services
        updateExtensionSettings(extension, { ...settings, program }),
      );
    });
  }

  return (
    <div className="affiliate-settings-page settings-page is-wide">
      {!programId && (
        <AffiliateDisabledPlaceholder
          onEnableAffiliateClick={handleEnableAffiliate}
        />
      )}
      {programId && (
        <LoaderContainer isLoading={isLoading} isOverlay>
          <TransactionsFilter onChange={setSelectedUserId} />
          <GeneralStats
            programId={programId}
            cardId={userCardId}
            userId={selectedUserId}
          />
          <TransactionsDasboard
            appId={appId}
            extensionName={extensionName}
            programId={programId}
            selectedUserId={selectedUserId}
            selectedCardId={userCardId}
          />
        </LoaderContainer>
      )}
    </div>
  );
}

PointsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  extensionName: PropTypes.string.isRequired,
  ownExtension: PropTypes.object.isRequired,
};
