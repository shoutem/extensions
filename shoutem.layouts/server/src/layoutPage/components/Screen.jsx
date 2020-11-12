import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translateExt18n } from '../../services';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { isActive, onClick, screen } = this.props;
    const { canonicalType, canonicalName } = screen;

    if (isActive) {
      return;
    }

    onClick({ canonicalName, canonicalType });
  }

  render() {
    const { extensionName, screen, isActive } = this.props;
    const screenClasses = classNames('screen_group__screen', {
      'is-active': isActive,
    });

    return (
      <div className={screenClasses} onClick={this.handleClick}>
        <div className="screen_group__screen-bezel">
          {screen.image && (
            <img className="screen_group__screen-image" src={screen.image} />
          )}
        </div>
        <div className="screen_group__screen_name">
          {translateExt18n(extensionName, screen.title)}
        </div>
      </div>
    );
  }
}

Screen.propTypes = {
  extensionName: PropTypes.string,
  screen: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
