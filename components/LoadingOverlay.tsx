import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Identificando planta...' }: LoadingOverlayProps) {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.text}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        backgroundColor: colors.backgroundCard,
        padding: 32,
        borderRadius: 20,
        alignItems: 'center',
    },
    text: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        marginTop: 16,
    },
});
