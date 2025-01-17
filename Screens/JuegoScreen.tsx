import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ref, push, update, remove } from 'firebase/database';
import { db } from '../config/Config';

const { width, height } = Dimensions.get('window');

// Definir tipo para los insectos
type Insect = {
  id: string;
  x: number;
  y: number;
};

export default function JuegoScreen({ route }: { route: any }) {
  const { email } = route.params; 
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [insects, setInsects] = useState<Insect[]>([]); 
  const [isGameActive, setIsGameActive] = useState(false);

  // Función para generar insectos en posiciones aleatorias
  function generateInsects(): Insect[] {
    const insectsArray: Insect[] = [];
    for (let i = 0; i < 10; i++) {
      insectsArray.push({
        id: `${Math.random()}`,
        x: Math.random() * (width - 60), 
        y: Math.random() * (height - 250),
      });
    }
    return insectsArray;
  }

  // Mover insectos a nuevas posiciones
  function moveInsects() {
    setInsects((prevInsects) =>
      prevInsects.map((insect) => ({
        ...insect,
        x: Math.random() * (width - 60),
        y: Math.random() * (height - 250),
      }))
    );
  }

  // Temporizador para el tiempo restante
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isGameActive) {
      // Guardar puntaje en Firebase y limpiar estado de "jugando"
      saveScoreToDatabase(score);
      setIsGameActive(false);
      Alert.alert('¡Fin del Juego!', `Puntaje Final: ${score}`);
    }
  }, [timeLeft]);

  // Verificar si el puntaje es mayor o igual a 10 y mover los insectos
  useEffect(() => {
    if (score >= 10 && isGameActive) {
      moveInsects(); // Mover insectos a nuevas posiciones
    }
  }, [score, isGameActive]);

  // Regenerar insectos cuando se terminen y el juego siga activo
  useEffect(() => {
    if (insects.length === 0 && isGameActive) {
      setInsects(generateInsects());
    }
  }, [insects, isGameActive]);

  // Función para iniciar el juego
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setInsects(generateInsects()); // Generar insectos al iniciar
    setIsGameActive(true);

    // Actualizar estado "jugando" en Firebase
    if (email) {
      const statusRef = ref(db, `usuarios/${email.replace('.', '_')}/status`);
      update(statusRef, { isPlaying: true }).catch((error) => {
        console.error('Error al actualizar el estado de juego:', error);
      });
    }
  };

  // Función para "atrapar" un insecto
  const handleCatchInsect = (id: string) => {
    setInsects((prev) => prev.filter((insect) => insect.id !== id));
    setScore((prev) => prev + 1);
  };

  // Guardar puntaje en Firebase
  const saveScoreToDatabase = async (finalScore: number) => {
    try {
      const scoresRef = ref(db, `usuarios/${email.replace('.', '_')}/scores`);
      await push(scoresRef, { score: finalScore, timestamp: Date.now() });

      // Limpiar estado "jugando"
      const statusRef = ref(db, `usuarios/${email.replace('.', '_')}/status`);
      await remove(statusRef);

      console.log('Puntaje guardado en Firebase');
    } catch (error) {
      console.error('Error al guardar el puntaje:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Puntaje: {score}</Text>
      <Text style={styles.timer}>Tiempo restante: {timeLeft}s</Text>

      {isGameActive ? (
        <View style={styles.gameArea}>
          {insects.map((insect) => (
            <TouchableOpacity
              key={insect.id}
              style={[styles.insect, { top: insect.y, left: insect.x }]}
              onPress={() => handleCatchInsect(insect.id)}
            />
          ))}
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Jugar</Text>
        </TouchableOpacity>
      )}

      {!isGameActive && score > 0 && (
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Jugar de Nuevo</Text>
        </TouchableOpacity>
      )}
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
  button: {
    backgroundColor: '#00b4d8',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
