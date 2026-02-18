import { Paths, File } from 'expo-file-system';

const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';

// TODO: Replace with your PlantNet API key from https://my.plantnet.org
const API_KEY = process.env.EXPO_PUBLIC_PLANTNET_API_KEY || '';

export interface PlantResult {
    score: number;
    species: {
        scientificName: string;
        scientificNameWithoutAuthor: string;
        scientificNameAuthorship: string;
        genus: {
            scientificName: string;
        };
        family: {
            scientificName: string;
        };
        commonNames: string[];
    };
}

export interface IdentificationResponse {
    bestMatch: string;
    results: PlantResult[];
    remainingIdentificationRequests: number;
    source?: 'plantnet' | 'gemini';
}

export async function identifyPlant(imageUri: string): Promise<IdentificationResponse> {

    // FIX PARA ANDROID: Convertir content:// a file://
    let localUri = imageUri;
    if (imageUri.startsWith('content://')) {
        try {
            // Copiamos la imagen a un archivo temporal local
            const filename = imageUri.split('/').pop() || 'photo.jpg';

            // Usamos el nuevo API de expo-file-system v19
            const sourceFile = new File(imageUri);
            const destFile = new File(Paths.cache, filename);

            // Copiar el archivo al cache
            await sourceFile.copy(destFile);
            localUri = destFile.uri;
        } catch (err) {
            console.error('Error al convertir imagen:', err);
            throw new Error('No se pudo procesar la imagen seleccionada');
        }
    }

    const formData = new FormData();

    const filename = localUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('images', {
        uri: localUri, // Usamos la URI local (file://)
        name: filename,
        type: type,
    } as any);

    formData.append('organs', 'auto');

    const url = `${PLANTNET_API_URL}?api-key=${API_KEY}&lang=es&nb-results=5`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No se pudo identificar la planta. Intenta con otra foto.');
            }
            if (response.status === 401) {
                throw new Error('API key inválida. Verifica tu configuración.');
            }
            throw new Error(`Error al identificar: ${response.status}`);
        }

        const data = await response.json();
        return {
            ...data,
            source: 'plantnet' as const,
        } as IdentificationResponse;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}

/**
 * Determina si se necesita usar Gemini como fallback
 */
export function needsFallback(response: IdentificationResponse | null): boolean {
    if (!response) return true;
    if (!response.results || response.results.length === 0) return true;
    if (response.results[0].score < 0.4) return true;
    return false;
}
