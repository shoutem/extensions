import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import i18next from 'i18next';
import { InlineModal } from '@shoutem/react-web-ui';
import DealForm from '../deal-form';
import { mapModelToView, mapViewToModel } from '../../services';
import LOCALIZATION from './localization';

export default class DealFormModal extends Component {
  static propTypes = {
    assetManager: PropTypes.object,
    catalogId: PropTypes.string,
    onDealCreate: PropTypes.func,
    onDealUpdate: PropTypes.func,
    places: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleSaveDeal = this.handleSaveDeal.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.state = {
      inProgress: false,
      currentDeal: null,
      show: false,
    };
  }

  show(currentDeal) {
    this.setState({
      show: true,
      currentDeal,
    });
  }

  handleHide() {
    this.setState({
      inProgress: false,
      show: false,
      currentDeal: null,
    });
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
    const { currentDeal } = this.state;

    const dealToSave = mapViewToModel(deal, catalogId);
    const placeId = _.get(deal, 'place');
    const categories = _.get(deal, 'categories');

    if (currentDeal) {
      return onDealUpdate(dealToSave, placeId, categories);
    }

    return onDealCreate(dealToSave, placeId);
  }

  render() {
    const { assetManager, places } = this.props;
    const { show, currentDeal } = this.state;

    const modalTitle = currentDeal
      ? i18next.t(LOCALIZATION.MODAL_EDIT_TITLE)
      : i18next.t(LOCALIZATION.MODAL_ADD_TITLE);
    const displayDeal = currentDeal && mapModelToView(currentDeal);

    return (
      <InlineModal
        className="deal-form-modal settings-page-modal"
        onHide={this.handleHide}
        show={show}
        title={modalTitle}
      >
        <DealForm
          assetManager={assetManager}
          initialValues={displayDeal}
          onCancel={this.handleHide}
          onSubmit={this.handleFormSubmit}
          places={places}
        />
      </InlineModal>
    );
  }
}
