import { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';

export class ArticleView extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    const { onPress, articleId } = this.props;

    onPress(articleId);
  }
}

/* eslint-disable react/no-unused-prop-types */
// Disabling because these props are used in components via inheritence
ArticleView.propTypes = {
  articleId: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};
/* eslint-enable react/no-unused-prop-types */

ArticleView.defaultProps = {
  articleId: undefined,
  author: undefined,
  date: undefined,
  imageUrl: undefined,
  title: undefined,
  onPress: undefined,
};
