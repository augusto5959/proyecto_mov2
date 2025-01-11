import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';

export default function Welcome({ navigation }: any) {
    return (
        <ImageBackground
            source={{ uri: 'https://play-lh.googleusercontent.com/To_MH2kz7JdtRLC3fkVSY50Rbn0ekyUCGwDEkfZETmuh24qVI3cmVExrfBBkaUgMd54=w526-h296-rw' }}
            style={styles.backgroundImage}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>¡Bienvenido!</Text>
                <Text style={styles.subtitle}>Explora y disfruta de nuestra aplicación</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.secondaryButtonText}>Registrarse</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para resaltar el contenido
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#dcdcdc',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#00c853', // Color verde vibrante para coincidir con la imagen del fondo
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 5, // Sombra para un efecto 3D
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#f44336', // Color rojo para dar contraste
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
