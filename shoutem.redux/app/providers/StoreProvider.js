import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export function StoreProvider(props) {
  const { children, store, ...otherProps } = props;

  return (
    <Provider store={store}>
      <View style={styles.container}>{children}</View>
    </Provider>
  );
}
