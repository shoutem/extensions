import React, { Component } from 'react';
import { ControlLabel } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { transformNumericRule, validateNumericRule } from '../../services';
import RuleTableRow from '../rule-table-row';
import LOCALIZATION from './localization';
import './style.scss';

function resolveDisplayRules() {
  return {
    VISIT: {
      type: 'visit',
      customerAction: i18next.t(LOCALIZATION.VISIT_ACTION_TITLE),
      unit: i18next.t(LOCALIZATION.VISIT_UNIT_TITLE),
      valueKey: 'pointsPerVisit',
      valueTransformer: transformNumericRule,
      validateRule: validateNumericRule,
    },
    LINEAR_POINT: {
      type: 'linearPoint',
      customerAction: i18next.t(LOCALIZATION.LINEAR_POINT_ACTION_TITLE),
      unit: i18next.t(LOCALIZATION.LINEAR_POINT_UNIT_TITLE),
      valueKey: 'coefficient',
      valueTransformer: transformNumericRule,
      validateRule: validateNumericRule,
    },
  };
}

export default class RulesTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  renderRuleTableRow(ruleType) {
    const { rules, onRuleChange, onRuleToggle } = this.props;
    const rule = _.find(rules, { ruleType: ruleType.type });

    if (!rule) {
      return null;
    }

    return (
      <RuleTableRow
        key={`${rule.ruleType}-${rule.id}`}
        onRuleChange={onRuleChange}
        onRuleToggle={onRuleToggle}
        rule={rule}
        {...ruleType}
      />
    );
  }

  render() {
    const rules = resolveDisplayRules();

    return (
      <table className="table rules-table">
        <thead>
          <tr>
            <th className="rules-table__action-col">
              <ControlLabel>
                {i18next.t(LOCALIZATION.HEADER_CUSTOM_ACTION_TITLE)}
              </ControlLabel>
            </th>
            <th className="rules-table__value-col">
              <ControlLabel>
                {i18next.t(LOCALIZATION.HEADER_VALUE_TITLE)}
              </ControlLabel>
            </th>
            <th className="rules-table__enabled-col">
              <ControlLabel>
                {i18next.t(LOCALIZATION.HEADER_RULE_ENABLED_TITLE)}
              </ControlLabel>
            </th>
          </tr>
        </thead>
        <tbody>{_.map(rules, this.renderRuleTableRow)}</tbody>
      </table>
    );
  }
}

RulesTable.propTypes = {
  rules: PropTypes.object,
  onRuleChange: PropTypes.func,
  onRuleToggle: PropTypes.func,
};
