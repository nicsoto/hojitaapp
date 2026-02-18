import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';
import { PlantCareInfo } from '../services/gemini';

interface PlantCareCardProps {
    careInfo: PlantCareInfo;
}

export function PlantCareCard({ careInfo }: PlantCareCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>🌱 Cuidados de la planta</Text>

            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>💧</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Riego</Text>
                        <Text style={styles.infoValue}>{careInfo.watering}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>☀️</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Luz</Text>
                        <Text style={styles.infoValue}>{careInfo.light}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>🌡️</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Temperatura</Text>
                        <Text style={styles.infoValue}>{careInfo.temperature}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>🪴</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Suelo</Text>
                        <Text style={styles.infoValue}>{careInfo.soil}</Text>
                    </View>
                </View>

                <View style={[styles.infoItem, styles.toxicityItem]}>
                    <Text style={styles.infoIcon}>⚠️</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Mascotas</Text>
                        <Text style={[
                            styles.infoValue,
                            careInfo.toxicity.toLowerCase().includes('tóxica') && styles.toxicWarning
                        ]}>
                            {careInfo.toxicity}
                        </Text>
                    </View>
                </View>
            </View>

            {careInfo.tips && careInfo.tips.length > 0 && (
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>💡 Consejos</Text>
                    {careInfo.tips.map((tip, index) => (
                        <Text key={index} style={styles.tipItem}>• {tip}</Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginTop: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    infoGrid: {
        gap: spacing.sm,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: spacing.xs,
    },
    toxicityItem: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        marginTop: spacing.xs,
    },
    infoIcon: {
        fontSize: 20,
        width: 32,
        textAlign: 'center',
    },
    infoContent: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    toxicWarning: {
        color: '#ff6b6b',
        fontWeight: '500',
    },
    tipsSection: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.backgroundLight,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    tipItem: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.xs,
    },
});
