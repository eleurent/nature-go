import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable, FlatList, Modal, Button } from 'react-native';
import { BADGE_IMAGES, getCurrentLevelAndProgress } from  './BadgeItem';


export default function BadgeModal(selectedBadge, setSelectedBadge)
{
  if (!selectedBadge) return null;
  const badgeName = selectedBadge.badge.name.toLowerCase().replace(/ /g, '_'); // Convert to snake_case
  const imageSource = BADGE_IMAGES[badgeName];

  const isSpeciesObserved = (selectedBadge, speciesId) => selectedBadge.badge?.species_observed.some(
      (observedSpecies) => observedSpecies.id === speciesId
  );
  const { currentLevel, nextLevelProgress } = getCurrentLevelAndProgress(selectedBadge.progress);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Image source={imageSource?.uri} style={styles.modalBadgeImage} />
        <Text style={styles.modalTitle}>{selectedBadge.badge.name}</Text>
        <Text style={styles.modalLevel}>{currentLevel ? 'Level: ' + currentLevel + ' - ' : ''} {parseInt(nextLevelProgress * 100)}%</Text>
        
        <Text>{selectedBadge.badge.description}</Text>
        {selectedBadge.badge.species_list && (
          <FlatList
              data={selectedBadge.badge.species_list}
              keyExtractor={(species) => species.id.toString()}
              renderItem={({ item: species }) => (
              <Text
                  key={species.id}
                  style={[
                  styles.speciesItem,
                  isSpeciesObserved(selectedBadge, species.id) && styles.observedSpecies
                  ]}
              >
                  {species.display_name} {isSpeciesObserved({selectedBadge}, species.id) && "(Observed)"}
              </Text>
              )}
              style={styles.speciesList}
          />
          )}
        <Button title="Close" onPress={() => setSelectedBadge(null)} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({ 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 235, 180, 1)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBadgeImage: {
    width: 196,
    height: 196,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalLevel: {
    fontSize: 14,
    marginBottom: 5,
  },
  speciesList: {
    maxHeight: 200,
    paddingTop: 15,
  },
  speciesItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  observedSpecies: {
    fontWeight: 'bold',
  },
});