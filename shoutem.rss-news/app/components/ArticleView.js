/* eslint-disable react/no-unused-prop-types */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class ArticleView extends PureComponent {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { onPress, articleId } = this.props;

    onPress(articleId);
  }
}

ArticleView.propTypes = {
  articleId: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  author: PropTypes.string,
  date: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
};

ArticleView.defaultProps = {
  author: '',
  date: undefined,
  imageUrl: undefined,
  title: '',
};
