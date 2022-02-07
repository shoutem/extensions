import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { InlineModal } from '@shoutem/react-web-ui';
import { mapFormFieldToView } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export default function UserModal({ profileFormFields, user, onHide }) {
  return (
    <InlineModal
      className="settings-page-modal"
      onHide={onHide}
      title={i18next.t(LOCALIZATION.VIEW_MODAL_TITLE)}
    >
      {mapFormFieldToView(profileFormFields, user)}
    </InlineModal>
  );
}

UserModal.propTypes = {
  profileFormFields: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
};
