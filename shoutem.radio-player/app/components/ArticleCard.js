import React, { useCallback } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Card,
  Image,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';

function ArticleCard({ id, title, imageUrl, date, onPress, style }) {
  const articleImage = imageUrl ? { uri: imageUrl } : assets.noImagePlaceholder;
  const dateInUtc = moment.utc(date);

  const handlePress = useCallback(() => onPress(id), [id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress} style={style.cardContainer}>
      <Card style={style.card}>
        <Image
          style={style.cardImage}
          styleName="medium-wide placeholder"
          source={articleImage}
        />
        <View style={style.cartContent}>
          <Subtitle numberOfLines={2}>{title}</Subtitle>
          {dateInUtc.isAfter(0) && (
            <Caption styleName="vertical v-end">{dateInUtc.fromNow()}</Caption>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

ArticleCard.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

ArticleCard.defaultProps = {
  style: {},
};

export default connectStyle(ext('ArticleCard'))(ArticleCard);
