import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name || !username || !age || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(Number(age)) || Number(age) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una edad válida');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert('Éxito', '¡Registro completado!');
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      
      <TextInput
        placeholder="Nombre completo"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      
      <TextInput
        placeholder="Nombre de usuario"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      
      <TextInput
        placeholder="Edad"
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      
      <TextInput
        placeholder="Confirmar contraseña"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

     
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d3557',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f4a261',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1faee',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1d3557',
  },
  registerButton: {
    backgroundColor: '#e63946',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    color: '#f1faee',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
