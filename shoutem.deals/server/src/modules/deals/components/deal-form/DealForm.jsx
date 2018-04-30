import React, { PropTypes } from 'react';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import currencies from 'currency-formatter/currencies.json';
import timezones from 'timezones.json';
import { Row, Col, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
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
import {
  ext,
  DISPLAY_DATE_FORMAT,
  DISPLAY_TIME_FORMAT,
} from 'src/const';
import { getFormState } from 'src/redux';
import { validateDeal } from '../../services';
import './style.scss';

// eslint-disable-next-line
const COUPONS_HELP_TEXT = 'If enabled, all other properties below are taken into consideration. If disabled, none of the properties will affect the deal, even if set.';

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed' },
];

const CURRENCY_OPTIONS = _.map(currencies, currency => ({
  value: currency.code,
  label: `${currency.code} (${currency.symbol})`
}));

const TIMEZONE_OPTIONS = _.map(timezones, timezone => ({
  value: timezone.value,
  label: timezone.text,
}));

export function DealForm({
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
}) {
  const inEditMode = !_.isEmpty(id.value);
  const displayCoupons = !!couponsEnabled.value;

  return (
    <form className="deal-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="title"
          field={title}
          name="Title"
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
            name="Image 1"
          />
        </Col>
        <Col className="deal-form__image" xs={4}>
          <ImageUploaderReduxFormElement
            assetManager={assetManager}
            disabled={submitting}
            elementId="image2"
            field={image2}
            folderName={ext()}
            name="Image 2"
          />
        </Col>
        <Col className="deal-form__image" xs={4}>
          <ImageUploaderReduxFormElement
            assetManager={assetManager}
            disabled={submitting}
            elementId="image3"
            field={image3}
            folderName={ext()}
            name="Image 3"
          />
        </Col>
      </Row>
      <Row>
        <TextEditorReduxFormElement
          disabled={submitting}
          elementId="description"
          field={description}
          name="Description"
        />
      </Row>
      <Row>
        <TextEditorReduxFormElement
          disabled={submitting}
          elementId="condition"
          field={condition}
          name="Condition"
        />
      </Row>
      <Row>
        <Col className="deal-form__time" xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="startTime"
            field={startTime}
            name="Start time"
          >
            <DateTimePicker
              dateFormat={DISPLAY_DATE_FORMAT}
              timeFormat={DISPLAY_TIME_FORMAT}
              utc={false}
            />
          </ReduxFormElement>
        </Col>
        <Col className="deal-form__time" xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="endTime"
            field={endTime}
            name="End time"
          >
            <DateTimePicker
              dateFormat={DISPLAY_DATE_FORMAT}
              timeFormat={DISPLAY_TIME_FORMAT}
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
            name="Publish time"
          >
            <DateTimePicker
              dateFormat={DISPLAY_DATE_FORMAT}
              timeFormat={DISPLAY_TIME_FORMAT}
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
          name="Timezone"
          options={TIMEZONE_OPTIONS}
          placeholder="Select timezone"
        />
      </Row>
      <Row>
        <Col xs={6}>
          <ReduxFormElement
            disabled={submitting}
            elementId="regularPrice"
            field={regularPrice}
            name="Regular price"
          />
        </Col>
        <Col xs={6}>
          <SelectReduxFormElement
            disabled={submitting}
            elementId="currency"
            field={currency}
            name="Currency"
            options={CURRENCY_OPTIONS}
            placeholder="Select currency"
          />
        </Col>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="discountPrice"
          field={discountPrice}
          name="Discounted price"
        />
      </Row>
      <Row>
        <SelectReduxFormElement
          disabled={submitting}
          elementId="discountType"
          field={discountType}
          name="Discount type"
          options={DISCOUNT_TYPES}
          placeholder="Select discount type"
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="buyLink"
          field={buyLink}
          name="Buy URL"
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="buyLinkTitle"
          field={buyLinkTitle}
          name="Buy link title"
        />
      </Row>
      <Row>
        <SelectReduxFormElement
          disabled={submitting || _.isEmpty(places)}
          elementId="place"
          field={place}
          labelKey="name"
          name="Place"
          options={places}
          placeholder="Select place"
          valueKey="id"
        />
      </Row>
      <Row className="deal-form__coupons-enabled">
        <ReduxFormElement
          disabled={submitting}
          elementId="couponsEnabled"
          field={couponsEnabled}
          helpText={COUPONS_HELP_TEXT}
          name="Claim/redeem process"
        >
          <Switch />
        </ReduxFormElement>
      </Row>
      {displayCoupons && (
        <div>
          <Row className="deal-form__stats">
            <label>
              Claimed: {claimedCoupons.value || 0}
              <FontIconPopover message="Number of coupons claimed by users, but not yet used">
                <FontIcon name="info" size="24px" />
              </FontIconPopover>
            </label>
            <label>
              Redeemed: {redeemedCoupons.value || 0}
              <FontIconPopover message="Number of coupons that were claimed and used">
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
                helpText="leave empty for unlimited"
                name="Number of coupons"
              />
            </Col>
            <Col xs={6}>
              <ReduxFormElement
                disabled={submitting}
                elementId="couponsExpirationTime"
                field={couponsExpirationTime}
                helpText="eg. 15h or 15min (0 – never expires)"
                name="Coupon expires in"
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
              name="Custom barcode"
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
            {inEditMode ? 'Save' : 'Add'}
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
      </ButtonToolbar>
      {error &&
        <div className="has-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      }
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
