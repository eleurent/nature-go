import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable, FlatList, Modal, Button } from 'react-native';

export const BADGE_IMAGES = {
  corvid_connoisseur: {
    uri: require('../assets/images/badges/corvids.png')
  },
  owl_observer: {
    uri: require('../assets/images/badges/owls.png')
  },
  raptor_ranger: {
    uri: require('../assets/images/badges/raptors.png')
  },
  duck_dynasty: {
    uri: require('../assets/images/badges/duck.png')
  },
  woodland_wanderer: {
    uri: require('../assets/images/badges/woodland.png')
  },
  backyard_birder: {
    uri: require('../assets/images/badges/backyard.png')
  },
  songbird_specialist: {
    uri: require('../assets/images/badges/songbird.png')
  },
  coastal_connoisseur: {
    uri: require('../assets/images/badges/coastal.png')
  },
  waterfowl_whisperer: {
    uri: require('../assets/images/badges/waterfowl.png')
  },
}


export default function BadgeItem({item}, selectedBadge, setSelectedBadge )
{
  const badgeName = item.badge.name.toLowerCase().replace(/ /g, '_'); // Convert to snake_case
  const imageSource = BADGE_IMAGES[badgeName];

  return (
    <TouchableOpacity onPress={() => setSelectedBadge(item)}>
      <Image source={imageSource?.uri} style={styles.badgeImage} />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({ 
  badgesContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  badgeImage : {
    width: 96,
    height: 96,
  },
});