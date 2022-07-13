import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default class GroupNode extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleEditClick() {
    const { id, onEditClick } = this.props;

    if (_.isFunction(onEditClick)) {
      onEditClick(id);
    }
  }

  handlDeleteClick() {
    const { id, onDeleteClick } = this.props;

    if (_.isFunction(onDeleteClick)) {
      onDeleteClick(id);
    }
  }

  render() {
    const { id, name, imageUrl } = this.props;

    return (
      <div key={id} className="group-node">
        <div className="group-image-container">
          <img className="group-image" alt="group" src={imageUrl} />
        </div>
        <div className="group-name">{name}</div>
        <div className="group-actions">
          <Button className="btn-icon" onClick={this.handleEditClick}>
            <FontIcon name="edit" size="24px" />
          </Button>
          <Button className="btn-icon" onClick={this.handlDeleteClick}>
            <FontIcon name="delete" size="24px" />
          </Button>
        </div>
      </div>
    );
  }
}

GroupNode.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};
