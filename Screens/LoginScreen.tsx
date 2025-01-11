import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from '../config/Config';

// Definimos un tipo para los datos del usuario
interface User {
  name: string;
  email: string;
  password: string;
}

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor, ingresa una contraseña.');
      return;
    }

    try {
      // Referencia a la base de datos para buscar usuarios
      const usersRef = ref(db, 'usuarios');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users: Record<string, User> = snapshot.val(); // Especificamos el tipo de los usuarios
        const foundUser = Object.values(users).find(
          (user) => user.email === email && user.password === password
        );

        if (foundUser) {
          Alert.alert('Bienvenido', `¡Inicio de sesión exitoso, ${foundUser.name}!`);
          navigation.navigate('MainTabs', { email }); // Redirigir al Tab Navigator
        } else {
          Alert.alert('Error', 'Correo o contraseña incorrectos.');
        }
      } else {
        Alert.alert('Error', 'No se encontraron usuarios en la base de datos.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al verificar los datos. Inténtalo nuevamente.');
      console.error(error);
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://play-lh.googleusercontent.com/To_MH2kz7JdtRLC3fkVSY50Rbn0ekyUCGwDEkfZETmuh24qVI3cmVExrfBBkaUgMd54=w526-h296-rw' }}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          placeholder="Correo Electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ddd"
        />

        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="#ddd"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>¡Prepárate para cazar insectos y ganar puntos!</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#00b4d8',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
