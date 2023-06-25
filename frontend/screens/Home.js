import React, { useContext } from 'react';
import { AuthContext } from '../authContext';
import { View, Text, TextInput, Button } from 'react-native';


export default function HomeScreen({ navigation }) {
    const { authMethods } = useContext(AuthContext);

    return (
        <View>
            <Button
                title="Botany"
                onPress={() =>
                    navigation.navigate('SpeciesList')
                }
            />
            <Button
                title="Sign out"
                onPress={authMethods.signOut}
            />
        </View>
    );
};
