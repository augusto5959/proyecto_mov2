import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, set } from "firebase/database";
import App from '../App';
import { auth, db } from '../config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function RegisterScreen({ navigation }: { navigation: any }) {
	const [cedula, setCedula] = useState('');
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [edad, setEdad] = useState(0);
	const [genero, setGenero] = useState('');
	const [correo, setCorreo] = useState('');
	const [estado, setEstado] = useState('');
	const [contrasena, setcontrasena] = useState('')

	function register() {
		createUserWithEmailAndPassword(auth, correo, contrasena)
			.then((userCredential) => {
				// Signed up 
				const user = userCredential.user;
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
			});
	}


	function guardar() {
		set(ref(db, 'usuarios/' + cedula), {
			name: nombre,
			lastname: apellido,
			age: edad,
			gender: genero,
			email: correo,
			state: estado,
			password: contrasena
		});


		limpiar();
	}
	function limpiar() {
		setCedula('');
		setNombre('');
		setApellido('');
		setEdad(0);
		setGenero('');
		setCorreo('');
		setEstado('');
		setcontrasena('');


	}
	return (
		<View style={styles.container}>
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
				keyboardType="numeric"
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

			<View style={styles.piccon}>
				<Text style={styles.subtitulo}>Estado Civil</Text>
				<Picker
					selectedValue={estado}
					style={styles.picker}
					onValueChange={(itemValue) => setEstado(itemValue)}
				>
					<Picker.Item label="Seleccione..." value="" />
					<Picker.Item label="Soltero/a" value="Soltero/a" />
					<Picker.Item label="Casado/a" value="Casado/a" />
					<Picker.Item label="Divorciado/a" value="Divorciado/a" />
					<Picker.Item label="Viudo/a" value="Viudo/a" />
				</Picker>
			</View>

			<View>
				<Button
					title="GUARDAR"
					onPress={() => {
						guardar();
						register();
						Alert.alert(
							'Registro exitoso',
							'¡Gracias por registrarte!',
							[
								{
									text: 'Aceptar',
									onPress: () => navigation.navigate('Welcome'), // Redirige a la pantalla Welcome
								},
							],
							{ cancelable: false } // Impide cerrar la alerta sin presionar un botón
						);
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
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
});