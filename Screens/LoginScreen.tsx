import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground, Button, Modal } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from '../config/Config';
import { auth } from '../config/Config'

import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
// Definimos un tipo para los datos del usuario
interface User {
  name: string;
  email: string;
  password: string;
}

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ver, setver] = useState(false)
  const [correoRestablecer, setcorreoRestablecer] = useState('')

  function restablecer() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        Alert.alert('Mensaje', 'Se ha enviado un mensaje a su correo :c')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        Alert.alert(errorCode, errorMessage)
      });

  }

  async function login() {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor, ingresa una contraseña.');
      return;
    }

    try {
      // Intentar iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Después de iniciar sesión con Firebase, buscar el usuario en la base de datos
      const usersRef = ref(db, 'usuarios');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users: Record<string, User> = snapshot.val();
        const foundUser = Object.values(users).find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          Alert.alert('Bienvenido', `¡Inicio de sesión exitoso, ${foundUser.name}!`);
          navigation.navigate('MainTabs', { email: email }); // Navegar a la pantalla principal
        } else {
          Alert.alert('Error', 'Usuario no encontrado en la base de datos.');
        }
      } else {
        Alert.alert('Error', 'No se encontraron usuarios en la base de datos.');
      }
    } catch (error: any) {
      // Manejar errores de Firebase
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);

      let titulo = 'ERROR';
      let mensaje = 'Ocurrió un problema al iniciar sesión.';

      if (errorCode === 'auth/invalid-credential') {
        titulo = 'Error de contraseña';
        mensaje = 'Contraseña incorrecta';
      } else if (errorCode === 'auth/user-not-found') {
        titulo = 'Usuario no encontrado';
        mensaje = 'Por favor verifica el correo ingresado.';
      }

      Alert.alert(titulo, mensaje);
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

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.t, styles.text]}
            onPress={() => setver(!ver)}
          >Olvidaste la contraseña. Da click aqui</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>¡Prepárate para cazar insectos y ganar puntos!</Text>

        <Modal visible={ver} transparent={true}>
          <View style={styles.container2}>
            <View style={styles.container3}>
              <TextInput
                placeholder='Ingresar correo'
                style={styles.inp}
                onChangeText={(texto) => setcorreoRestablecer(texto)}
              />
              <Button title='Enviar' onPress={() => restablecer()} />
              <Button title='CERRAR' onPress={() => setver(!ver)} color={'green'} />
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.loginBt}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.loginButtonText}>Atras</Text>

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
  t: {
    fontSize: 20,
    color: 'green'
  },
  text: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  }, container2: {
    backgroundColor: 'rgba(51, 56, 61, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container3: {
    backgroundColor: 'white',
    width: '90%',
    height: 190,
    paddingHorizontal: 10,
    borderRadius: 30,

  }, inp: {
    fontSize: 23,
    backgroundColor: '#455cf2c7',
    borderRadius: 20,
    margin: 20,
    paddingHorizontal: 14,

  },
  loginBt: {
    top:25,
    width: '20%',
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
});
