import React, { Component } from 'react';

import {
  ListView,
  DropDownMenu,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';

import { connect } from 'react-redux';
import {
  find,
  clear,
  getCollection,
  isBusy,
  isInitialized,
  shouldRefresh,
  next
} from '@shoutem/redux-io';

import { ext } from '../const';
import ListPhotoView from '../components/ListPhotoView';

import _ from 'lodash';

export class PhotosList extends Component {

  constructor(props, context){
    super(props, context);
    this.fetchPhotos = this.fetchPhotos.bind(this);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onCategorySelected = this.onCategorySelected.bind(this);
    this.loadMorePhotos = this.loadMorePhotos.bind(this);

    const categoryIds = this.props.categoryIds || [this.props.parentCategoryId];
    this.state = {
      selectedCategory: null,
      selectedCategoryIds: [...categoryIds],
    };
  }

  componentWillMount() {
    const { photos, rssPhotos, categories, parentCategoryId, feedUrl } = this.props;

    if (parentCategoryId && shouldRefresh(categories)) {
      this.fetchCategories();
      return;
    }
    if (!feedUrl && shouldRefresh(photos) || feedUrl && shouldRefresh(rssPhotos)) {
      this.fetchPhotos();
    }
  }

  onCategorySelected(category){
    this.props.clear(ext('Photos'), 'all');
    this.setState({
      selectedCategory: category,
      selectedCategoryIds: [category.id],
    },this.fetchPhotos);
  }

  fetchCategories(){
    const { find, parentCategoryId } = this.props;
    find('shoutem.core.categories','photosCategories',{
      'filter[parent]': parentCategoryId,
    });
  }

  fetchPhotos(){
    const { find, feedUrl } = this.props;
    const { selectedCategoryIds } = this.state;

    if (feedUrl) {
      find('shoutem.proxy.photos', 'allRssPhotos', {
        'filter[url]': feedUrl,
      });
    }
    else {
      find(ext('Photos'), 'all', {
          'filter[categories]': selectedCategoryIds.join(','),
      });
    }
  }

  loadMorePhotos() {
    this.props.next(this.props.photos);
  }

  openDetailsScreen(photo){
      const { navigateTo, photos, rssPhotos, feedUrl } = this.props;

      if(feedUrl){
      const route = {
          screen: ext('PhotoDetails'),
          props: { photo, photos: this.props.rssPhotos }
        };
        navigateTo(route);
      }
      else {
        const route = {
          screen: ext('PhotoDetails'),
          props: { photo, photos }
        };
        navigateTo(route);
      }
  }

  renderCategoriesDropDown(){
    const { categories, parentCategoryId } = this.props;
    const { selectedCategory } = this.state;

    if (!parentCategoryId) {
      return null;
    }

    return (
      <DropDownMenu
        options={categories}
        titleProperty={"name"}
        valueProperty={"id"}
        onOptionSelected={this.onCategorySelected}
        selectedOption={selectedCategory}
      />
    );
  }

  renderNavBar() {
    const { setNavBarProps, title } = this.props;
    const screenTitle = title || 'Photos';

    setNavBarProps({
      rightComponent: this.renderCategoriesDropDown(),
      title: screenTitle.toUpperCase(),
      style: style,
    });
  }

  renderRow(photo) {
    return (
        <ListPhotoView key={photo.id}
            photo={photo}
            onPress={this.openDetailsScreen}
        />
    );
  }

  renderPhotos(photos){
    return (
      <ListView
          data={photos}
          renderRow={this.renderRow}
          loading={isBusy(photos) || !isInitialized(photos)}
          onRefresh={this.fetchPhotos}
          onLoadMore={this.loadMorePhotos}
          autoHideHeader={true}
        />
      )
  }

  render() {
    const { photos, rssPhotos, feedUrl } = this.props;
    this.renderNavBar();

    if(!feedUrl){
      return (
        <View renderToHardwareTextureAndroid style={{flex:1}}>
          {this.renderPhotos(photos)}
        </View>
      );
    }
    else{
      return (
        <View renderToHardwareTextureAndroid style={{flex:1}}>
          {this.renderPhotos(rssPhotos)}
        </View>
      );
    }
  }

}

const style = {
  rightComponent: {
    marginRight: -8
  }
}

export const mapStateToProps = (state, ownProps) => {
  return {
    parentCategoryId: _.get(ownProps, 'parentCategory.id'),
    photos: getCollection(state[ext()].allPhotos, state),
    rssPhotos: getCollection(state[ext()].allRssPhotos, state),
    categories: getCollection(state[ext()].photosCategories, state),
  };
};

export const mapDispatchToProps = { navigateTo, find, clear, next };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PhotosList'), {})(PhotosList)
);

