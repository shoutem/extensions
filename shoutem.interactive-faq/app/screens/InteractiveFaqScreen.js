import React, { PureComponent } from 'react';
import { FlatList, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner } from '@shoutem/ui';
import { CATEGORIES_SCHEMA } from 'shoutem.cms';
import { getRouteParams, isTabBarNavigation } from 'shoutem.navigation';
import { MessageBubble, QuestionsBar } from '../components';
import { ext } from '../const';
import { actions, QUESTIONS_SCHEMA, selectors } from '../redux';

function renderMessage({ item }) {
  return <MessageBubble {...item} />;
}

function keyExtractor(item) {
  return _.toString(item.id);
}

renderMessage.propTypes = { item: PropTypes.object };

export class InteractiveFaqScreen extends PureComponent {
  static propTypes = {
    isTabBar: PropTypes.bool,
    parentCategoryId: PropTypes.string,
    startingMessage: PropTypes.string,
    loadCategories: PropTypes.func,
    openCategory: PropTypes.func,
    loadQuestions: PropTypes.func,
    goBack: PropTypes.func,
    questions: PropTypes.array,
    categoryPath: PropTypes.array,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const { startingMessage } = props;

    this.state = {
      conversationHistory: _.isEmpty(startingMessage)
        ? []
        : [
            {
              id: 0,
              isBotMessage: true,
              message: startingMessage,
            },
          ],
      loading: true,
    };
  }

  componentDidMount() {
    const {
      navigation,
      parentCategoryId,
      loadCategories,
      loadQuestions,
    } = this.props;

    if (!parentCategoryId) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ loading: false });
      return;
    }

    Promise.all([loadCategories(parentCategoryId), loadQuestions()]).then(
      () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ loading: false });
      },
    );
  }

  pushMessage(message, isBotMessage) {
    const { conversationHistory } = this.state;
    const id = _.get(_.last(conversationHistory), 'id', 0) + 1;

    this.setState({
      conversationHistory: [
        ...conversationHistory,
        {
          id,
          isBotMessage,
          message,
        },
      ],
    });

    _.delay(() => this.list.scrollToEnd({ animated: true }), 250);
  }

  pushQuestion(question) {
    const { answer, question: questionMessage } = question;

    if (questionMessage) {
      this.pushMessage(questionMessage, false);
    }

    const delay = questionMessage ? 500 : 0;

    _.delay(() => this.pushMessage(answer, true), delay);
  }

  handleItemPress(item) {
    const { openCategory } = this.props;

    const { type } = item;

    if (type === QUESTIONS_SCHEMA) {
      this.pushQuestion(item);
      return;
    }

    if (type === CATEGORIES_SCHEMA) {
      LayoutAnimation.easeInEaseOut();
      openCategory(item.id);
    }
  }

  handleBackPress() {
    const { goBack } = this.props;

    LayoutAnimation.easeInEaseOut();
    goBack();
  }

  render() {
    const { questions, categoryPath, style, isTabBar } = this.props;
    const { conversationHistory, loading } = this.state;
    const hasHistory = !_.isEmpty(categoryPath);
    const screenStyle = [style.container, isTabBar && style.paddedConatiner];

    return (
      <Screen style={screenStyle}>
        {!loading && (
          <FlatList
            ref={ref => (this.list = ref)}
            contentContainerStyle={style.flatlistContainer}
            data={conversationHistory}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
          />
        )}
        {!loading && (
          <QuestionsBar
            hasHistory={hasHistory}
            items={questions}
            onBackPress={this.handleBackPress}
            onItemPress={this.handleItemPress}
          />
        )}
        {loading && <Spinner styleName="xl-gutter-top" />}
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    shortcut: { settings },
  } = getRouteParams(ownProps);
  const parentCategoryId = _.get(settings, 'parentCategory.id', null);
  const startingMessage = _.get(settings, 'startMessage', null);

  return {
    parentCategoryId,
    startingMessage,
    questions: selectors.getActiveLevelQuestions(state),
    isTabBar: isTabBarNavigation(state),
    categoryPath: selectors.getQuestionsPath(state),
  };
};

const mapDispatchToProps = {
  loadCategories: actions.loadCategories,
  loadQuestions: actions.loadQuestions,
  goBack: actions.goBackALevel,
  openCategory: actions.openCategory,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('InteractiveFaqScreen'))(InteractiveFaqScreen));
