import {StyleSheet,Text,View,TextInput,TouchableOpacity,Alert,Image, } from 'react-native';
import React, { useState } from 'react';

	
export default function LoginScreen({navigation}: {navigation: any}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	
	function handleLogin() {
		if (!email.includes('@')) {
		  Alert.alert('Error', 'Por favor, ingresa un correo válido.');
		  return;
		}
		if (password.length < 6) {
		  Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
		  return;
		}
		Alert.alert('Bienvenido', '¡Inicio de sesión exitoso!');
	  }
	
	  
	
  
	  return (
		<View style={styles.container}>
		  <Text style={styles.title}>Bienvenido </Text>
	
		  <TextInput
			placeholder="Correo Electrónico"
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
			secureTextEntry={true}
		  />
	
		  <TouchableOpacity style={styles.loginButton} onPress={()=>{handleLogin(); navigation.navigate('Juego'); }}>
			<Text style={styles.loginButtonText} >Iniciar Sesión</Text>
		  </TouchableOpacity>
	
		  
	
		  <Text style={styles.footerText}>
			¡Prepárate para cazar insectos y ganar puntos!
		  </Text>
		</View>
	  );
	}
  
	const styles = StyleSheet.create({
		container: {
		  flex: 1,
		  backgroundColor: '#1a1a2e',
		  alignItems: 'center',
		  justifyContent: 'center',
		  padding: 20,
		},
		title: {
		  fontSize: 32,
		  fontWeight: 'bold',
		  color: '#e94560',
		  marginBottom: 30,
		  textShadowColor: '#000',
		  textShadowOffset: { width: 2, height: 2 },
		  textShadowRadius: 5,
		},
		input: {
		  width: '100%',
		  height: 50,
		  backgroundColor: '#16213e',
		  borderRadius: 10,
		  paddingHorizontal: 15,
		  color: '#fff',
		  fontSize: 16,
		  marginBottom: 20,
		  borderWidth: 1,
		  borderColor: '#0f3460',
		},
		loginButton: {
		  width: '100%',
		  height: 50,
		  backgroundColor: '#e94560',
		  borderRadius: 10,
		  justifyContent: 'center',
		  alignItems: 'center',
		  marginBottom: 20,
		},
		loginButtonText: {
		  color: '#fff',
		  fontSize: 18,
		  fontWeight: 'bold',
		},
		orText: {
		  color: '#fff',
		  fontSize: 16,
		  marginBottom: 10,
		},
		
		
		socialButton: {
		  flexDirection: 'row',
		  alignItems: 'center',
		  backgroundColor: '#16213e',
		  padding: 10,
		  borderRadius: 10,
		  width: '48%',
		  justifyContent: 'center',
		  borderWidth: 1,
		  borderColor: '#0f3460',
		},
		
		
		footerText: {
		  color: '#fff',
		  fontSize: 16,
		  marginTop: 20,
		  textAlign: 'center',
		},
	  });
	
	
  
	
  
  