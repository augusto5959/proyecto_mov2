import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ImageBackground, Image, Button } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/Config';

export default function PerfilScreen({ route, navigation }: { route: any; navigation: any }) {
  const { email } = route.params; // Recibimos el correo desde la navegación
  const [userData, setUserData] = useState<any>(null); // Guardar datos del usuario
  const [loading, setLoading] = useState(true); // Estado para mostrar "cargando"

  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'No se proporcionó un correo electrónico.');
      setLoading(false);
      return;
    }

    // Referencia a los datos del usuario en Firebase
    const usersRef = ref(db, 'usuarios');
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const users = snapshot.val();
        if (users) {
          // Buscar el usuario cuyo correo coincida con el proporcionado
          const user = Object.values(users).find(
            (u: any) => u.email === email
          );
          setUserData(user || null);
        } else {
          setUserData(null);
        }
        setLoading(false); 
      },
      (error) => {
        console.error('Error al leer los datos de Firebase:', error);
        Alert.alert('Error', 'Ocurrió un error al cargar los datos.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [email]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            // Redirigir a la pantalla de inicio de sesión
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No se encontraron datos para el correo: {email}
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://play-lh.googleusercontent.com/To_MH2kz7JdtRLC3fkVSY50Rbn0ekyUCGwDEkfZETmuh24qVI3cmVExrfBBkaUgMd54=w526-h296-rw' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image source={{ uri: userData.downloadUrl }} style={styles.profileImage} />
        <Text style={styles.title}>Perfil del Usuario</Text>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>{email}</Text>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{userData.name}</Text>
        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{userData.lastname}</Text>
        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{userData.age}</Text>
        <Text style={styles.label}>Género:</Text>
        <Text style={styles.value}>{userData.gender}</Text>

        {userData.image && (
        <>
          <Text style={styles.label}>Imagen de perfil:</Text>
          <Image
            source={{ uri: userData.image }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        </>
      )}
      
        <View style={styles.logoutButtonContainer}>
          <Button title="Cerrar sesión" onPress={handleLogout} color="#e63946" />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#ffde59',
  },
  value: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#e63946',
    textAlign: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ffde59',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
});
