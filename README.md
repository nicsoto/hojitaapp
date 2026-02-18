# 🌿 Hojita - Identificador de Plantas

Hojita es una aplicación móvil desarrollada con React Native y Expo que permite identificar plantas y flores de forma rápida y sencilla utilizando la cámara de tu dispositivo o imágenes de la galería.

## 🚀 Funcionalidades Principales

- **Identificación de Plantas**: Utiliza la potente API de **PlantNet** para identificar miles de especies de plantas con alta precisión.
- **Inteligencia Artificial Avanzada**: Incorpora **Google Gemini Vision** como sistema de respaldo (fallback) para mejorar la identificación cuando los resultados principales no son concluyentes.
- **Información de Cuidados**: Proporciona detalles esenciales para el cuidado de cada planta identificada:
  - 💧 Riego (frecuencia y cantidad)
  - ☀️ Luz necesaria
  - 🌡️ Temperatura ideal
  - 🪴 Tipo de suelo
  - ⚠️ Toxicidad (mascotas/niños)
  - 💡 Consejos adicionales

## 🛠️ Stack Tecnológico

Este proyecto está construido con las siguientes tecnologías:

- **Framework**: [React Native](https://reactnative.dev/) v0.76
- **Plataforma**: [Expo](https://expo.dev/) (Managed Workflow) SDK 52
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Enrutamiento**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Estilos**: StyleSheet (Nativo)

### APIs y Servicios Externos

- **PlantNet API**: Servicio principal de identificación botánica.
- **Google Gemini API (Vision & Text)**: 
  - Análisis secundario de imágenes.
  - Generación de descripciones y consejos de cuidado en lenguaje natural.

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/nicsoto/hojitaapp.git
    cd hojitaapp
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz del proyecto y añade tus claves de API:

    ```env
    EXPO_PUBLIC_PLANTNET_API_KEY=tu_api_key_de_plantnet
    EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_de_gemini
    ```
    
    > **Nota**: Puedes obtener las keys en [PlantNet API](https://my.plantnet.org/) y [Google AI Studio](https://aistudio.google.com/).

4.  **Iniciar la aplicación**:
    ```bash
    npx expo start
    ```

## 📱 Uso

1. Abre la aplicación en tu dispositivo (vía Expo Go) o emulador.
2. Toca el botón de **Cámara** para tomar una foto o **Galería** para seleccionar una existente.
3. Espera unos segundos mientras la IA analiza la imagen.
4. Recibe el nombre de la planta, confianza de la identificación y una guía completa de cuidados.

---
Desarrollado con ❤️ para los amantes de las plantas.
