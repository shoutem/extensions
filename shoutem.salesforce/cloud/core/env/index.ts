import _ from 'lodash';

export function requireEnvString(variableName: string, defaultValue?: string): string {
  const value = _.get(process, `env.${variableName}`) || defaultValue;
  if (_.isUndefined(value)) {
    throw new Error(`Required env variable '${variableName}' is not defined`);
  }

  return value;
}

export function requireEnvNumber(variableName: string, defaultValue?: number): number {
  const value = _.get(process, `env.${variableName}`) || defaultValue;
  if (_.isUndefined(value)) {
    throw new Error(`Required env variable '${variableName}' is not defined`);
  }

  const numericValue = parseFloat(value);
  if (_.isNaN(numericValue)) {
    throw new Error(`Env variable '${variableName}=${value}' is not numeric`);
  }

  return numericValue;
}

export function requireEnvBoolean(variableName: string, defaultValue?: boolean): boolean {
  const value = _.get(process, `env.${variableName}`) || defaultValue;
  if (_.isUndefined(value)) {
    throw new Error(`Required env variable '${variableName}' is not defined`);
  }

  let booleanValue;
  try {
    booleanValue = JSON.parse(value);
  } catch (error) {
    throw new Error(`Env variable '${variableName}=${value}' is not boolean`);
  }

  if (!_.isBoolean(booleanValue)) {
    throw new Error(`Env variable '${variableName}=${value}' is not boolean`);
  }

  return booleanValue;
}
