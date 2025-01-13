import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function GaleriaScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const pickImage = async () => {
    try {
      // Solicitar permisos de la cámara si no se han otorgado
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setStatus('Se necesita permiso para acceder a la galería.');
        return;
      }

      // Abrir la galería de imágenes
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setStatus('Imagen seleccionada correctamente!');
      } else {
        setStatus('No se seleccionó ninguna imagen.');
      }
    } catch (error) {
      setStatus('Ocurrió un error al seleccionar la imagen.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una imagen de la galería</Text>
      
      <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
        <Text style={styles.pickButtonText}>Abrir Galería</Text>
      </TouchableOpacity>
      
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>No se ha seleccionado ninguna imagen.</Text>
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
