import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';

export function PhotoTips() {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>📸</Text>
            <Text style={styles.title}>No pudimos identificar la planta</Text>
            <Text style={styles.subtitle}>Intenta con estos consejos:</Text>

            <View style={styles.tipsContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✅ Buenas prácticas</Text>
                    <View style={styles.tipsList}>
                        <Text style={styles.tip}>• Enfoca las hojas o flores de cerca</Text>
                        <Text style={styles.tip}>• Usa buena iluminación natural</Text>
                        <Text style={styles.tip}>• Mantén la cámara estable</Text>
                        <Text style={styles.tip}>• Muestra detalles distintivos</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.avoidTitle]}>❌ Evita</Text>
                    <View style={styles.tipsList}>
                        <Text style={styles.tip}>• Fotos desde muy lejos</Text>
                        <Text style={styles.tip}>• Imágenes borrosas o movidas</Text>
                        <Text style={styles.tip}>• Muchas plantas en la misma foto</Text>
                        <Text style={styles.tip}>• Poca iluminación</Text>
                    </View>
                </View>
            </View>

            <View style={styles.exampleBox}>
                <Text style={styles.exampleText}>
                    💡 La mejor foto muestra una sola planta con hojas o flores visibles y bien iluminadas
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    emoji: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    tipsContainer: {
        width: '100%',
        gap: spacing.md,
    },
    section: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.accent,
        marginBottom: spacing.sm,
    },
    avoidTitle: {
        color: '#ff6b6b',
    },
    tipsList: {
        gap: spacing.xs,
    },
    tip: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    exampleBox: {
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginTop: spacing.lg,
        width: '100%',
    },
    exampleText: {
        fontSize: 13,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
