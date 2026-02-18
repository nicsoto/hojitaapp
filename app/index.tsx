import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../constants/theme';
import { CameraView } from '../components/CameraView';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { identifyPlant, needsFallback, IdentificationResponse, PlantResult } from '../services/plantnet';
import { identifyPlantWithGemini, getPlantCareInfo, GeminiPlantResult } from '../services/gemini';

export default function HomeScreen() {
    const router = useRouter();
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);

    // Convierte resultado de Gemini al formato de PlantNet
    const convertGeminiResult = (gemini: GeminiPlantResult): IdentificationResponse => {
        const plantResult: PlantResult = {
            score: gemini.confidence === 'alta' ? 0.9 : gemini.confidence === 'media' ? 0.6 : 0.3,
            species: {
                scientificName: gemini.scientificName,
                scientificNameWithoutAuthor: gemini.scientificName.split(' ').slice(0, 2).join(' '),
                scientificNameAuthorship: '',
                genus: { scientificName: gemini.genus },
                family: { scientificName: gemini.family },
                commonNames: gemini.commonName ? [gemini.commonName] : [],
            }
        };

        return {
            bestMatch: gemini.scientificName,
            results: [plantResult],
            remainingIdentificationRequests: -1,
            source: 'gemini',
        };
    };

    const handleImageSelected = async (uri: string) => {
        setShowCamera(false);
        setLoading(true);

        try {
            let result: IdentificationResponse | null = null;
            let usedGemini = false;

            // Intentar con PlantNet primero
            try {
                result = await identifyPlant(uri);
            } catch (plantnetError) {
                console.log('PlantNet falló, intentando con Gemini...');
            }

            // Si PlantNet falla o tiene baja confianza, usar Gemini
            if (needsFallback(result)) {
                console.log('Usando Gemini como fallback...');
                const geminiResult = await identifyPlantWithGemini(uri);
                if (geminiResult.identified) {
                    result = convertGeminiResult(geminiResult);
                    usedGemini = true;
                }
            }

            // Obtener información de cuidados si se identificó la planta
            let careInfo = null;
            if (result && result.results && result.results.length > 0) {
                const plantName = result.results[0].species.scientificNameWithoutAuthor;
                careInfo = await getPlantCareInfo(plantName);
            }

            // Guardar resultados
            await AsyncStorage.setItem('plant_result_data', JSON.stringify(result));
            await AsyncStorage.setItem('plant_care_info', JSON.stringify(careInfo));
            await AsyncStorage.setItem('plant_image_uri', uri);

            router.push({
                pathname: '/result',
            });
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo identificar la planta');
        } finally {
            setLoading(false);
        }
    };


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería para seleccionar fotos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            handleImageSelected(result.assets[0].uri);
        }
    };

    const openCamera = () => {
        setShowCamera(true);
    };

    if (showCamera) {
        return (
            <CameraView
                onCapture={handleImageSelected}
                onClose={() => setShowCamera(false)}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {loading && <LoadingOverlay />}

            <View style={styles.hero}>
                <Text style={styles.heroEmoji}>🌿</Text>
                <Text style={styles.title}>Hojita</Text>
                <Text style={styles.subtitle}>
                    Identifica plantas y flores{'\n'}con solo una foto
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
                    <Text style={styles.buttonIcon}>📷</Text>
                    <Text style={styles.primaryButtonText}>Tomar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                    <Text style={styles.buttonIcon}>🖼️</Text>
                    <Text style={styles.secondaryButtonText}>Elegir de galería</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by PlantNet • +50,000 especies
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    hero: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    heroEmoji: {
        fontSize: 80,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
    },
    actions: {
        padding: spacing.xl,
    },
    primaryButton: {
        backgroundColor: colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    primaryButtonText: {
        color: colors.primaryDark,
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: colors.backgroundCard,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    secondaryButtonText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '500',
    },
    buttonIcon: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    footer: {
        paddingBottom: spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        color: colors.textMuted,
        fontSize: 12,
    },
});
