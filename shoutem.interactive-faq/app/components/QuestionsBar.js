import React, { PureComponent } from 'react';
import { FlatList, Platform } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import Question from './Question';

function getItemName(item) {
  return _.get(item, 'name') || _.get(item, 'buttonLabel');
}

export class QuestionsBar extends PureComponent {
  static propTypes = {
    onBackPress: PropTypes.func,
    onItemPress: PropTypes.func,
    items: PropTypes.array,
    hasHistory: PropTypes.bool,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.BACK_ITEM_NAME = I18n.t(ext('backButtonTitle'));

    const { hasHistory, items } = props;

    this.state = {
      items: hasHistory ? [{ name: this.BACK_ITEM_NAME }, ...items] : items,
      ready: true,
    };
  }

  componentDidUpdate(prevProps) {
    const { items, hasHistory } = this.props;
    const { items: prevItems } = prevProps;

    // ScrollView has some issues with rerendering on items change. Specifically,
    // scrollview doesn't know how to modify scroll offset in this case, even through one
    // of many scrollTo native methods
    if (prevItems !== items) {
      if (Platform.OS === 'ios') {
        this.setState({
          items: hasHistory ? [{ name: this.BACK_ITEM_NAME }, ...items] : items,
        });
      }

      if (Platform.OS === 'android') {
        this.setState({
          items: hasHistory ? [{ name: this.BACK_ITEM_NAME }, ...items] : items,
          ready: false,
        }, () => this.setState({ ready: true }));
      }
    }
  }

  renderQuestion({ item }) {
    const { onBackPress, onItemPress } = this.props;

    const isBackItem = _.get(item, 'name') === this.BACK_ITEM_NAME;
    const onPress = isBackItem ? onBackPress : onItemPress;

    return <Question isBack={isBackItem} item={item} onPress={onPress} />;
  }

  render() {
    const { style } = this.props;
    const { items, ready } = this.state;

    if (!ready) {
      return null;
    }

    return (
      <FlatList
        ref={ref => this.list = ref}
        contentContainerStyle={style.contentContainer}
        data={items}
        horizontal
        keyExtractor={getItemName}
        renderItem={this.renderQuestion}
        showsHorizontalScrollIndicator={false}
        style={style.container}
      />
    );
  }
}

export default connectStyle(ext('QuestionsBar'))(QuestionsBar);
