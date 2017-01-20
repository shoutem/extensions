import React, {
  Component
} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Image,
  Row,
  ListView,
  DropDownMenu,
  Text,
  IconButton,
  View,
  Icon,
  Tile,
  Title,
  Subtitle,
  Overlay,
  Screen,
  Divider,
  Caption,
  Heading,
  Button
} from '@shoutem/ui';
import { connect } from 'react-redux';
import { navigateTo } from '@shoutem/core/navigation';
import { bindActionCreators } from 'redux';
import { ext } from '../const';
import * as _ from 'lodash';
import {
  isBusy,
  find,
  getCollection,
  shouldRefresh,
  isInitialized
} from '@shoutem/redux-io';

class PlacesListPhoto extends Component {


constructor(props)
{
    super(props);
    const categoryIds = this.props.categoryIds || [this.props.parentCategoryId];
    this.state = {selectedCategory: null, selectedCategoryIds: [...categoryIds]};
    this.loadPlaces = this.loadPlaces.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onCategorySelected = this.onCategorySelected.bind(this);
  }

  checkForImage(place){
    if(place.image)
    return ({uri: place.image.url}) ;

    else
    return (require('../assets/images/fallback_medium.png'));
}

  componentDidMount() {

    const { places, placeCategories, parentCategoryId } = this.props;
    const { selectedCategoryIds } = this.state;
    if (shouldRefresh(places)) {
      this.loadPlaces();
    }

    if (parentCategoryId && shouldRefresh(placeCategories)) {
      this.loadCategories();
    }
  }

  loadPlaces()
{

    const { find } = this.props;
    const { selectedCategoryIds } = this.state;

     if (selectedCategoryIds.length > 0) {
    find(ext('places'), 'all', {
        'filter[categories]': selectedCategoryIds.join(','),
    });}

    else {
      find(ext('places'), 'all');
    }

}

  loadCategories()

  {
    const { find, parentCategoryId } = this.props;
    find("shoutem.core.categories",'placeCategories',{
      'filter[parent]': parentCategoryId,
    });
  }

  onCategorySelected(category){

    this.setState({
      selectedCategory: category,
      selectedCategoryIds: [category.id],
    },this.loadPlaces);
  }

  renderDropDown(){

const { placeCategories, parentCategoryId } = this.props;
const { selectedCategoryIds } = this.state;

if (!parentCategoryId) {
      return null;
    }

  return (
    <DropDownMenu styleName='horizontal'
      options={placeCategories}
      onOptionSelected={this.onCategorySelected}
      selectedOption={this.state.selectedCategory}
      titleProperty={"name"}
      valueProperty={"id"}/>
      );
  }

  renderRow(place) {

    const { navigateTo } = this.props;

    return (
      <TouchableOpacity onPress={() => navigateTo({
          screen: ext('PlacesDetailsLarge'),
          props: { place }
        })}>

          <Image styleName="large-banner" source={this.checkForImage(place)}>
                  <Tile>

              <View styleName="actions">
                <Button styleName="tight clear"><Icon name="add-to-favorites"/></Button>
              </View>
              <Title numberOfLines={2}>{place.name.toUpperCase()}</Title>
              <Caption >{place.address}</Caption>
              </Tile>
          </Image>

      </TouchableOpacity>
    );
  }

  render() {

    const { places, placeCategories, navigateTo } = this.props;
    const { selectedCategory } = this.state;
    this.props.setNavBarProps({
      leftComponent: <Text/>,
      centerComponent: <Text>PLACES</Text>,
      rightComponent: <TouchableOpacity onPress={() => navigateTo({
          screen: ext('MapList'),
          props: { places, passCat: this.state.selectedCategory }
        })}><View styleName="centered"><Text>Map</Text></View></TouchableOpacity>
    });



    return (
      <Screen>
          {this.renderDropDown()}
      <ListView
        data={places}
        loading={isBusy(places)||!isInitialized(places)}
        renderRow={place => this.renderRow(place, navigateTo)}
        onRefresh={this.loadPlaces}
      />
      </Screen>
   );
  }
}

export default connect(
  (state, ownProps) => ({
    parentCategoryId: _.get(ownProps, 'parentCategory.id'),
    places: getCollection(state[ext()].allPlaces, state),
    placeCategories: getCollection(state[ext()].placeCategories, state)
  }),
  (dispatch) => bindActionCreators({ navigateTo, find }, dispatch)
)(PlacesListPhoto);
