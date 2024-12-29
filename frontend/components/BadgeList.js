import { View, Text, Image, StyleSheet, ImageBackground, Pressable, FlatList, Modal, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';

import BadgeModal from './BadgeModal';
import BadgeItem from './BadgeItem';



export default function BadgeList({badgeData})
{
    const [selectedBadge, setSelectedBadge] = useState(null); 

    return (
        <View>
        <FlatList
            data={badgeData}
            renderItem={({item}) => BadgeItem({item}, selectedBadge, setSelectedBadge)}
            keyExtractor={(item) => item.badge.name}
            numColumns={4}
        />
        <Modal visible={selectedBadge !== null} animationType="slide" onRequestClose={() => setSelectedBadge(null)} transparent={true}>
            {selectedBadge && BadgeModal(selectedBadge, setSelectedBadge)}
        </Modal>
        </View>
    );
}
