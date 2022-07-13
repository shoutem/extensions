import React, { Component } from 'react';
import { Button, Col, ControlLabel, FormControl, Row } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon, IconLabel } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class SummaryFields extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleAddSummaryField() {
    const {
      fields: { summaries },
    } = this.props;
    const summaryFields = _.get(summaries, 'value', []);

    summaries.onChange([...summaryFields, '']);
  }

  handleRemoveSummaryField(event, index) {
    const {
      fields: { summaries },
      onSummariesChange,
    } = this.props;

    event.stopPropagation();
    const newSummaryFields = [...summaries.value];
    newSummaryFields.splice(index, 1);

    summaries.onChange(newSummaryFields);
    onSummariesChange();
  }

  handleSummaryChange(event, index) {
    const {
      fields: { summaries },
      onSummariesChange,
    } = this.props;

    const newSummaries = [...summaries.value];
    newSummaries[index] = event.target.value;

    summaries.onChange(newSummaries);
    onSummariesChange();
  }

  render() {
    const {
      fields: { summaries },
      name,
      submitting,
    } = this.props;

    return _.map(summaries.value, (value, index) => {
      const isLastItem = index === summaries.value.length - 1;
      const isOnlyItem = summaries.value.length === 1;
      const resolvedColSize = isOnlyItem ? 12 : 11;

      return (
        <>
          <Row>
            <Col xs={resolvedColSize}>
              <ControlLabel>{name}</ControlLabel>
              <FormControl
                componentClass="textarea"
                disabled={submitting}
                maxLength={255}
                onChange={event => this.handleSummaryChange(event, index)}
                value={value}
              />
            </Col>
            {!isOnlyItem && (
              <Col xs={1}>
                <div className="summary-fields__delete-summary-field">
                  <Button
                    className="btn-icon"
                    onClick={event => {
                      this.handleRemoveSummaryField(event, index);
                    }}
                  >
                    <FontIcon name="delete" size="24px" />
                  </Button>
                </div>
              </Col>
            )}
          </Row>
          {isLastItem && (
            <div className="summary-fields__add-summary-field">
              <Button className="btn-icon" onClick={this.handleAddSummaryField}>
                <IconLabel iconName="add">
                  {i18next.t(LOCALIZATION.ADD_NEW_SUMMARY)}
                </IconLabel>
              </Button>
            </div>
          )}
        </>
      );
    });
  }
}

SummaryFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onAddSummaryField: PropTypes.func.isRequired,
  onSummariesChange: PropTypes.func,
  submitting: PropTypes.bool,
};
