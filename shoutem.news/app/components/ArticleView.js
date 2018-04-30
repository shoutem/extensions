import PropTypes from 'prop-types';
import React from 'react';

export class ArticleView extends React.Component {
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
    this.props.onPress(this.props.articleId);
  }
}

