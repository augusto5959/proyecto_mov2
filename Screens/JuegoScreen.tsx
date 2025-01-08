import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { db } from '../config/Config';

const { width, height } = Dimensions.get('window');


export default function JuegoScreen() {
  const [score, setScore] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(30); 
  const [insects, setInsects] = useState(generateInsects());

  // Función para generar insectos en posiciones aleatorias
  function generateInsects() {
    const insectsArray = [];
    for (let i = 0; i < 10; i++) {
      insectsArray.push({
        id: i.toString(),
        x: Math.random() * (width - 50),
        y: Math.random() * (height - 200),
      });
    }
    return insectsArray;
  }

  // Temporizador para el tiempo restante
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Guardar puntaje en Firebase
      saveScoreToDatabase(score);
      Alert.alert('¡Fin del Juego!', `Puntaje Final: ${score}`);
    }
  }, [timeLeft]);

  // Función para "atrapar" un insecto
  const handleCatchInsect = (id: string) => {
    setInsects((prev) => prev.filter((insect) => insect.id !== id));
    setScore((prev) => prev + 1);
  };

  // Guardar puntaje en Firebase
  const saveScoreToDatabase = async (finalScore: number) => {
    try {
      const scoresRef = ref(db, 'scores'); 
      await push(scoresRef, { score: finalScore, timestamp: Date.now() });
      console.log('Puntaje guardado en Firebase');
    } catch (error) {
      console.error('Error al guardar el puntaje:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Puntaje: {score}</Text>
      <Text style={styles.timer}>Tiempo restante: {timeLeft}s</Text>

      <View style={styles.gameArea}>
        {insects.map((insect) => (
          <TouchableOpacity
            key={insect.id}
            style={[styles.insect, { top: insect.y, left: insect.x }]}
            onPress={() => handleCatchInsect(insect.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  score: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    color: '#e63946',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gameArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#1a1a2e',
  },
  insect: {
    width: 50,
    height: 50,
    backgroundColor: '#f4a261',
    position: 'absolute',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
  },
});
