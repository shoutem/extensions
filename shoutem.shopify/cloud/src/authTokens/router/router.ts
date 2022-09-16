import express, { Router } from 'express';
import controller from '../controllers/tokens-controller';

const router: Router = express.Router();

// OAuth redirect route for token creation
router.post(
  '/redirect',
  controller.authorize(),
);

// OAuth redirect route for token creation
router.get(
  '/redirect',
  controller.authorize()
);

// redirects to custom Shopify App install link
router.get(
  '/install',
  controller.install()
);

// check if the shop is authorized
router.get(
  '/check-authorization',
  controller.checkAuthorization()
);

// GDPR Webhook customer data request
router.post(
  '/hooks/customers/data_request',
  controller.requestCustomerData(),
);

// GDPR Webhook customer redact request
router.post(
  '/hooks/customers/redact',
  controller.redactCustomerData(),
);

// GDPR Webhook shop redact request
router.post(
  '/hooks/shop/redact',
  controller.redactShop(),
);

export {
  router,
};
