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
  Button,
  View,
  Icon,
  Tile,
  Title,
  Subtitle,
  Overlay,
  Screen,
  Divider,
  Caption
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


constructor(props){

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
return (require('../assets/data/no_image.png'));
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
    find(ext('places'), 'all', {
        'filter[categories]': selectedCategoryIds.join(','),
    });

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

const { placeCategories } = this.props;
const { selectedCategoryIds } = this.state;
if (selectedCategoryIds.length > 0) {
  return (
    <DropDownMenu styleName='horizontal'
      options={placeCategories}
      onOptionSelected={this.onCategorySelected}
      selectedOption={this.state.selectedCategory}
      titleProperty={"name"}
      valueProperty={"id"}/>
      );
  }}

  renderRow(place) {

    const { navigateTo } = this.props;

    return (
      <View>
      <TouchableOpacity onPress={() => navigateTo({
          screen: ext('PlacesDetailsLarge'),
          props: { place }
        })}>

        <Row>
          <Image styleName="small" source={this.checkForImage(place)}/>
          <View styleName="vertical">
          <Subtitle numberOfLines={1}>{place.name}</Subtitle>
            <Caption numberOfLines={2}>{place.address}</Caption>
          </View>
            <Button styleName="right-icon"><Icon name="add-to-favorites"/></Button>
            </Row>

      </TouchableOpacity>
      <Divider styleName="line"/>
      </View>

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
        })}><View><Text>Map</Text></View></TouchableOpacity>
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
