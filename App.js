import axios from 'axios';
import { useState } from 'react'; 
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import IconButton from './components/IconButton';
import IdentificationDetails from './components/IdentificationDetails';

const PlaceholderImage = require('./assets/images/background-image.png');
const PlaceholderResponse = require('./assets/example-response.json');
const API_URL = 'https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&lang=fr&api-key=';
const ApiKey = require('./assets/api-key.json');

export default function App() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResults, setApiResults] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      selectImage(result.assets[0].uri)
    } else {
      alert('You did not select any image.');
    }
  };

  const selectImage = (uri) => {
    setSelectedImage(uri);
    if (Platform.OS === 'web')
      handlePlantNetResponse(PlaceholderResponse);
    else
      callPlantNetAPI(uri);
    setShowAppOptions(true);
  }

  const onReset = () => {
    setShowAppOptions(false);
    setApiResults(null);
    setSelectedImage(null);
  };

  const callPlantNetAPI = async (imageUri) => {
    setIsLoading(true);
    const uri = imageUri;
    const formData = new FormData();
    formData.append('images', {
      uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    formData.append('organs', 'flower');
    try {
      const response = await axios.post(
        API_URL + ApiKey.key,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      handlePlantNetResponse(response.data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handlePlantNetResponse = (data) => {
    setApiResults(data.results[0]);
  };




  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
        <IdentificationDetails result={apiResults} />
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          {isLoading && <ActivityIndicator />}
          <Text>{responseText}</Text>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset}/>
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
          <Button label="View album" onPress={() => alert("Album")}/>
          {(Platform.OS === 'web') ? (<Button label="Use this photo" onPress={() => selectImage(null)} />) : (null)}
        </View>
      )}

      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1 ,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

