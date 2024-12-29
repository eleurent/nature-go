import { View, Text, Image, StyleSheet, ImageBackground, Pressable, FlatList, Modal, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BADGE_IMAGES = {
  corvid_connoisseur: {
    uri: require('../assets/images/badges/corvids.png'),
    bronze: require('../assets/images/badges/bronze/corvids.png'),
    silver: require('../assets/images/badges/silver/corvids.png'),
    none: require('../assets/images/badges/none/corvids.png'),
  },
  owl_observer: {
    uri: require('../assets/images/badges/owls.png'),
    bronze: require('../assets/images/badges/bronze/owls.png'),
    silver: require('../assets/images/badges/silver/owls.png'),
    none: require('../assets/images/badges/none/owls.png'),
  },
  raptor_ranger: {
    uri: require('../assets/images/badges/raptors.png'),
    bronze: require('../assets/images/badges/bronze/raptors.png'),
    silver: require('../assets/images/badges/silver/raptors.png'),
    none: require('../assets/images/badges/none/raptors.png'),
  },
  wading_wonderer: {
    uri: require('../assets/images/badges/wading.png'),
    bronze: require('../assets/images/badges/bronze/wading.png'),
    silver: require('../assets/images/badges/silver/wading.png'),
    none: require('../assets/images/badges/none/wading.png'),
  },
  woodland_wanderer: {
    uri: require('../assets/images/badges/woodland.png'),
    bronze: require('../assets/images/badges/bronze/woodland.png'),
    silver: require('../assets/images/badges/silver/woodland.png'),
    none: require('../assets/images/badges/none/woodland.png'),
  },
  backyard_birder: {
    uri: require('../assets/images/badges/backyard.png'),
    bronze: require('../assets/images/badges/bronze/backyard.png'),
    silver: require('../assets/images/badges/silver/backyard.png'),
    none: require('../assets/images/badges/none/backyard.png'),
  },
  songbird_specialist: {
    uri: require('../assets/images/badges/songbird.png'),
    bronze: require('../assets/images/badges/bronze/songbird.png'),
    silver: require('../assets/images/badges/silver/songbird.png'),
    none: require('../assets/images/badges/none/songbird.png'),
  },
  coastal_connoisseur: {
    uri: require('../assets/images/badges/coastal.png'),
    bronze: require('../assets/images/badges/bronze/coastal.png'),
    silver: require('../assets/images/badges/silver/coastal.png'),
    none: require('../assets/images/badges/none/coastal.png'),
  },
  waterfowl_whisperer: {
    uri: require('../assets/images/badges/waterfowl.png'),
    bronze: require('../assets/images/badges/bronze/waterfowl.png'),
    silver: require('../assets/images/badges/silver/waterfowl.png'),
    none: require('../assets/images/badges/none/waterfowl.png'),
  },
}


export function getCurrentLevelAndProgress(progressData) {
  let currentLevel = null;
  let nextLevelProgress = 0;
  let allUnlocked = true;

  for (const level in progressData) {
    const { unlocked, percentage } = progressData[level];

    if (unlocked) {
      currentLevel = level;
    } else {
      allUnlocked = false;
      nextLevelProgress = percentage;
      break;
    }
  }

  if (allUnlocked) {
    nextLevelProgress = 1;
  }

  return { currentLevel, nextLevelProgress };
}

export function badgeImageSource(name, level)
{
  if (level === null) level = 'none';
  level = level.toLowerCase();
  if (level === 'gold') level = 'uri';
  return BADGE_IMAGES[name][level]
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
  const {currentLevel, nextLevelProgress} = getCurrentLevelAndProgress(item.progress)
  const isLocked = currentLevel === null;

  return (
    <TouchableOpacity onPress={() => setSelectedBadge(item)}>
      <Image
        source={badgeImageSource(badgeName, currentLevel)}
        style={[
          styles.badgeImage,
          isLocked && styles.lockedBadge
        ]}
      />
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
  lockedBadge: {
    opacity: 0.2,
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