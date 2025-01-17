import React, { useState } from 'react';
import {Button,StyleSheet,Text,View,TextInput,Alert,Image,TouchableOpacity,ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import axios from 'axios';
import { token } from '../config/secrets';

export default function RegisterScreen({ navigation }: { navigation: any }) {
	const [cedula, setCedula] = useState('');
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [edad, setEdad] = useState<number | string>('');
	const [genero, setGenero] = useState('');
	const [correo, setCorreo] = useState('');
	const [estado, setEstado] = useState('');
	const [contrasena, setContrasena] = useState('');
	const [image, setImage] = useState<string | null>(null);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const takeImage = async () => {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	function register() {
		createUserWithEmailAndPassword(auth, correo, contrasena).catch((error) => {
			console.error(error.message);
		});
	}

	const guardar = (downloadUrl: string) => {
		set(ref(db, 'usuarios/' + cedula), {
			name: nombre,
			lastname: apellido,
			age: edad,
			gender: genero,
			email: correo,
			state: estado,
			password: contrasena,
			profileImage: downloadUrl, 
		});
		limpiar();
	};

	function limpiar() {
		setCedula('');
		setNombre('');
		setApellido('');
		setEdad('');
		setGenero('');
		setCorreo('');
		setEstado('');
		setContrasena('');
		setImage(null);
	}

	const subirImagen = async (nombre: string) => {
		if (!image) {
			Alert.alert('Error', 'Primero selecciona una imagen');
			return '';
		}

		const ACCESS_TOKEN = token;

		try {
			const fileData = await FileSystem.readAsStringAsync(image, {
				encoding: FileSystem.EncodingType.Base64,
			});
			const fileBuffer = Buffer.from(fileData, 'base64');
			const fileName = nombre.endsWith('.jpg') ? nombre : `${nombre}.jpg`;
			const dropboxArg = {
				path: `/${fileName}`,
				mode: 'add',
				autorename: true,
				mute: false,
			};
			const result = await axios.post(
				'https://content.dropboxapi.com/2/files/upload',
				fileBuffer,
				{
					headers: {
						Authorization: `Bearer ${ACCESS_TOKEN}`,
						'Dropbox-API-Arg': JSON.stringify(dropboxArg),
						'Content-Type': 'application/octet-stream',
					},
				},
			);
			const filePath = result.data.path_display;
			const sharedLinkResult = await axios.post(
				'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
				{ path: filePath, settings: { requested_visibility: 'public' } },
				{ headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } },
			);
			return sharedLinkResult.data.url.replace('?dl=0', '?raw=1');
		} catch (error) {
			console.error(
				'Error al subir la imagen:',
				error.response?.data || error.message,
			);
			Alert.alert('Error', 'Hubo un problema al subir la imagen');
			return '';
		}
	};

	const handleGuardar = async () => {
		if (!cedula || !nombre || !apellido || !correo || !contrasena) {
			Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
			return;
		}
		if (!image) {
			Alert.alert('Error', 'Debes seleccionar o tomar una imagen.');
			return;
		}
		try {
			const downloadUrl = await subirImagen(cedula);
			if (downloadUrl) {
				guardar(downloadUrl);
				register();
				Alert.alert(
					'Registro exitoso',
					'¡Gracias por registrarte!',
					[{ text: 'Aceptar', onPress: () => navigation.navigate('Login') }],
					{ cancelable: false },
				);
			}
		} catch (error) {
			Alert.alert('Error', 'Hubo un problema durante el registro.');
			console.error(error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Registros</Text>
			<TextInput
				placeholder='Ingresar Cédula'
				style={styles.inp}
				value={cedula}
				onChangeText={setCedula}
			/>
			<TextInput
				placeholder='Ingrese el Nombre'
				style={styles.inp}
				value={nombre}
				onChangeText={setNombre}
			/>
			<TextInput
				placeholder='Ingrese el Apellido'
				style={styles.inp}
				value={apellido}
				onChangeText={setApellido}
			/>
			<TextInput
				placeholder='Ingrese la Edad'
				style={styles.inp}
				value={edad?.toString()}
				keyboardType='numeric'
				onChangeText={(texto) => setEdad(+texto)}
			/>
			<TextInput
				placeholder='Ingrese contraseña'
				style={styles.inp}
				secureTextEntry
				onChangeText={setContrasena}
			/>
			<View style={styles.piccon}>
				<Text style={styles.subtitulo}>Seleccione el Género</Text>
				<Picker
					selectedValue={genero}
					style={styles.picker}
					onValueChange={setGenero}
				>
					<Picker.Item label='Seleccione...' value='' />
					<Picker.Item label='Masculino' value='Masculino' />
					<Picker.Item label='Femenino' value='Femenino' />
					<Picker.Item label='Otro' value='Otro' />
				</Picker>
			</View>
			<TextInput
				placeholder='Ingrese el Correo Electrónico'
				style={styles.inp}
				value={correo}
				onChangeText={setCorreo}
			/>
			<Text style={styles.subtitulo}>Agrega una imagen</Text>
			<View style={styles.containerButtons}>
				<TouchableOpacity style={styles.button} onPress={pickImage}>
					<Text style={styles.buttonText}>Abrir galería</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={takeImage}>
					<Text style={styles.buttonText}>Tomar foto</Text>
				</TouchableOpacity>
			</View>
			{image && <Image source={{ uri: image }} style={styles.image} />}
			<View style={styles.saveButton}>
				<Button title='GUARDAR' onPress={handleGuardar} />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#f5f5f5',
		padding: 20,
		paddingTop: 70,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#364ec9',
		marginBottom: 20,
		textAlign: 'center',
	},
	inp: {
		height: 50,
		fontSize: 18,
		backgroundColor: '#ffffff',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		marginVertical: 10,
		color: '#333',
	},
	piccon: { marginVertical: 20 },
	subtitulo: { fontSize: 16, marginBottom: 10, color: '#333' },
	picker: {
		height: 50,
		backgroundColor: '#ffffff',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		marginVertical: 10,
	},
	image: { width: '100%', height: 200, borderRadius: 10, marginVertical: 20 },
	button: {
		backgroundColor: '#007AFF',
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 8,
		marginVertical: 10,
		width: 150,
		alignItems: 'center',
	},
	buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
	containerButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 20,
	},
	saveButton: { marginTop: 20 },
});
