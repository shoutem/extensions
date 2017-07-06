import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';

export function updateRuleById(rules, ruleId, rulePatch) {
  const updatedRule = {
    ...rules[ruleId],
    ...rulePatch,
  };

  const updatedRules = {
    ...rules,
    [ruleId]: updatedRule,
  };

  cloneStatus(rules, updatedRules);

  return updatedRules;
}

export function validateNumericRule(number) {
  if (_.isEmpty(number)) {
    return false;
  }

  if (_.isNumber(number)) {
    return true;
  }

  // Calling _.toNumber for a string that is not a number results in NaN.
  // That's why a check !_.isNaN is needed.
  return !_.isNaN(_.toNumber(number));
}
