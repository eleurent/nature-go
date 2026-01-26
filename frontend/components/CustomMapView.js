import React from 'react';
import { View, Text } from 'react-native';

let MapView, Marker;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
} catch (e) {
  // Fallback mock components when native module is not available
  MapView = (props) => (
    <View style={[{ backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }, props.style]}>
      <Text style={{ color: '#666' }}>Maps not available in this environment</Text>
    </View>
  );
  
  Marker = (props) => <View />;
}

export default MapView;
export { Marker };