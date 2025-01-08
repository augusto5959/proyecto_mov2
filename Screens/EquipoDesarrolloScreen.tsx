import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';

export default function EquipoDesarrollo() {
 
  const handleContact = (name: string) => {
    Alert.alert('Contáctanos', `Puedes contactar a ${name} en el correo: ${name.toLowerCase().replace(' ', '.')}@gmail.com`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipo de Desarrollo</Text>

     
      <View style={styles.card}>
        <Text style={styles.name}>Gabriel Moncayo</Text>
        <Text style={styles.career}>Carrera: Desarrollo de Software</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact('Gabriel Moncayo')}
        >
          <Text style={styles.contactButtonText}>Contáctanos</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.name}>Augusto Viteri</Text>
        <Text style={styles.career}>Carrera: Desarrollo de Software</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact('Augusto Viteri')}
        >
          <Text style={styles.contactButtonText}>Contáctanos</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.name}>Christian Sabando</Text>
        <Text style={styles.career}>Carrera: Desarrollo de Software</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact('Christian Sabando')}
        >
          <Text style={styles.contactButtonText}>Contáctanos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  career: {
    fontSize: 16,
    color: '#a5a5a5',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#e94560',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});