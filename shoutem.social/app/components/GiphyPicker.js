import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { GiphyFetch } from '@giphy/js-fetch-api';
import MasonryList from '@react-native-seoul/masonry-list';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, TextInput, Title, Toast, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ext } from '../const';
import GiphyImage from './GiphyImage';

const PAGE_SIZE = 25;

const GiphyPicker = ({ apiKey, isVisible, onGifSelected, onClose, style }) => {
  const gf = useMemo(() => new GiphyFetch(apiKey), [apiKey]);

  const [trendingGifs, setTrendingGifs] = useState({
    gifs: [],
    nextPage: 0,
  });
  const [queriedGifs, setQueriedGifs] = useState({
    gifs: [],
    nextPage: 0,
  });
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrendingGifs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!query) {
      setQueriedGifs({
        gifs: [],
        nextPage: 0,
      });
    }

    if (query) {
      fetchSearchQueryGifs();
    }
  }, [fetchSearchQueryGifs, query]);

  const fetchTrendingGifs = useCallback(async () => {
    setLoading(true);

    try {
      const response = await gf.trending({
        limit: PAGE_SIZE,
        offset: trendingGifs.nextPage * PAGE_SIZE,
      });

      setTrendingGifs(prevData => ({
        gifs: [...prevData.gifs, ...response.data],
        nextPage: prevData.nextPage + 1,
      }));
      setLoading(false);
    } catch (e) {
      setLoading(false);

      Toast.showError({
        title: I18n.t(ext('fetchGifsError')),
        message: e.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendingGifs.nextPage]);

  const fetchSearchQueryGifs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await gf.search(query, {
        offset: queriedGifs.nextPage * PAGE_SIZE,
      });

      setLoading(false);
      setQueriedGifs(prevData => ({
        gifs: [...prevData.gifs, ...response.data],
        nextPage: prevData.nextPage + 1,
      }));
    } catch (e) {
      setLoading(false);

      Toast.showError({
        title: I18n.t(ext('fetchGifsError')),
        message: e.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriedGifs.nextPage, query]);

  const handleEndReached = _.debounce(() => {
    if (loading) {
      return;
    }

    if (!query) {
      fetchTrendingGifs();
    } else {
      fetchSearchQueryGifs();
    }
  }, 100);

  const renderItem = ({ item }) => (
    <GiphyImage item={item} onPress={onGifSelected} />
  );

  const gifList = useMemo(
    () => (query ? queriedGifs.gifs : trendingGifs.gifs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queriedGifs.gifs, trendingGifs.gifs],
  );

  const handleQueryChange = _.debounce(setQuery, 500);

  return (
    <Modal isVisible={isVisible} style={style.modal}>
      <SafeAreaView style={style.screen}>
        <View>
          <Title style={style.title}> {I18n.t(ext('giphyPickerTitle'))}</Title>
          <Button style={style.closeButton} onPress={onClose}>
            <Icon name="close" />
          </Button>
        </View>
        <View style={style.searchInputContainer}>
          <TextInput
            onChangeText={handleQueryChange}
            placeholder={I18n.t(ext('giphyPickerInputPlaceholder'))}
            autoCorrect={false}
            returnKeyType="done"
            style={style.searchInput}
          />
        </View>
        <MasonryList
          data={gifList}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Adding index suffix because there same gif can appear twice
          numColumns={3}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
        />
        <View
          styleName={Platform.OS === 'android' ? 'md-gutter' : 'md-gutter-top'}
        >
          <FastImage
            source={images.GiphyAnimatedLogo}
            resizeMode="contain"
            style={style.giphyPickerFooter}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

GiphyPicker.propTypes = {
  apiKey: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGifSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

GiphyPicker.defaultProps = {
  style: {},
};

export default connectStyle(ext('GiphyPicker'))(GiphyPicker);
