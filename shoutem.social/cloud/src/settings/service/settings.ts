import { Request } from 'express';
import _ from 'lodash';
import { getLocals, setLocals } from '../../shared/express';
import { Settings } from '../data/settings-model';
import settingsRepository from '../data/settings-repository';
import { SETTINGS_LOCALS_PATH } from '../const';

export function getSettings(req: Request): Settings {
  return getLocals<Settings>(req, SETTINGS_LOCALS_PATH);
}

export function setSettings(req: Request, settings: Settings): void {
  setLocals(req, SETTINGS_LOCALS_PATH, settings);
}

export async function shouldSendNotification(userId: string, trigger: string): Promise<boolean> {
  const userSettings = await settingsRepository.findOne({ userId: _.toString(userId) });

  return _.get(userSettings, trigger, false);
}
