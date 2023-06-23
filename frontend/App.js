import { useState } from 'react'; 
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button } from 'react-native';

export default function App() {

  const HomeScreen = ({ navigation }) => {
    return (
      <Button
        title="Botany"
        onPress={() =>
          navigation.navigate('SpeciesList')
        }
      />
    );
  };

  const SpeciesListScreen = ({ navigation, route }) => {
    const species_list = ['Edelweiss', 'Harebell'];
    return (
      <>{
        species_list.map((data, index) => {
          return (
            <Button key={index} title={data} onPress={() => navigation.navigate('SpeciesDetail', { name: data })} />
          );
        })
      }</>
    );
  };

  const SpeciesDetailScreen = ({ navigation, route }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{route.params.name}</Text>
      </View>
    );
  };

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Contents' }}
        />
        <Stack.Screen name="SpeciesList" component={SpeciesListScreen}
          options={{ title: 'Botany' }} />
        <Stack.Screen name="SpeciesDetail" component={SpeciesDetailScreen} options={{ title: 'Species detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
});

