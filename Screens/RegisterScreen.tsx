import React, { useState } from 'react';
import {Button,StyleSheet,Text,View,TextInput,Alert,Image,TouchableOpacity,ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, set } from 'firebase/database';
import { auth, db } from '../config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer'; // importar e instalar npm install buffer
import axios from 'axios'; // importar e instalar npm install axios
import { token } from '../config/secrets'; // Token para acceder a Dropbox

export default function RegisterScreen({ navigation }: { navigation: any }) {
	const [cedula, setCedula] = useState('');
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [edad, setEdad] = useState(0);
	const [genero, setGenero] = useState('');
	const [correo, setCorreo] = useState('');
	const [estado, setEstado] = useState('');
	const [contrasena, setcontrasena] = useState('');
	const [image, setImage] = useState<string | null>(null);

	// Seleccionar imagen desde galería
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

	// Tomar foto con la cámara
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

	// Registro en Firebase Auth
	function register() {
		createUserWithEmailAndPassword(auth, correo, contrasena)
			.then((userCredential) => {
				const user = userCredential.user;
			})
			.catch((error) => {
				console.error(error.message);
			});
	}

	// Guardar datos en Firebase Database
	function guardar() {
		set(ref(db, 'usuarios/' + cedula), {
			name: nombre,
			lastname: apellido,
			age: edad,
			gender: genero,
			email: correo,
			state: estado,
			password: contrasena,
		});
		limpiar();
	}

	// Limpiar formularios
	function limpiar() {
		setCedula('');
		setNombre('');
		setApellido('');
		setEdad(0);
		setGenero('');
		setCorreo('');
		setEstado('');
		setcontrasena('');
		setImage(null);
	}

	// Subir imagen a Dropbox y obtener el enlace
	const subirImagen = async (nombre: string) => {
		if (!image) {
			Alert.alert('Error', 'Primero selecciona una imagen');
			return;
		}

		const ACCESS_TOKEN = token;

		try {
			// Leer el archivo local como Base64
			const fileData = await FileSystem.readAsStringAsync(image, {
				encoding: FileSystem.EncodingType.Base64,
			});

			// Convertir Base64 a binario
			const fileBuffer = Buffer.from(fileData, 'base64');

			// Asegurar que el nombre tenga la extensión .jpg
			const fileName = nombre.endsWith('.jpg') ? nombre : `${nombre}.jpg`;

			// Crear los argumentos para la API de Dropbox
			const dropboxArg = {
				path: `/${fileName}`,
				mode: 'add',
				autorename: true,
				mute: false,
			};

			// Subir el archivo binario a Dropbox
			const result = await axios.post(
				'https://content.dropboxapi.com/2/files/upload',
				fileBuffer,
				{
					headers: {
						Authorization: `Bearer ${ACCESS_TOKEN}`,
						'Dropbox-API-Arg': JSON.stringify(dropboxArg),
						'Content-Type': 'application/octet-stream',
					},
				}
			);

			// Obtener la URL de descarga
			const filePath = result.data.path_display;

			// Crear enlace compartido
			const sharedLinkResult = await axios.post(
				'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
				{
					path: filePath,
					settings: {
						requested_visibility: 'public',
					},
				},
				{
					headers: {
						Authorization: `Bearer ${ACCESS_TOKEN}`,
					},
				}
			);

			// Obtener el enlace de descarga directa
			const downloadUrl = sharedLinkResult.data.url.replace('?dl=0', '?raw=1');

			console.log('URL de descarga:', downloadUrl);
			setImage(downloadUrl);

			Alert.alert('Éxito', 'Imagen subida correctamente a Dropbox');
		} catch (error) {
			//console.error('Error al subir la imagen:', error.response?.data || error.message);
			Alert.alert('Error', 'Hubo un problema al subir la imagen');
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Registros</Text>

			<TextInput
				placeholder="Ingresar Cédula"
				style={styles.inp}
				value={cedula}
				onChangeText={(texto) => setCedula(texto)}
			/>
			<TextInput
				placeholder="Ingrese el Nombre"
				style={styles.inp}
				value={nombre}
				onChangeText={(texto) => setNombre(texto)}
			/>
			<TextInput
				placeholder="Ingrese el Apellido"
				style={styles.inp}
				value={apellido}
				onChangeText={(texto) => setApellido(texto)}
			/>
			<TextInput
				placeholder="Ingrese la Edad"
				style={styles.inp}
				value={edad?.toString()}
				keyboardType="numeric"
				onChangeText={(texto) => setEdad(+texto)}
			/>
			<TextInput
				placeholder="Ingrese contraseña"
				style={styles.inp}
				secureTextEntry
				onChangeText={(texto) => setcontrasena(texto)}
			/>

			<View style={styles.piccon}>
				<Text style={styles.subtitulo}>Seleccione el Género</Text>
				<Picker
					selectedValue={genero}
					style={styles.picker}
					onValueChange={(itemValue) => setGenero(itemValue)}
				>
					<Picker.Item label="Seleccione..." value="" />
					<Picker.Item label="Masculino" value="Masculino" />
					<Picker.Item label="Femenino" value="Femenino" />
					<Picker.Item label="Otro" value="Otro" />
				</Picker>
			</View>

			<TextInput
				placeholder="Ingrese el Correo Electrónico"
				style={styles.inp}
				value={correo}
				onChangeText={(texto) => setCorreo(texto)}
			/>

			<Text style={styles.subtitulo}>Agrega una imagen</Text>

			{image && <Image source={{ uri: image }} style={styles.image} />}

			<View style={styles.containerButtons}>
				<TouchableOpacity style={styles.button} onPress={pickImage}>
					<Text style={styles.buttonText}>Abrir galería</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={takeImage}>
					<Text style={styles.buttonText}>Tomar foto</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.saveButton}>
				<Button
					title="GUARDAR"
					onPress={async () => {
						if (!cedula || !nombre || !apellido || !correo || !contrasena) {
							Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
							return;
						}
						if (!image) {
							Alert.alert('Error', 'Debes seleccionar o tomar una imagen.');
							return;
						}

						try {
							await subirImagen(cedula); // Sube la imagen con formato .jpg
							guardar(); // Guarda los datos en Firebase
							register(); // Crea la cuenta en Firebase Auth
							Alert.alert(
								'Registro exitoso',
								'¡Gracias por registrarte!',
								[
									{
										text: 'Aceptar',
										onPress: () => navigation.navigate('Welcome'),
									},
								],
								{ cancelable: false }
							);
						} catch (error) {
							Alert.alert('Error', 'Hubo un problema durante el registro. Inténtalo nuevamente.');
							console.error(error);
						}
					}}
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#fff',
		padding: 15,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center',
	},
	inp: {
		height: 50,
		fontSize: 18,
		backgroundColor: '#364ec9c7',
		borderRadius: 10,
		paddingHorizontal: 15,
		marginVertical: 8,
		color: '#fff',
	},
	piccon: {
		marginVertical: 10,
	},
	subtitulo: {
		fontSize: 15,
		marginBottom: 5,
		color: '#000000c7',
	},
	picker: {
		height: 50,
		backgroundColor: '#364ec9c7',
		borderRadius: 10,
	},
	image: {
		width: '100%',
		height: 200,
		borderRadius: 10,
		marginBottom: 20,
	},
	button: {
		backgroundColor: '#007AFF',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginVertical: 10,
		width: 150,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	containerButtons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	saveButton: {
		marginTop: 20,
	},
});
