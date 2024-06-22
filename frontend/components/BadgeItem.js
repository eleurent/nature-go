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


export function getCurrentLevelAndProgress(progressData) {
  let currentLevel = null;
  let nextLevelProgress = 0;
  let allUnlocked = true;

  for (const level in progressData) {
    const { unlocked, progress } = progressData[level];

    if (unlocked) {
      currentLevel = level;
    } else {
      allUnlocked = false;
      nextLevelProgress = progress; // Convert to percentage
      break; // Stop after finding the first locked level
    }
  }

  if (allUnlocked) {
    nextLevelProgress = 1;
  }

  return { currentLevel, nextLevelProgress };
}

const ProgressBar = ({level, min, max}) => {
    if (level == max) return null;
    const maxWidth = styles.barBackground.width - 2;
    const width = (level - min) / (max - min) * maxWidth;

    return (
        <View style={styles.barBackground}>
            <View style={[styles.barForeground, {width: width}]}></View>
        </View>
    )
};

export default function BadgeItem({item}, selectedBadge, setSelectedBadge )
{
  const badgeName = item.badge.name.toLowerCase().replace(/ /g, '_'); // Convert to snake_case
  const imageSource = BADGE_IMAGES[badgeName];
  const {currentLevel, nextLevelProgress} = getCurrentLevelAndProgress(item.progress)

  return (
    <TouchableOpacity onPress={() => setSelectedBadge(item)}>
      <Image source={imageSource?.uri} style={styles.badgeImage} />
      <ProgressBar level={nextLevelProgress} min={0} max={1}/>
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
  barBackground: {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 1,
    marginBottom: 10,
    backgroundColor: '#999',
    borderRadius: 5,
    width: 64,
    height: 5,
  },
  barForeground: {
    marginTop: 1,
    marginLeft: 1,
    backgroundColor: '#F5C92D',
    borderRadius: 4.8,
    width: 95,
    height: 3,
  },
});