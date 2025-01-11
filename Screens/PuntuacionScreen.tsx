import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/Config';

type Score = {
  score: number;
  timestamp: number;
};

export default function PuntuacionScreen({ route }: { route: any }) {
  const { email } = route.params; // Recibimos el correo del usuario desde los parámetros
  const [scores, setScores] = useState<Score[]>([]);
  const [userName, setUserName] = useState<string>('Usuario'); // Estado para el nombre del usuario

  useEffect(() => {
    if (email) {
      // Referencia al nodo del usuario en Firebase
      const userRef = ref(db, `usuarios/${email.replace('.', '_')}`);
      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          console.log('Datos del usuario:', data); // Log para depuración

          if (data) {
            // Actualizar el nombre del usuario
            setUserName(data.name || 'Usuario Desconocido');

            // Obtener las puntuaciones
            const scoresList: Score[] = data.scores ? Object.values(data.scores) : [];
            setScores(scoresList);
          } else {
            console.warn('No se encontraron datos para este usuario.');
            setUserName('Usuario Desconocido');
            setScores([]);
          }
        },
        (error) => {
          console.error('Error al leer los datos de Firebase:', error);
          setUserName('Error al cargar');
          setScores([]);
        }
      );

      return () => unsubscribe();
    }
  }, [email]);

  return (
    <ImageBackground
      source={{ uri: 'https://play-lh.googleusercontent.com/To_MH2kz7JdtRLC3fkVSY50Rbn0ekyUCGwDEkfZETmuh24qVI3cmVExrfBBkaUgMd54=w526-h296-rw' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Puntuaciones de {userName}</Text>
        {scores.length > 0 ? (
          <FlatList
            data={scores}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.scoreItem}>
                <Text style={styles.scoreText}>Puntaje: {item.score}</Text>
                <Text style={styles.scoreText}>
                  Fecha: {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noScoresText}>No hay puntuaciones disponibles.</Text>
        )}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para resaltar el contenido
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  scoreItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo translúcido para los elementos
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noScoresText: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
});
