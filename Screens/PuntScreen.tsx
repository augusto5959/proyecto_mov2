import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/Config';

export default function PuntuacionesScreen() {
  const [scores, setScores] = useState<any[]>([]);

  // Leer datos de Firebase
  useEffect(() => {
    const scoresRef = ref(db, 'scores');
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedScores = Object.values(data)
          .map((item: any) => ({
            score: item.score,
            timestamp: new Date(item.timestamp).toLocaleString(),
          }))
          .sort((a: any, b: any) => b.score - a.score); // Ordenar por puntaje descendente
        setScores(parsedScores);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puntuaciones Altas</Text>
      <FlatList
        data={scores}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.scoreText}>{item.timestamp}</Text>
            <Text style={styles.scoreValue}>{item.score} puntos</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d3557',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#f4a261',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#457b9d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rank: {
    fontSize: 20,
    color: '#f1faee',
    fontWeight: 'bold',
  },
  scoreText: {
    flex: 1,
    fontSize: 16,
    color: '#f1faee',
    marginLeft: 10,
  },
  scoreValue: {
    fontSize: 18,
    color: '#e63946',
    fontWeight: 'bold',
  },
});
