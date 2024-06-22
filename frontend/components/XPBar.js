import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Pressable, FlatList, Modal, Button } from 'react-native';

export default function XPBar({data})
{
    const maxWidth = styles.xpBarBackground.width - 2;
    let width = data ? (data.xp - data.current_level_xp) / (data.next_level_xp - data.current_level_xp) * maxWidth : 0;

    return (
        <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarForeground, {width: width}]}></View>
        </View>
    )
}

const styles = StyleSheet.create({ 
    xpBarBackground: {
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#999',
        borderRadius: 5,
        width: 168,
        height: 9,
    },
    xpBarForeground: {
        marginTop: 1,
        marginLeft: 1,
        backgroundColor: '#F5C92D',
        borderRadius: 4.8,
        width: 95,
        height: 7,
    },
});