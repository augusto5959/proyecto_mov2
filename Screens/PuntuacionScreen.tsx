import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/Config';


type Score = {
  score: number;
  timestamp: number;
};

export default function PuntuacionesScreen() {
  const [scores, setScores] = useState<Score[]>([]); 


  useEffect(() => {
    const scoresRef = ref(db, 'scores');
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      const scoresList: Score[] = data ? Object.values(data) : []; 
      setScores(scoresList);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puntuaciones</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreItem: {
    backgroundColor: '#16213e',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  scoreText: {
    color: '#fff',
    fontSize: 16,
  },
});
