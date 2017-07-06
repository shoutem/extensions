import React, { PropTypes, Component } from 'react';

export class PageProvider extends Component {
  getChildContext() {
    const { page } = this.props;
    return { page };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

PageProvider.propTypes = {
  page: React.PropTypes.object,
  children: PropTypes.node,
};

PageProvider.childContextTypes = {
  page: React.PropTypes.object,
};


export function connectPageContext(WrappedComponent) {
  function PageProvider(props, context) {
    const { page } = context;
    const pageProps = _.pick(page.getPageContext(), [
      'extensionName',
      'shortcutId',
      'screenId',
    ]);

    const parameters = page.getParameters();

    return (<WrappedComponent {...pageProps} parameters={parameters} {...props} />);
  }

  PageProvider.contextTypes = {
    page: React.PropTypes.object,
  };

  return PageProvider;
}

export function connectPage() {
  return wrappedComponent => connectPageContext(wrappedComponent);
}
