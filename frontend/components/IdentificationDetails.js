import { View, StyleSheet, Text } from 'react-native';

export default function IdentificationDetails({ result }) {
  return (result !== null) ? (
    <View style={styles.container}>
      <Text style={[styles.body, { fontSize: 20 }]}>
        {(result.species.commonNames && result.species.commonNames[0]) ? result.species.commonNames[0] : result.species.scientificNameWithoutAuthor}
      </Text>
      <Text style={styles.body}>
        Score: {(result.score * 100).toFixed(1)}%
      </Text>
    </View>
  ) : (null);
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  body: {
    color: 'white',
  },

});
