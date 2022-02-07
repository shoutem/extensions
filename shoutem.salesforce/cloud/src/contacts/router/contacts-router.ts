import express, { Router } from 'express';
import controller from '../controllers/contacts-controller';

const contactsRouter: Router = express.Router();

contactsRouter.use(express.json());

contactsRouter.post(
  '/search',
  controller.search(),
);

contactsRouter.post(
  '/create',
  controller.create()
);

export {
  contactsRouter,
};
