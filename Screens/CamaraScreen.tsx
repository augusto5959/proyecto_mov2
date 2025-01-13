import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CamaraScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');

    const takePhoto = async () => {
        try {
            // Solicitar permisos para la cámara si no se han otorgado
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

            if (cameraStatus !== 'granted') {
                setStatus('Se necesita permiso para acceder a la cámara.');
                return;
            }

            // Abrir la cámara
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri); // Captura la imagen
                setStatus('Foto tomada correctamente!');
            } else {
                setStatus('No se tomó ninguna foto.');
            }
        } catch (error) {
            setStatus('Ocurrió un error al tomar la foto.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Toma una foto con la cámara</Text>

            <TouchableOpacity style={styles.pickButton} onPress={takePhoto}>
                <Text style={styles.pickButtonText}>Abrir Cámara</Text>
            </TouchableOpacity>

            {image ? (
                <Image source={{ uri: image }} style={styles.image} />
            ) : (
                <Text style={styles.placeholderText}>No se ha tomado ninguna foto.</Text>
            )}

            {status && <Text style={styles.status}>{status}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f9',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    pickButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    pickButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '95%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
    },
    status: {
        fontSize: 16,
        color: '#333',
        marginTop: 20,
    },
});
