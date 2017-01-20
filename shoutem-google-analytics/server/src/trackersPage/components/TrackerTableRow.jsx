import React, { Component, PropTypes } from 'react';
import { FormGroup } from 'react-bootstrap';
import TableRowActionButton from './TableRowActionButton';

export default class TrackerTableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: props.startInEditMode || false,
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderTableInput = this.renderTableInput.bind(this);
  }

  handleEdit() {
    const { trackerId, viewId, samplingRate } = this.props.tracker;
    this.setState({
      trackerId,
      viewId,
      samplingRate,
      editable: true,
    });
  }

  handleSave() {
    const { trackerId, viewId, samplingRate } = this.state;

    this.props.onSave({
      trackerId,
      viewId: viewId || '',
      samplingRate: samplingRate || '',
    }, this.props.index);

    this.setState({ editable: false });
  }

  handleDelete() {
    this.props.onDelete(this.props.index);
  }

  renderTableInput(prop) {
    const inEditMode = this.state.editable;
    const value = inEditMode ? this.state[prop] : this.props.tracker[prop];
    const onChange = event => this.setState({
      [prop]: event.target.value,
    });

    return (
      <FormGroup>
        <input
          disabled={!inEditMode}
          value={value || ''}
          className="form-control"
          type="text"
          onChange={onChange}
        />
      </FormGroup>
    );
  }

  render() {
    if (!this.state.editable && !this.props.tracker) {
      return null;
    }

    return (
      <tr>
        <td>{this.renderTableInput('trackerId')}</td>
        <td>{this.renderTableInput('viewId')}</td>
        <td>{this.renderTableInput('samplingRate')}</td>
        <td>
          {this.state.editable &&
            <TableRowActionButton
              onClick={this.handleSave}
              iconName="check"
              disabled={!this.state.trackerId}
            />}
          {!this.state.editable &&
            <TableRowActionButton
              onClick={this.handleEdit}
              iconName="edit"
            />}
          <TableRowActionButton
            onClick={this.handleDelete}
            iconName="delete"
          />
        </td>
      </tr>
    );
  }
}

TrackerTableRow.propTypes = {
  tracker: PropTypes.object,
  index: PropTypes.number,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  startInEditMode: PropTypes.bool,
};
