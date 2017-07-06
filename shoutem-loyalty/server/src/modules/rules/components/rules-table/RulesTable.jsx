import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { ControlLabel } from 'react-bootstrap';
import { validateNumericRule } from '../../services';
import RuleTableRow from '../rule-table-row';

export const RULES_TO_DISPLAY = {
  VISIT: {
    type: 'visit',
    customerAction: 'Visit (QR or PIN verification)',
    unit: 'points',
    valueKey: 'pointsPerVisit',
    valueTransformer: _.toNumber,
    validateRule: validateNumericRule,
  },
  LINEAR_POINT: {
    type: 'linearPoint',
    customerAction: 'Purchase (PIN, QR or receipt scanning)',
    unit: 'points per currency unit',
    valueKey: 'coefficient',
    valueTransformer: _.toNumber,
    validateRule: validateNumericRule,
  },
};

export default class RulesTable extends Component {
  constructor(props) {
    super(props);

    this.renderRuleTableRow = this.renderRuleTableRow.bind(this);
  }

  renderRuleTableRow(ruleType) {
    const { rules, onRuleChange } = this.props;
    const rule = _.find(rules, { ruleType: ruleType.type });

    if (!rule) {
      return null;
    }

    return (
      <RuleTableRow
        key={rule.id}
        rule={rule}
        onRuleChange={onRuleChange}
        {...ruleType}
      />
    );
  }

  render() {
    return (
      <table className="table rules-table">
        <thead>
          <tr>
            <th><ControlLabel>Customer’s action</ControlLabel></th>
            <th><ControlLabel>Value</ControlLabel></th>
          </tr>
        </thead>
        <tbody>
          {_.map(RULES_TO_DISPLAY, this.renderRuleTableRow)}
        </tbody>
      </table>
    );
  }
}

RulesTable.propTypes = {
  rules: PropTypes.object,
  onRuleChange: PropTypes.func,
};
