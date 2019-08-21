import PropTypes from 'prop-types';
import { PureComponent } from 'react';

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

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { onPress, articleId } = this.props;

    onPress(articleId);
  }
}
