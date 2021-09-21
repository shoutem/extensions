import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Subtitle,
  Row,
  View,
  Caption,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';

const ListPeopleView = ({ person, onPress: onPressHandler }) => {
  const onPress = () => {
    onPressHandler(person);
  };

  return (
    <TouchableOpacity key={person.id} onPress={onPress}>
      <View>
        <Row>
          <Image
            source={{ uri: person.image ? person.image.url : undefined }}
            styleName="small rounded-corners placeholder"
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>
              {person.firstName} {person.lastName}
            </Subtitle>
            <Caption>{person.profession}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </View>
    </TouchableOpacity>
  );
};

ListPeopleView.propTypes = {
  onPress: PropTypes.func,
  person: PropTypes.object.isRequired,
};

export default ListPeopleView;
