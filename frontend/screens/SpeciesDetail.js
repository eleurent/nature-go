import React, { useState, useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, ImageBackground, FlatList, Platform, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'; // Using the new hook
import { Ionicons } from '@expo/vector-icons';
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
const SPECIES_GENERATE_ILLUSTRATION_URL = (id) => API_URL + `api/species/${id}/generate_illustration/`;
const SPECIES_GENERATE_AUDIO_DESCRIPTION_URL = (id) => API_URL + `api/species/${id}/generate_audio_description/`;
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


const generateSpeciesDescription = async (species_id, setSpeciesDetails, setIsGeneratingTextContent) => {
    console.log('Generating description for this species');
    setIsGeneratingTextContent(true);
    let response = await axios.post(SPECIES_GENERATE_DESCRIPTIONS_URL(species_id));
    console.log(response.data);
    setSpeciesDetails(response.data);
    setIsGeneratingTextContent(false);
    response = await axios.post(SPECIES_GENERATE_QUESTIONS_URL(species_id));
};

const generateIllustration = async (species_id, setSpeciesDetails, setIsGeneratingIllustration) => {
    console.log('Attempting to generate illustration for species ID:', species_id);
    setIsGeneratingIllustration(true);
    try {
        // Assuming axios is already imported and configured with auth tokens if needed
        const response = await axios.post(SPECIES_GENERATE_ILLUSTRATION_URL(species_id));
        console.log('Illustration generation response:', response.data);
        setSpeciesDetails(response.data); // Update species details with the new illustration URL
    } catch (error) {
        console.error('Failed to generate illustration:', error.response?.data || error.message);
    } finally {
        setIsGeneratingIllustration(false);
    }
};

const generateAudioDescription = async (species_id, setSpeciesDetails, setIsGeneratingAudioContent) => {
    console.log('Generating audio description for this species');
    setIsGeneratingAudioContent(true);
    try {
        let response = await axios.post(SPECIES_GENERATE_AUDIO_DESCRIPTION_URL(species_id));
        console.log(response.data);
        setSpeciesDetails(response.data);
    } catch (error) {
        console.error('Failed to generate audio description:', error.response?.data || error.message);
        // Optionally, display an alert to the user
        // Alert.alert("Error", "Could not generate audio description.");
    } finally {
        setIsGeneratingAudioContent(false);
    }
};

export default function SpeciesDetailScreen({ navigation, route }) {

    const [speciesDetails, setSpeciesDetails] = useState({});
    const [speciesObservations, setSpeciesObservations] = useState([]);
    const [imageModalImage, setImageModalImage] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const onImagePress = (image) => {setImageModalImage(image); setImageModalVisible(true);}
    const [mapModalData, setMapModalData] = useState({initialRegion: null, coordinate: null});
    const [mapModalVisible, setMapModalVisible] = useState(false);
    const [isGeneratingTextContent, setIsGeneratingTextContent] = useState(false);
    const [isGeneratingIllustration, setIsGeneratingIllustration] = useState(false);
    const [isGeneratingAudioContent, setIsGeneratingAudioContent] = useState(false);
    const onMapPress = (initialRegion, coordinate) => {setMapModalData({initialRegion, coordinate}); setMapModalVisible(true);}
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const player = useAudioPlayer(null);
    const audioStatus = useAudioPlayerStatus(player);

    const [observationToDeleteId, setObservationToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);


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

    // Autoplay Effect for audio player
    useEffect(() => {
        if (player && speciesDetails.audio_description && player.isLoaded && !player.playing) {
            player.play();
        }
    }, [speciesDetails.audio_description, player.isLoaded]);


    const handlePlayPause = async () => {
        if (!player || !player.isLoaded) { // Check if player is available and loaded
            if (speciesDetails.audio_description) {
                 Alert.alert("Audio Not Ready", "Audio is loading or not available. Please wait.");
            } else {
                Alert.alert("No Audio", "No audio description available for this species.");
            }
            return;
        }
        if (player.error) {
            Alert.alert("Audio Error", "Cannot play audio due to an error.");
            return;
        }

        if (player.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

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

    let illustration_url = speciesDetails.illustration_url;
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

    useEffect(() => {
        if (speciesDetails?.descriptions && !(speciesDetails?.descriptions.length) && !isGeneratingTextContent)
            generateSpeciesDescription(route.params.id, setSpeciesDetails, setIsGeneratingTextContent)

        if (speciesDetails && speciesDetails.id && !speciesDetails.illustration_url && !isGeneratingIllustration) {
            generateIllustration(speciesDetails.id, setSpeciesDetails, setIsGeneratingIllustration);
        }
        if (speciesDetails && speciesDetails.id && !speciesDetails.audio_description && !isGeneratingAudioContent) {
            generateAudioDescription(speciesDetails.id, setSpeciesDetails, setIsGeneratingAudioContent);
        }
    }, [speciesDetails, isGeneratingTextContent, isGeneratingIllustration, isGeneratingAudioContent, route.params.id]);

    useEffect(() => {
        if (speciesDetails && speciesDetails.id && speciesDetails.audio_description &&
            !player.source) {
                player.replace({uri: speciesDetails.audio_description});
        }
    }, [speciesDetails]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/page-background.png')} style={styles.containerImage}>
                <ScrollView>
                {isGeneratingIllustration && !illustration_url ? (
                    <View style={[styles.illustrationImage, styles.loadingImageContainer]}>
                        <ActivityIndicator size="large" color="#007bff" />
                        <Text style={styles.loadingText}>Sketching the observed specimen...</Text>
                    </View>
                ) : (
                    <Image
                        style={styles.illustrationImage}
                        contentFit='contain'
                        source={{ uri: illustration_url }}
                        placeholder='empty' // Or a specific placeholder image asset
                        cachePolicy={'disk'}
                    />
                )}
                <View style={styles.textContainer}>
                    <View style={styles.nameContainer}>
                        <View style={styles.nameTextContainer}>
                            <Text style={[styles.speciesName]}>{speciesDetails.display_name ? speciesDetails.display_name : "Name"}</Text>
                            <Text style={[styles.speciesScientificName, {marginBottom: 5}]}>{speciesDetails.scientificNameWithoutAuthor ? speciesDetails.scientificNameWithoutAuthor : "Scientific name"}</Text>
                        </View>
                    </View>
                    {speciesDetails.rarity ? <View style={styles.rarityContainer}><RarityBadge rarity={speciesDetails.rarity} /></View> : null}

                    <View style={styles.descriptionAreaWrapper}>
                        {speciesDetails.audio_description && player && (
                            <TouchableOpacity onPress={handlePlayPause} style={styles.audioButtonDescriptionArea}>
                                {(audioStatus.playing && !audioStatus.didJustFinish) ? (
                                    <Ionicons name="pause-circle" size={26} color="#331100" />
                                ) : (
                                    <Ionicons name="play-circle" size={26} color="#331100" />
                                )}
                            </TouchableOpacity>
                        )}
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
        flexDirection: 'row',
        justifyContent: 'space-between', // Pushes name and button to opposite ends
        alignItems: 'center', // Vertically align items in the center
        paddingHorizontal: 20, // Add some horizontal padding
        marginTop: 10,
    },
    nameTextContainer: {
        flex: 1, // Allows text container to take up available space
        alignItems: 'center', // Center the text block itself
    },
    // audioButton style removed as it's no longer used.
    descriptionAreaWrapper: {
        position: 'relative', // Needed for absolute positioning of the child button
        paddingTop: 5, // Add a little padding at the top if button is too close to elements above
    },
    audioButtonDescriptionArea: {
        position: 'absolute',
        top: -20, // Adjust as needed from the top of descriptionAreaWrapper
        right: 15, // Adjust as needed from the right of descriptionAreaWrapper
        zIndex: 1, // Ensure button is on top
        padding: 5, // Add some touchable area around the icon
        // backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: for better visibility on varied backgrounds
        // borderRadius: 20, // Optional: for rounded background
    },
    // Ensure speciesName and speciesScientificName are centered if they were individually centered before
    speciesName: {
        fontFamily: 'SpecialElite_400Regular',
        fontWeight: '400', // Note: fontWeight for custom fonts might not always behave as expected. Ensure font supports it.
        fontSize: 20,
        color: '#331100',
        opacity: 0.9,
        textAlign: 'center', // Center text within its container
    },
    speciesScientificName: {
        fontSize: 12,
        color: '#332200',
        opacity: 0.7,
        textAlign: 'center', // Center text
    },
    rarityContainer: {
        alignItems: 'center', // Center the rarity badge
        marginBottom: 5,
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
    loadingImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333'
    },
});
