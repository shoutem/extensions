import _ from 'lodash';
import moment from 'moment';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const NON_CONSUMABLE_PRODUCT_TYPE = 'non_consumable';

export function formatTrialDuration(product) {
  const periodType = _.get(product, 'subscriptionPeriodType');
  const trialDuration = _.get(product, 'subscriptionTrialDuration');

  if (periodType !== 'trial') {
    return null;
  }

  return `${moment.duration(trialDuration).asDays()} ${I18n.t(
    ext('subscriptionTrialDuration'),
  )}`;
}

export function formatSubscribeMessage(product) {
  const type = _.get(product, 'type');
  const localisedPrice = _.get(product, 'localizedPrice');
  const subsscriptionDuration = _.get(product, 'subscriptionDuration');
  const durationInMonths = moment.duration(subsscriptionDuration).asMonths();
  const monthsText =
    durationInMonths < 2
      ? I18n.t(ext('subscribeButtonDurationMonth'))
      : `${durationInMonths} ${I18n.t(ext('subscribeButtonDurationMonth'))}`;
  const showMonthsText = type !== NON_CONSUMABLE_PRODUCT_TYPE;

  return `${I18n.t(ext('subscribeButtonPrefix'))} ${localisedPrice}${
    showMonthsText ? ` / ${monthsText}` : ''
  }`;
}
