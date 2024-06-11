import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import { mapModelToView, mapViewToModel } from '../../services';
import DealForm from '../deal-form';
import LOCALIZATION from './localization';
import './styles.scss';

export default class DealFormModal extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleHide() {
    const { onHide } = this.props;

    if (_.isFunction(onHide)) {
      onHide();
    }
  }

  handleFormSubmit(deal) {
    return new Promise((resolve, reject) =>
      this.handleSaveDeal(deal).then(this.handleHide, () =>
        reject({
          _error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
        }),
      ),
    );
  }

  handleSaveDeal(deal) {
    const { catalogId, onDealCreate, onDealUpdate } = this.props;

    const dealToSave = mapViewToModel(deal, catalogId);
    const placeId = _.get(deal, 'place.id');
    const categories = _.get(deal, 'categories');

    if (_.get(deal, 'id')) {
      return onDealUpdate(dealToSave, placeId, categories);
    }

    return onDealCreate(dealToSave, placeId);
  }

  render() {
    const { assetManager, deal, loadSchema, loadResources } = this.props;

    const modalTitle = deal
      ? i18next.t(LOCALIZATION.MODAL_EDIT_TITLE)
      : i18next.t(LOCALIZATION.MODAL_ADD_TITLE);
    const displayDeal = deal && mapModelToView(deal);

    return (
      <div className="deal-form-modal">
        <div className="deal-form-modal-title-container">
          <Button className="btn-icon pull-left" onClick={this.handleHide}>
            <FontIcon name="back" size="24px" />
          </Button>
          {modalTitle && (
            <h3 className="deal-form-modal-title">{modalTitle}</h3>
          )}
        </div>
        <DealForm
          assetManager={assetManager}
          initialValues={displayDeal}
          onCancel={this.handleHide}
          onSubmit={this.handleFormSubmit}
          loadSchema={loadSchema}
          loadResources={loadResources}
        />
      </div>
    );
  }
}

DealFormModal.propTypes = {
  assetManager: PropTypes.object.isRequired,
  catalogId: PropTypes.string.isRequired,
  deal: PropTypes.object.isRequired,
  loadResources: PropTypes.func.isRequired,
  loadSchema: PropTypes.func.isRequired,
  onDealCreate: PropTypes.func.isRequired,
  onDealUpdate: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};
