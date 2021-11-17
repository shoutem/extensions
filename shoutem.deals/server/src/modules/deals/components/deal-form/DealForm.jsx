import React from 'react';
import currencies from 'currency-formatter/currencies.json';
import i18next from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Row, Col, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import timezones from 'timezones.json';
import {
  DateTimePicker,
  LoaderContainer,
  ReduxFormElement,
  Switch,
  FontIcon,
  FontIconPopover,
} from '@shoutem/react-web-ui';
import {
  ImageUploaderReduxFormElement,
  SelectReduxFormElement,
  TextEditorReduxFormElement,
} from '@shoutem/form-builder';
import { ext } from 'src/const';
import { getDisplayDateFormat, getDisplayTimeFormat } from 'src/services';
import { getFormState } from 'src/redux';
import { validateDeal } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function getDiscountType() {
  return [
    {
      value: 'percentage',
      label: i18next.t(LOCALIZATION.DISCOUNT_TYPE_PERCENTAGE_TITLE),
    },
    {
      value: 'fixed',
      label: i18next.t(LOCALIZATION.DISCOUNT_TYPE_FIXED_TITLE),
    },
  ];
}

const CURRENCY_OPTIONS = _.map(currencies, currency => ({
  value: currency.code,
  label: `${currency.code} (${currency.symbol})`,
}));

const TIMEZONE_OPTIONS = _.map(timezones, timezone => ({
  value: timezone.value,
  label: timezone.text,
}));

