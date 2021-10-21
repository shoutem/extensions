import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';

export default class PageProvider extends PureComponent {
  getChildContext() {
    const { page } = this.props;

    return { page };
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}

PageProvider.propTypes = {
  page: PropTypes.object,
  children: PropTypes.node,
};

PageProvider.childContextTypes = {
  page: PropTypes.object,
};
