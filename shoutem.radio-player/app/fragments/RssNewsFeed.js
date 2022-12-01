import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Row } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { openInModal } from 'shoutem.navigation';
import { ArticleList } from '../components';
import { ext, RSS_DETAILS_SCREEN, RSS_LIST_SCREEN } from '../const';
import { fetchNewsFeed, getNewsFeed } from '../redux';

function RssNewsFeed({ shortcut, style }) {
  const {
    settings: { feedUrl },
  } = shortcut;

  const dispatch = useDispatch();
  const newsFeed = useSelector(state => getNewsFeed(state, feedUrl));

  useEffect(() => {
    dispatch(fetchNewsFeed(shortcut.id));
  }, []);

  function handleViewAllPress() {
    openInModal(RSS_LIST_SCREEN, {
      shortcut,
      title: I18n.t(ext('currentNews')),
      screenSettings: {
        hasFeaturedItem: true,
      },
    });
  }

  function handleSingleItemPress(id) {
    openInModal(RSS_DETAILS_SCREEN, { feedUrl, id });
  }

  return (
    <Row style={style.container}>
      <ArticleList
        articles={newsFeed}
        onItemPress={handleSingleItemPress}
        onViewAllPress={handleViewAllPress}
      />
    </Row>
  );
}

RssNewsFeed.propTypes = {
  shortcut: PropTypes.object.isRequired,
  style: PropTypes.object,
};

RssNewsFeed.defaultProps = {
  style: {},
};

export default connectStyle(ext('RssNewsFeed'))(RssNewsFeed);
