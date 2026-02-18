import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';
import { PlantResult } from '../services/plantnet';

interface PlantCardProps {
    plant: PlantResult;
    imageUri: string;
    isTopResult?: boolean;
}

export function PlantCard({ plant, imageUri, isTopResult = false }: PlantCardProps) {
    const confidencePercent = Math.round(plant.score * 100);
    const commonName = plant.species.commonNames?.[0] || 'Nombre no disponible';

    return (
        <View style={[styles.card, isTopResult && styles.topCard]}>
            {isTopResult && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>✓ Mejor coincidencia</Text>
                </View>
            )}

            <Image source={{ uri: imageUri }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.commonName}>{commonName}</Text>
                <Text style={styles.scientificName}>{plant.species.scientificName}</Text>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Familia</Text>
                        <Text style={styles.detailValue}>{plant.species.family.scientificName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Género</Text>
                        <Text style={styles.detailValue}>{plant.species.genus.scientificName}</Text>
                    </View>
                </View>

                <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confianza</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${confidencePercent}%` }]} />
                    </View>
                    <Text style={styles.confidenceValue}>{confidencePercent}%</Text>
                </View>

                {plant.species.commonNames && plant.species.commonNames.length > 1 && (
                    <View style={styles.otherNames}>
                        <Text style={styles.otherNamesLabel}>También conocida como:</Text>
                        <Text style={styles.otherNamesValue}>
                            {plant.species.commonNames.slice(1, 4).join(', ')}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    topCard: {
        borderWidth: 2,
        borderColor: colors.accent,
    },
    badge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        zIndex: 10,
    },
    badgeText: {
        color: colors.primaryDark,
        fontSize: 12,
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: colors.backgroundLight,
    },
    content: {
        padding: spacing.lg,
    },
    commonName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    scientificName: {
        fontSize: 16,
        fontStyle: 'italic',
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    details: {
        marginBottom: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    detailLabel: {
        color: colors.textMuted,
        fontSize: 14,
    },
    detailValue: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    confidenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    confidenceLabel: {
        color: colors.textMuted,
        fontSize: 14,
        width: 75,
        marginRight: spacing.sm,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: borderRadius.full,
    },
    confidenceValue: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: 'bold',
        width: 40,
        textAlign: 'right',
        marginLeft: spacing.sm,
    },
    otherNames: {
        backgroundColor: colors.backgroundLight,
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    otherNamesLabel: {
        color: colors.textMuted,
        fontSize: 12,
        marginBottom: spacing.xs,
    },
    otherNamesValue: {
        color: colors.textSecondary,
        fontSize: 13,
    },
});
