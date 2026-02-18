import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../constants/theme';
import { PlantCard } from '../components/PlantCard';
import { PlantCareCard } from '../components/PlantCareCard';
import { PhotoTips } from '../components/PhotoTips';
import { PlantResult } from '../services/plantnet';
import { PlantCareInfo } from '../services/gemini';

export default function ResultScreen() {
    const router = useRouter();

    // Estado para guardar los resultados
    const [results, setResults] = useState<PlantResult[]>([]);
    const [imageUri, setImageUri] = useState<string>('');
    const [careInfo, setCareInfo] = useState<PlantCareInfo | null>(null);
    const [source, setSource] = useState<'plantnet' | 'gemini' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // FIX: Leemos los datos de la memoria en lugar de los parámetros de URL
        const loadData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('plant_result_data');
                const savedImageUri = await AsyncStorage.getItem('plant_image_uri');
                const savedCareInfo = await AsyncStorage.getItem('plant_care_info');

                if (jsonValue != null) {
                    const data = JSON.parse(jsonValue);
                    setResults(data.results || []);
                    setSource(data.source || 'plantnet');
                }
                if (savedImageUri != null) {
                    setImageUri(savedImageUri);
                }
                if (savedCareInfo != null && savedCareInfo !== 'null') {
                    setCareInfo(JSON.parse(savedCareInfo));
                }
            } catch (e) {
                console.error("Error leyendo datos", e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const topResult = results[0];
    const otherResults = results.slice(1);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.loadingText}>Cargando resultados...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {topResult ? (
                    <>
                        {source === 'gemini' && (
                            <View style={styles.geminiTag}>
                                <Text style={styles.geminiTagText}>✨ Identificado con IA</Text>
                            </View>
                        )}
                        <PlantCard
                            plant={topResult}
                            imageUri={imageUri}
                            isTopResult={true}
                        />

                        {careInfo && <PlantCareCard careInfo={careInfo} />}

                        {otherResults.length > 0 && (
                            <>
                                <Text style={styles.otherResultsTitle}>Otras posibilidades</Text>
                                {otherResults.map((plant, index) => (
                                    <View key={index} style={styles.smallCard}>
                                        <View style={styles.smallCardContent}>
                                            <Text style={styles.smallCardName}>
                                                {plant.species.commonNames?.[0] || plant.species.scientificNameWithoutAuthor}
                                            </Text>
                                            <Text style={styles.smallCardScientific}>
                                                {plant.species.scientificName}
                                            </Text>
                                        </View>
                                        <View style={styles.smallCardScore}>
                                            <Text style={styles.smallCardScoreText}>
                                                {Math.round(plant.score * 100)}%
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <PhotoTips />
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.newScanButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.newScanButtonText}>🔍 Escanear otra planta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    otherResultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    geminiTag: {
        backgroundColor: '#4285f4',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
    },
    geminiTagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    smallCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallCardContent: {
        flex: 1,
    },
    smallCardName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    smallCardScientific: {
        fontSize: 13,
        fontStyle: 'italic',
        color: colors.textMuted,
        marginTop: 2,
    },
    smallCardScore: {
        backgroundColor: colors.backgroundLight,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    smallCardScoreText: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    noResultsEmoji: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    noResultsText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    noResultsHint: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },
    footer: {
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.backgroundCard,
    },
    newScanButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    newScanButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
});
