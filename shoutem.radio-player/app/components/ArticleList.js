import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getLeadImageUrl } from 'shoutem.rss';
import { ext } from '../const';
import ArticleCard from './ArticleCard';

function ArticleList({ articles, onItemPress, onViewAllPress, style }) {
  const renderItem = useCallback(
    ({ item: article }) => (
      <ArticleCard
        id={article.id}
        key={article.id}
        articleId={article.id}
        title={article.title}
        imageUrl={getLeadImageUrl(article)}
        date={article.timeUpdated}
        onPress={onItemPress}
      />
    ),
    [onItemPress],
  );

  return (
    <>
      <View style={style.flexRow}>
        <Text style={style.title}>{I18n.t(ext('currentNews'))}</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={style.seeAll}>{I18n.t(ext('seeAll'))}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        renderItem={renderItem}
        data={articles}
        keyExtractor={item => item.id}
        styleName="flexible content space-between"
      />
    </>
  );
}

ArticleList.propTypes = {
  articles: PropTypes.array.isRequired,
  onItemPress: PropTypes.func.isRequired,
  onViewAllPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

ArticleList.defaultProps = {
  style: {},
};

export default connectStyle(ext('ArticleList'))(ArticleList);
