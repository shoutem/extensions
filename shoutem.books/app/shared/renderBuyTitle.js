import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export function renderBuyTitle(book) {
  let buyTitle = I18n.t(ext('buyButtonText'));
  if (book.buyLinkTitle) {
    buyTitle = book.buyLinkTitle.toUpperCase();
  }
  return buyTitle;
}
