import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export const AdContext = React.createContext();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class AdProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    ads: PropTypes.object,
  };

  render() {
    const { children, ads } = this.props;

    return (
      <AdContext.Provider value={ads}>
        <View style={styles.container}>
          {children}
        </View>
      </AdContext.Provider>
    );
  }
}
