import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/Config';

export default function PerfilScreen({ route }: { route: any }) {
  const { email } = route.params; 
  const [userData, setUserData] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'No se proporcionó un correo electrónico.');
      setLoading(false);
      return;
    }

    
    const usersRef = ref(db, 'usuarios');
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const users = snapshot.val();
        if (users) {
          const user = Object.values(users).find(
            (u: any) => u.email === email
          );
          setUserData(user || null);
        } else {
          setUserData(null);
        }
        setLoading(false); // Detener la carga
      },
      (error) => {
        console.error('Error al leer los datos de Firebase:', error);
        Alert.alert('Error', 'Ocurrió un error al cargar los datos.');
        setLoading(false);
      }
    );

    return () => unsubscribe(); 
  }, [email]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#364ec9" />
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
    <View style={styles.container}>
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
      <Text style={styles.label}>Estado Civil:</Text>
      <Text style={styles.value}>{userData.state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#364ec9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#364ec9',
  },
  value: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: '#e63946',
    textAlign: 'center',
  },
});
