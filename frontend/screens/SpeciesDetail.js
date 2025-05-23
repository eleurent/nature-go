import React, { useState, useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, ImageBackground, FlatList, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements'
import axios from 'axios';
import Constants from 'expo-constants'
import ObservationCarousel from '../components/ObservationCarousel';
import ImageModal from '../components/ImageModal';
import MapModal from '../components/MapModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Badge } from '@rneui/themed';
  import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const API_URL = Constants.expoConfig.extra.API_URL;
const SPECIES_DETAILS_URL = (id) => API_URL + `api/species/${id}/`
const SPECIES_OBSERVATIONS_URL = (id) => API_URL + `api/species/${id}/observations/`
const SPECIES_GENERATE_DESCRIPTIONS_URL = (id) => API_URL + `api/species/${id}/generate_descriptions/`
const SPECIES_GENERATE_QUESTIONS_URL = (id) => API_URL + `api/university/quiz/questions/generate/${id}/`
const OBSERVATION_DELETE_URL = (id) => API_URL + `api/species/observation/${id}/delete/`; // Define delete URL



const GradientText = ({ children, style, placeholder, ...rest }) => {
    const gradientColors = ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'];
    const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

    const placeholderSyle = { color: 'black', marginTop: -40, fontSize: 16, paddingHorizontal: 20, textAlign: 'center', };
    if (placeholder == "1 more observation needed.")
        placeholder = <Text style={placeholderSyle}><B>1</B> more observation needed.</Text>
    else if (placeholder) {
        placeholder = <Text style={placeholderSyle}>{placeholder}</Text>
    }
    if (!children)
        return placeholder;
    return (
    <View>
      <MaskedView
        maskElement={
          <Text style={style} {...rest}>
            {children}
          </Text>
        }>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <Text style={[style, { opacity: 0 }]} {...rest}>
            {children}
          </Text>
        </LinearGradient>
      </MaskedView>
      { placeholder }
      </View>
    );
  };

const RarityBadge = ({ rarity }) => {

    const rarityStyles = {
        'Very Common': { backgroundColor: '#333', borderColor: '#333' },
        'Common': { backgroundColor: '#333', borderColor: '#333' },
        'Uncommon': { backgroundColor: '#070', borderColor: '#070' },
        'Rare': { backgroundColor: '#05f', borderColor: '#05f' },
        'Legendary': { backgroundColor: '#e60', borderColor: '#e60' },
    };

    return (
      <Badge
        value={rarity}
        status="primary"
        badgeStyle={rarityStyles[rarity]}
        textStyle={{color:"#efe"}}
      />
    );
  };


const generateSpeciesDescription = async (species_id, setSpeciesDetails, setGeneratingContent) => {
    console.log('Generating description for this species');
    setGeneratingContent(true);
    let response = await axios.post(SPECIES_GENERATE_DESCRIPTIONS_URL(species_id));
    console.log(response.data);
    setSpeciesDetails(response.data);
    setGeneratingContent(false);
    response = await axios.post(SPECIES_GENERATE_QUESTIONS_URL(species_id));
};

export default function SpeciesDetailScreen({ navigation, route }) {

    const [speciesDetails, setSpeciesDetails] = useState({});
    const [speciesObservations, setSpeciesObservations] = useState([]);
    const [imageModalImage, setImageModalImage] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const onImagePress = (image) => {setImageModalImage(image); setImageModalVisible(true);}
    const [mapModalData, setMapModalData] = useState({initialRegion: null, coordinate: null});
    const [mapModalVisible, setMapModalVisible] = useState(false);
    const [generatingContent, setGeneratingContent] = useState(false);
    const onMapPress = (initialRegion, coordinate) => {setMapModalData({initialRegion, coordinate}); setMapModalVisible(true);}
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [observationToDeleteId, setObservationToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // Loading state for deletion


    useEffect(() => {
        const fetchSpeciesDetails = async () => {
            const response = await axios.get(SPECIES_DETAILS_URL(route.params.id));
            console.log(response.data);
            setSpeciesDetails(response.data);
        };
        const fetchSpeciesObservations = async () => {
            const response = await axios.get(SPECIES_OBSERVATIONS_URL(route.params.id));
            console.log(response.data);
            setSpeciesObservations(response.data);
        };

        fetchSpeciesDetails();
        fetchSpeciesObservations();
    }, []);


    // --- HANDLERS FOR DELETE MODAL ---
    const handleLongPressObservation = useCallback((obsId) => {
        console.log("Long press on observation ID:", obsId);
        setObservationToDeleteId(obsId);
        setIsDeleteModalVisible(true);
    }, []); // useCallback ensures the function identity is stable

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setObservationToDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (!observationToDeleteId) return;
        setIsDeleting(true); // Start loading indicator

        try {
            await axios.delete(OBSERVATION_DELETE_URL(observationToDeleteId));

            // Remove observation from state locally
            setSpeciesObservations(prevObservations =>
                prevObservations.filter(obs => obs.id !== observationToDeleteId)
            );

            Alert.alert("Success", "Observation deleted."); // User feedback
            handleCancelDelete(); // Close modal and reset state

        } catch (error) {
            console.error("Failed to delete observation:", error.response?.data || error.message);
            Alert.alert("Error", `Could not delete observation. ${error.response?.data?.detail || 'Please try again.'}`);
        } finally {
             setIsDeleting(false); // Stop loading indicator
        }
    };
    // --- END DELETE MODAL HANDLERS ---

    let illustration_url = ("illustration_url" in speciesDetails) ? 
                           speciesDetails.illustration_url.replace('http://localhost/', API_URL) : null;
    const unlockedSummaries = speciesDetails.descriptions ? speciesDetails.descriptions.slice(0, speciesObservations.length) : [];
    const lockedSummary = speciesDetails.descriptions && (speciesDetails.descriptions.length > speciesObservations.length) ? speciesDetails.descriptions[speciesObservations.length] : [];

    let observationDate = (speciesObservations && speciesObservations[0]) ? new Date(speciesObservations[0].datetime) : null;
    if (observationDate) {
        observationDate.setFullYear(observationDate.getFullYear() - 200);
        observationDate = observationDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    }
    let descriptionsPlaceholder = null;
    if (!(speciesDetails?.descriptions) || !(speciesDetails?.descriptions.length))
        descriptionsPlaceholder = "I need more time to study this specimen.";
    else if (speciesDetails.descriptions.length > speciesObservations.length)
        descriptionsPlaceholder = "1 more observation needed.";

    if (!generatingContent &&speciesDetails?.descriptions && !(speciesDetails?.descriptions.length))
        generateSpeciesDescription(route.params.id, setSpeciesDetails, setGeneratingContent)

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <ScrollView>
                <Image
                    style={styles.illustrationImage}
                    contentFit='contain'
                    source={{ uri: illustration_url }}
                    placeholder='empty'
                    cachePolicy={'disk'}
                    // sharedTransitionTag={"species" + route.params.id}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.speciesName, styles.nameContainer]}>{speciesDetails.display_name ? speciesDetails.display_name : "Name"}</Text>
                    <Text style={[styles.speciesScientificName, styles.nameContainer, {marginBottom: 5}]}>{speciesDetails.scientificNameWithoutAuthor ? speciesDetails.scientificNameWithoutAuthor : "Scientific name"}</Text>
                    {speciesDetails.rarity ? <RarityBadge rarity={speciesDetails.rarity} /> : null}
                    <FlatList
                        vertical
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={Platform.OS === 'web'}
                        data={unlockedSummaries}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <Text key={index} style={styles.descriptionText}>
                                    { item.replace('[DATE]', 'On ' + observationDate) }
                                </Text>
                            );
                        }}
                    />
                    <GradientText style={[styles.descriptionText, {height: 50}]} placeholder={descriptionsPlaceholder}>{ lockedSummary }</GradientText>
                    <View style = {{ marginBottom: 20 }}></View>
                </View>
                <ImageModal modalVisible={imageModalVisible} setModalVisible={setImageModalVisible} modalImage={imageModalImage}/>
                <MapModal modalVisible={mapModalVisible} setModalVisible={setMapModalVisible} initialRegion={mapModalData.initialRegion} coordinate={mapModalData.coordinate}/>
                <ConfirmationModal
                    visible={isDeleteModalVisible}
                    title="Delete Observation"
                    message="Are you sure you want to delete this observation? This action cannot be undone."
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
                 {isDeleting && <ActivityIndicator size="large" color="#d9534f" style={styles.loadingIndicator} />}
                <ObservationCarousel observations={speciesObservations} onImagePress={onImagePress} onMapPress={onMapPress} onLongPressObservation={handleLongPressObservation}/>
                </ScrollView>
            </ImageBackground>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    illustrationImage: {
        marginTop: 60,
        width: 375,
        height: 375,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    nameContainer: {
        textAlign: 'center',
    },
    speciesName: {
        marginTop: 10,
        fontFamily: 'SpecialElite_400Regular',
        fontWeight: 400,
        fontSize: 20,
        color: '#331100',
        opacity: 0.9
    },
    speciesScientificName: {
        // fontFamily: 'Tinos_400Regular_Italic',
        fontSize: 12,
        color: '#332200',
        opacity: 0.7
    },
    descriptionText: {
        fontFamily: 'SpecialElite_400Regular',
        fontSize: 15,
        // fontFamily: 'Parisienne_400Regular',
        // fontSize: 20,
        color:  '#332200',
        opacity: 0.7,
        marginTop: 15,
        paddingHorizontal: 20,
        textAlign: 'justify',
    },
});
