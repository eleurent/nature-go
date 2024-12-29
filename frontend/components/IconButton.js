import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function IconButton({ icon, label, onPress, size, color, extra_style }) {
    return (
        <TouchableOpacity style={[styles.iconButton, extra_style]} onPress={onPress}>
            <MaterialIcons name={icon} size={size} color={color} />
            <Text style={styles.iconButtonLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12,
    },
});
