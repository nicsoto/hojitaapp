import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors, spacing, borderRadius } from '../constants/theme';

interface CameraViewProps {
    onCapture: (uri: string) => void;
    onClose: () => void;
}

export function CameraView({ onCapture, onClose }: CameraViewProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<ExpoCameraView>(null);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Necesitamos acceso a tu cámara para identificar plantas
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Permitir cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                onCapture(photo.uri);
            }
        }
    };

    const toggleFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={styles.container}>
            <ExpoCameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
            >
                <SafeAreaView style={styles.overlay}>
                    <View style={styles.topBar}>
                        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                            <Text style={styles.iconText}>✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={toggleFacing}>
                            <Text style={styles.iconText}>⟲</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hint}>
                        <Text style={styles.hintText}>🌿 Enfoca la planta que quieres identificar</Text>
                    </View>

                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ExpoCameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.lg,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: colors.textPrimary,
        fontSize: 20,
    },
    hint: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
    },
    hintText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    bottomBar: {
        alignItems: 'center',
        paddingBottom: spacing.xxl,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.textPrimary,
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.textPrimary,
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    permissionText: {
        color: colors.textPrimary,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    permissionButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    permissionButtonText: {
        color: colors.primaryDark,
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        paddingVertical: spacing.md,
    },
    closeButtonText: {
        color: colors.textMuted,
        fontSize: 16,
    },
});
