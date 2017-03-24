import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { ControlLabel, Button } from 'react-bootstrap';
import { IconLabel } from '@shoutem/react-web-ui';
import TrackerTableRow from './TrackerTableRow';
import './style.scss';

export default class Trackers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addInProgress: false,
    };

    this.setAddInProgress = this.setAddInProgress.bind(this);
    this.removeAddInProgress = this.removeAddInProgress.bind(this);
    this.handleDeleteTracker = this.handleDeleteTracker.bind(this);
    this.handleSaveTracker = this.handleSaveTracker.bind(this);
    this.handleAddTracker = this.handleAddTracker.bind(this);
  }

  setAddInProgress() {
    this.setState({ addInProgress: true });
  }

  removeAddInProgress() {
    this.setState({ addInProgress: false });
  }

  handleDeleteTracker(index) {
    const trackers = [
      ...(_.slice(this.props.trackers, 0, index)),
      ...(_.slice(this.props.trackers, index + 1)),
    ];
    this.props.updateTrackers(trackers);
  }

  handleSaveTracker(tracker, index) {
    const trackers = [
      ...(_.slice(this.props.trackers, 0, index)),
      tracker,
      ...(_.slice(this.props.trackers, index + 1)),
    ];
    this.props.updateTrackers(trackers);
  }

  handleAddTracker(newTracker) {
    const trackers = [
      newTracker,
      ...this.props.trackers,
    ];
    this.props.updateTrackers(trackers)
      .then(this.removeAddInProgress);
  }

  render() {
    return (
      <div className="trackers">
        <div className="trackers__header">
          <h3>Google Analytics Trackers</h3>
          <Button
            disabled={this.state.addInProgress}
            className="btn-icon pull-right"
            onClick={this.setAddInProgress}
          >
            <IconLabel iconName="add">
              Add tracker
            </IconLabel>
          </Button>
        </div>
        <table className="table trackers__table">
          <thead>
            <tr>
              <th><ControlLabel>Tracker ID*</ControlLabel></th>
              <th><ControlLabel>View ID</ControlLabel></th>
              <th><ControlLabel>Sampling rate</ControlLabel></th>
              <th />
            </tr>
          </thead>
          <tbody>
          {this.state.addInProgress &&
            <TrackerTableRow
              startInEditMode
              onSave={this.handleAddTracker}
              onDelete={this.removeAddInProgress}
            />
          }
          {this.props.trackers.map((tracker, index) => (
            <TrackerTableRow
              key={index}
              index={index}
              tracker={tracker}
              onSave={this.handleSaveTracker}
              onDelete={this.handleDeleteTracker}
            />))}
          </tbody>
        </table>
      </div>
    );
  }
}

Trackers.propTypes = {
  trackers: PropTypes.object,
  updateTrackers: PropTypes.func,
};
