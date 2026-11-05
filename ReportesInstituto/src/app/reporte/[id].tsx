import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReportes } from '../../context/ReportesContext';
import * as Notifications from 'expo-notifications';

export default function ReporteDetalleScreen() {
  const { id } = useLocalSearchParams();
  const { reportes } = useReportes();
  const router = useRouter();

  // Buscamos el reporte específico en nuestro contexto global
  const reporte = reportes.find(r => r.id === id);

  if (!reporte) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Reporte no encontrado</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const simularResolucion = async () => {
    const tituloAlerta = '✅ Reporte Resuelto';
    const mensajeAlerta = `El desperfecto "${reporte.titulo}" en ${reporte.aula_sector} fue solucionado.`;

    if (Platform.OS === 'web') {
      // Fallback para probar la lógica en el navegador sin celular
      window.alert(`${tituloAlerta}\n\n${mensajeAlerta}`);
    } else {
      // Notificación nativa real para Android/iOS
      await Notifications.scheduleNotificationAsync({
        content: {
          title: tituloAlerta,
          body: mensajeAlerta,
        },
        trigger: null, // trigger null la dispara instantáneamente
      });
      Alert.alert('Aviso', 'Se disparó la notificación local.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título del problema</Text>
      <Text style={styles.title}>{reporte.titulo}</Text>

      <Text style={styles.label}>Ubicación / Coordenadas</Text>
      {/* Acá se renderizan las coordenadas o el QR capturado */}
      <Text style={styles.location}>{reporte.aula_sector}</Text>

      <Text style={styles.label}>Estado actual</Text>
      <Text style={styles.status}>{reporte.estado}</Text>

      <Pressable style={styles.button} onPress={simularResolucion}>
        <Text style={styles.buttonText}>Simular Resolución</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 24,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    color: '#06B6D4', // Nuestro color cian de acento
    fontSize: 18,
    fontWeight: '500',
  },
  status: {
    color: '#F59E0B',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: '#06B6D4',
    padding: 16,
    borderRadius: 8,
    marginTop: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000', // Negro para máximo contraste
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});