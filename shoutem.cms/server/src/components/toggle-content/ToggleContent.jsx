import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default class ToggleContent extends Component {
  constructor(props) {
    super(props);

    this.handleToggleChildren = this.handleToggleChildren.bind(this);

    this.state = {
      showChildren: false,
    };
  }

  handleToggleChildren() {
    const { showChildren } = this.state;
    this.setState({ showChildren: !showChildren });
  }

  render() {
    const { title, children, className } = this.props;
    const { showChildren } = this.state;

    const classes = classNames('toggle-content', className);

    return (
      <>
        <div className={classes}>
          <h3>{title}</h3>
          <div onClick={this.handleToggleChildren}>
            <FontIcon name="arrow-drop-down" size="24px" />
          </div>
        </div>
        {showChildren && children}
      </>
    );
  }
}

ToggleContent.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
};
