import { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';

export class ArticleView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    articleId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    imageUrl: PropTypes.string,
    date: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    const { onPress, articleId } = this.props;

    onPress(articleId);
  }
}
