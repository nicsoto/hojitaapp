import * as FileSystem from 'expo-file-system/legacy';

// TODO: Reemplaza con tu API key de Google AI Studio
// Obtén una gratis en: https://aistudio.google.com/apikey
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiPlantResult {
    identified: boolean;
    commonName: string;
    scientificName: string;
    family: string;
    genus: string;
    confidence: 'alta' | 'media' | 'baja';
    description: string;
}

export interface PlantCareInfo {
    watering: string;
    light: string;
    temperature: string;
    soil: string;
    toxicity: string;
    tips: string[];
}

/**
 * Convierte una imagen a base64 para enviarla a Gemini
 */
async function imageToBase64(imageUri: string): Promise<string> {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
}

/**
 * Identifica una planta usando Gemini Vision
 */
export async function identifyPlantWithGemini(imageUri: string): Promise<GeminiPlantResult> {
    try {
        const base64Image = await imageToBase64(imageUri);

        const prompt = `Analiza esta imagen e identifica la planta que aparece.

Responde SOLO con un JSON válido (sin markdown, sin \`\`\`) con este formato exacto:
{
    "identified": true/false,
    "commonName": "nombre común en español",
    "scientificName": "nombre científico completo",
    "family": "familia botánica",
    "genus": "género",
    "confidence": "alta/media/baja",
    "description": "breve descripción de la planta en español (1-2 oraciones)"
}

Si no puedes identificar la planta o la imagen no muestra una planta claramente, responde con:
{"identified": false, "commonName": "", "scientificName": "", "family": "", "genus": "", "confidence": "baja", "description": ""}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 500,
                }
            }),
        });

        if (!response.ok) {
            console.error('Gemini API error:', response.status);
            throw new Error('Error al conectar con Gemini');
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            throw new Error('Respuesta vacía de Gemini');
        }

        // Limpiar posibles caracteres extra y parsear JSON
        const cleanJson = textResponse.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const result = JSON.parse(cleanJson);

        return result as GeminiPlantResult;
    } catch (error) {
        console.error('Error identificando con Gemini:', error);
        return {
            identified: false,
            commonName: '',
            scientificName: '',
            family: '',
            genus: '',
            confidence: 'baja',
            description: '',
        };
    }
}

/**
 * Obtiene información de cuidados de una planta usando Gemini
 */
export async function getPlantCareInfo(plantName: string): Promise<PlantCareInfo | null> {
    try {
        const prompt = `Dame información de cuidados para la planta "${plantName}".

Responde SOLO con un JSON válido (sin markdown, sin \`\`\`) con este formato exacto:
{
    "watering": "descripción breve del riego (frecuencia y cantidad)",
    "light": "tipo de luz necesaria",
    "temperature": "rango de temperatura ideal en °C",
    "soil": "tipo de suelo recomendado",
    "toxicity": "indicar si es tóxica para mascotas (gatos/perros) o si es segura",
    "tips": ["consejo 1", "consejo 2", "consejo 3"]
}

Sé conciso pero informativo. Responde en español.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                }
            }),
        });

        if (!response.ok) {
            console.error('Gemini API error:', response.status);
            return null;
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            return null;
        }

        const cleanJson = textResponse.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const result = JSON.parse(cleanJson);

        return result as PlantCareInfo;
    } catch (error) {
        console.error('Error obteniendo cuidados:', error);
        return null;
    }
}
