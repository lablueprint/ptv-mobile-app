import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

export default function DefaultNotifications() {
  return (
    <View style={defaultNotificationStyles.container}>
      <IconButton icon="bell" />
      <Text>No New Notifications</Text>
    </View>

  );
}

const defaultNotificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
  },
});