export function DealForm(props) {
  const {
    assetManager,
    submitting,
    pristine,
    fields: {
      id,
      title,
      description,
      image1,
      image2,
      image3,
      condition,
      regularPrice,
      currency,
      discountType,
      discountPrice,
      publishTime,
      startTime,
      endTime,
      timezone,
      buyLink,
      buyLinkTitle,
      hideRedeemButton,
      couponsEnabled,
      couponsExpirationTime,
      claimedCoupons,
      redeemedCoupons,
      remainingCoupons,
      barcode,
      place,
    },
    onCancel,
    handleSubmit,
    error,
    places,
  } = props;
  const inEditMode = !_.isEmpty(id.value);
  const displayCoupons = !!couponsEnabled.value;

  return (
    <form className="deal-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="title"
          field={title}
          name={i18next.t(LOCALIZATION.FORM_TITLE_TITLE)}
        />
      </Row>
      <Row>
        <Col className="deal-form__image" xs={4}>
          <ImageUploaderReduxFormElement
            assetManager={assetManager}
            disabled={submitting}
            elementId="image1"
            field={image1}
            folderName={ext()}
            name={i18next.t(LOCALIZATION.FORM_IMAGE_1_TITLE)}
          />
        </Col>
        <Col className="deal-form__image" xs={4}>
          <ImageUploaderReduxFormElement
            assetManager={assetManager}
            disabled={submitting}
            elementId="image2"
            field={image2}
            folderName={ext()}
            name={i18next.t(LOCALIZATION.FORM_IMAGE_2_TITLE)}
          />
        </Col>
        <Col className="deal-form__image" xs={4}>
          <ImageUploaderReduxFormElement
            assetManager={assetManager}
            disabled={submitting}
            elementId="image3"
            field={image3}
            folderName={ext()}
            name={i18next.t(LOCALIZATION.FORM_IMAGE_3_TITLE)}
          />
        </Col>
      </Row>
      <Row>
        <TextEditorReduxFormElement
          disabled={submitting}
          elementId="description"
          field={description}
          name={i18next.t(LOCALIZATION.FORM_DESCRIPTION_TITLE)}
        />
      </Row>
      <Row>
        <TextEditorReduxFormElement
          disabled={submitting}
          elementId="condition"
          field={condition}
          name={i18next.t(LOCALIZATION.FORM_CONDITION_TITLE)}
        />
      </Row>
      <Row>
        <Col className="deal-form__time" xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="startTime"
            field={startTime}
            name={i18next.t(LOCALIZATION.FORM_START_TIME_TITLE)}
          >
            <DateTimePicker
              dateFormat={getDisplayDateFormat()}
              timeFormat={getDisplayTimeFormat()}
              utc={false}
            />
          </ReduxFormElement>
        </Col>
        <Col className="deal-form__time" xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="endTime"
            field={endTime}
            name={i18next.t(LOCALIZATION.FORM_END_TIME_TITLE)}
          >
            <DateTimePicker
              dateFormat={getDisplayDateFormat()}
              timeFormat={getDisplayTimeFormat()}
              utc={false}
            />
          </ReduxFormElement>
        </Col>
      </Row>
      <Row>
        <Col className="deal-form__time" xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="publishTime"
            field={publishTime}
            name={i18next.t(LOCALIZATION.FORM_PUBLISH_TIME_TITLE)}
          >
            <DateTimePicker
              dateFormat={getDisplayDateFormat()}
              timeFormat={getDisplayTimeFormat()}
              utc={false}
            />
          </ReduxFormElement>
        </Col>
      </Row>
      <Row>
        <SelectReduxFormElement
          disabled={submitting}
          elementId="timezone"
          field={timezone}
          name={i18next.t(LOCALIZATION.FORM_TIMEZONE_TITLE)}
          options={TIMEZONE_OPTIONS}
          placeholder={i18next.t(
            LOCALIZATION.FORM_TIMEZONE_PLACEHOLDER_MESSAGE,
          )}
        />
      </Row>
      <Row>
        <Col xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="regularPrice"
            field={regularPrice}
            name={i18next.t(LOCALIZATION.FORM_REGULAR_PRICE_TITLE)}
          />
        </Col>
        <Col xs={6}>
          <SelectReduxFormElement
            disabled={submitting}
            elementId="currency"
            field={currency}
            name={i18next.t(LOCALIZATION.FORM_CURRENCY_TITLE)}
            options={CURRENCY_OPTIONS}
            placeholder={i18next.t(
              LOCALIZATION.FORM_CURRENCY_PLACEHOLDER_MESSAGE,
            )}
          />
        </Col>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="discountPrice"
          field={discountPrice}
          name={i18next.t(LOCALIZATION.FORM_DISCOUNTED_PRICE_TITLE)}
        />
      </Row>
      <Row>
        <SelectReduxFormElement
          disabled={submitting}
          elementId="discountType"
          field={discountType}
          name={i18next.t(LOCALIZATION.FORM_DISCOUNTED_TYPE_TITLE)}
          options={getDiscountType()}
          placeholder={i18next.t(
            LOCALIZATION.FORM_DISCOUNTED_TYPE_PLACEHOLDER_MESSAGE,
          )}
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="buyLink"
          field={buyLink}
          name={i18next.t(LOCALIZATION.FORM_BUY_URL_TITLE)}
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="buyLinkTitle"
          field={buyLinkTitle}
          name={i18next.t(LOCALIZATION.FORM_BUY_LINK_TITLE)}
        />
      </Row>
      <Row>
        <SelectReduxFormElement
          disabled={submitting || _.isEmpty(places)}
          elementId="place"
          field={place}
          labelKey="name"
          name={i18next.t(LOCALIZATION.FORM_PLACE_TITLE)}
          options={places}
          placeholder={i18next.t(LOCALIZATION.FORM_PLACE_PLACEHOLDER_MESSAGE)}
          valueKey="id"
        />
      </Row>
      <Row className="deal-form__hide-redeem-button">
        <ReduxFormElement
          disabled={submitting}
          elementId="hideRedeemButton"
          field={hideRedeemButton}
          name={i18next.t(LOCALIZATION.FORM_HIDE_REDEEM_BUTTON_TITLE)}
        >
          <Switch value={!!hideRedeemButton.value} />
        </ReduxFormElement>
      </Row>
      <Row className="deal-form__coupons-enabled">
        <ReduxFormElement
          disabled={submitting}
          elementId="couponsEnabled"
          field={couponsEnabled}
          helpText={i18next.t(LOCALIZATION.FORM_CLAIM_REDEEM_HELP_MESSAGE)}
          name={i18next.t(LOCALIZATION.FORM_CLAIM_REDEEM_TITLE)}
        >
          <Switch />
        </ReduxFormElement>
      </Row>
      {displayCoupons && (
        <div>
          <Row className="deal-form__stats">
            <label>
              {i18next.t(LOCALIZATION.FORM_CLAIMED_TITLE, {
                value: claimedCoupons.value || 0,
              })}
              <FontIconPopover
                message={i18next.t(LOCALIZATION.FORM_CLAIMED_MESSAGE)}
              >
                <FontIcon name="info" size="24px" />
              </FontIconPopover>
            </label>
            <label>
              {i18next.t(LOCALIZATION.FORM_REDEEMED_TITLE, {
                value: redeemedCoupons.value || 0,
              })}
              <FontIconPopover
                message={i18next.t(LOCALIZATION.FORM_REDEEMED_MESSAGE)}
              >
                <FontIcon name="info" size="24px" />
              </FontIconPopover>
            </label>
          </Row>
          <Row>
            <Col xs={6}>
              <ReduxFormElement
                disabled={submitting}
                elementId="remainingCoupons"
                field={remainingCoupons}
                helpText={i18next.t(
                  LOCALIZATION.FORM_NUMBER_OF_COUPONS_HELP_MESSAGE,
                )}
                name={i18next.t(LOCALIZATION.FORM_NUMBER_OF_COUPONS_TITLE)}
              />
            </Col>
            <Col xs={6}>
              <ReduxFormElement
                disabled={submitting}
                elementId="couponsExpirationTime"
                field={couponsExpirationTime}
                helpText={i18next.t(
                  LOCALIZATION.FORM_COUPON_EXPIRES_IN_HELP_MESSAGE,
                )}
                name={i18next.t(LOCALIZATION.FORM_COUPON_EXPIRES_IN_TITLE)}
              />
            </Col>
          </Row>
          <Row>
            <ImageUploaderReduxFormElement
              assetManager={assetManager}
              disabled={submitting}
              elementId="barcode"
              field={barcode}
              folderName={ext()}
              name={i18next.t(LOCALIZATION.FORM_CUSTOM_BARCODE_TITLE)}
            />
          </Row>
        </div>
      )}
      <ButtonToolbar>
        <Button
          bsSize="large"
          bsStyle="primary"
          disabled={submitting || pristine}
          type="submit"
        >
          <LoaderContainer isLoading={submitting}>
            {inEditMode
              ? i18next.t(LOCALIZATION.BUTTON_SAVE_TITLE)
              : i18next.t(LOCALIZATION.BUTTON_ADD_TITLE)}
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={submitting} onClick={onCancel}>
          {i18next.t(LOCALIZATION.BUTTON_CANCEL_TITLE)}
        </Button>
      </ButtonToolbar>
      {error && (
        <div className="has-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      )}
    </form>
  );
}

DealForm.propTypes = {
  assetManager: PropTypes.object,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  error: PropTypes.string,
  places: PropTypes.array,
};

export default reduxForm({
  getFormState,
  form: 'dealForm',
  fields: [
    'id',
    'title',
    'description',
    'image1',
    'image2',
    'image3',
    'condition',
    'regularPrice',
    'currency',
    'discountType',
    'discountPrice',
    'publishTime',
    'startTime',
    'timezone',
    'endTime',
    'buyLink',
    'buyLinkTitle',
    'hideRedeemButton',
    'couponsEnabled',
    'totalCoupons',
    'couponsExpirationTime',
    'claimedCoupons',
    'redeemedCoupons',
    'remainingCoupons',
    'barcode',
    'place',
    'categories',
  ],
  validate: validateDeal,
})(DealForm);
