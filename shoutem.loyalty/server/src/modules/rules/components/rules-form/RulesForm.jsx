import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import RulesTable from '../rules-table';
import LOCALIZATION from './localization';
import './style.scss';

export default class RulesSettings extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { rules } = props;

    this.state = {
      rules,
      rulePatches: {},
      inProgress: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { rules: nextRules } = nextProps;
    const { rules } = this.props;

    if (rules !== nextRules) {
      this.setState({ rules: nextRules });
    }
  }

  handleRuleChange(rule, rulePatch) {
    const { rules } = this.state;
    const { ruleType } = rule;

    this.setState(
      {
        rules: {
          ...rules,
          [ruleType]: rulePatch,
        },
      },
      this.calculateHasChanges,
    );
  }

  handleRuleEnabledToggle(rule, enabled = true) {
    const { rules } = this.state;
    const { ruleType } = rule;

    this.setState(
      {
        rules: {
          ...rules,
          [ruleType]: { ...rule, enabled },
        },
      },
      this.calculateHasChanges,
    );
  }

  handleSaveChangesClick() {
    const { rules } = this.state;

    this.setState({ inProgress: true });

    this.props.onUpdateRules(rules).then(() =>
      this.setState({
        inProgress: false,
        hasChanges: false,
      }),
    );
  }

  calculateHasChanges() {
    const { rules } = this.state;
    const { rules: initialRules } = this.props;

    const hasChanges = !_.isEqual(initialRules, rules);
    this.setState({ hasChanges });
  }

  render() {
    const { rules, inProgress, hasChanges } = this.state;

    return (
      <div className="rules-form">
        <RulesTable
          onRuleChange={this.handleRuleChange}
          onRuleToggle={this.handleRuleEnabledToggle}
          rules={rules}
        />
        <Button
          bsStyle="primary"
          disabled={!hasChanges}
          onClick={this.handleSaveChangesClick}
        >
          <LoaderContainer isLoading={inProgress}>
            {i18next.t(LOCALIZATION.BUTTON_UPDATE_RULES_TITLE)}
          </LoaderContainer>
        </Button>
      </div>
    );
  }
}

RulesSettings.propTypes = {
  rules: PropTypes.object,
  onUpdateRules: PropTypes.func,
  onUpdateRequiredReceipt: PropTypes.func,
};
