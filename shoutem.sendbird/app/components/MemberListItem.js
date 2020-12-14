import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Row,
  Image,
  ImageBackground,
  View,
  Subtitle,
  TouchableOpacity,
} from '@shoutem/ui';
import { navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

class MemberListItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    user: PropTypes.object,
    style: PropTypes.shape({
      row: Row.propTypes.style,
      image: Image.propTypes.style,
      indicator: Image.propTypes.style,
    }),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleUserPress() {
    const { navigateTo, user } = this.props;

    Keyboard.dismiss();

    return navigateTo({
      screen: ext('ChatWindowScreen'),
      props: { user },
    });
  }

  render() {
    const { user, style } = this.props;

    const profileImageUrl = _.get(user, 'profile.image');
    const memberName = _.get(user, 'profile.name') || _.get(user, 'profile.nick', '');

    return (
      <TouchableOpacity onPress={this.handleUserPress}>
        <Row style={style.row}>
          <ImageBackground
            imageStyle={style.image}
            source={{ uri: profileImageUrl }}
            style={style.image}
            styleName="small"
          />
          <View styleName="vertical v-start">
            <View styleName="horizontal space-between v-center">
              <Subtitle
                style={[style.text, style.nickname]}
              >
                {memberName}
              </Subtitle>
            </View>
          </View>
        </Row>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state) {
  return {
    state,
  };
}

export const mapDispatchToProps = {
  navigateTo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MemberListItem'))(MemberListItem));

