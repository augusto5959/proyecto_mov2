import React, { useEffect, useState } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function GaleriaScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        // Verificar permisos al inicio
        const checkPermissions = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        checkPermissions();
    }, []);

    const pickImage = async () => {
        if (!hasPermission) {
            Alert.alert('Permiso denegado', 'Por favor, otorgue permiso para acceder a la galería.');
            return;
        }

        // Intentar abrir la galería
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (result.canceled) {
            Alert.alert('Selección cancelada', 'No se seleccionó ninguna imagen.');
            return;
        }

        setImage(result.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            <Button title="Seleccionar Imagen" onPress={pickImage} />
            {image ? (
                <>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Text style={styles.imageText}>Imagen seleccionada</Text>
                </>
            ) : (
                <Text style={styles.instructions}>Selecciona una imagen de la galería.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 300,
        marginVertical: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    imageText: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
    instructions: {
        fontSize: 16,
        color: '#888',
    },
});
