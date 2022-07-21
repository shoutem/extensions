import { NativeModules } from 'react-native';
import _ from 'lodash';
import { RESTART_APP } from 'shoutem.application';
import { priorities, setPriority } from 'shoutem-core';
import { isDiscloseApp } from '../app';

const { Mobilizer } = NativeModules;

export const restartAppMiddleware = setPriority(
  // eslint-disable-next-line no-unused-vars
  store => next => action => {
    const actionType = _.get(action, 'type');

    if (actionType === RESTART_APP && isDiscloseApp) {
      return Mobilizer.dismissPreviewedApp();
    }

    return next(action);
  },
  priorities.FIRST,
);
