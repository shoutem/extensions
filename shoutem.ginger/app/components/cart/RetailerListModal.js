import React from 'react';
import { Modal, Pressable } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

export function RetailerListModal({ visible, onClose, retailers, style }) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={style.container} onPress={onClose}>
        <Pressable style={style.contentContainer} onPress={_.noop}>
          <View style={style.titleContainer}>
            <Text style={style.title}>
              {I18n.t(ext('cartRetailersModalTitle'))}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" style={style.closeIcon} />
            </TouchableOpacity>
          </View>
          <Text style={style.text}>
            {I18n.t(ext('cartRetailersModalDescription'))}
          </Text>
          <View style={style.licencesContainer}>
            <View style={style.rowContainer}>
              <Text style={style.title}>
                {I18n.t(ext('cartRetailersModalRetailersCaption'))}
              </Text>
              {_.map(retailers, retailer => (
                <Text key={retailer.name} style={style.text}>
                  {retailer.name}
                </Text>
              ))}
            </View>
            <View style={style.rowContainer}>
              <Text style={style.title}>
                {I18n.t(ext('cartRetailersModalLicenceCaption'))}
              </Text>
              {_.map(retailers, retailer => (
                <Text key={retailer.licence} style={style.text}>
                  {retailer.licence}
                </Text>
              ))}
            </View>
          </View>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
}

RetailerListModal.propTypes = {
  retailers: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  visible: PropTypes.bool,
};

RetailerListModal.defaultProps = {
  visible: false,
  style: {},
};

export default connectStyle(ext('RetailerListModal'))(RetailerListModal);
