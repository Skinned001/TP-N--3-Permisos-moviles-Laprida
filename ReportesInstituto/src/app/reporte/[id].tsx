import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReportes } from '../../context/ReportesContext';
import * as Notifications from 'expo-notifications';

export default function ReporteDetalleScreen() {
  const { id } = useLocalSearchParams();
  const { reportes, actualizarEstado } = useReportes();
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

  const marcarComoResuelto = async () => {
    actualizarEstado(reporte.id, 'Resuelto');

    const tituloAlerta = '✅ Reporte Resuelto';
    const mensajeAlerta = `El desperfecto "${reporte.titulo}" en ${reporte.aula_sector} fue solucionado.`;

    if (Platform.OS === 'web') {
      window.alert(`${tituloAlerta}\n\n${mensajeAlerta}`);
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: tituloAlerta,
          body: mensajeAlerta,
        },
        trigger: null,
      });
    }

    router.back();
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

      {reporte.estado === 'Resuelto' ? (
        <View style={styles.resolvedNotice}>
          <Text style={styles.resolvedNoticeText}>
            Este reporte ya está solucionado.
          </Text>
        </View>
      ) : (
        <View style={styles.stateControls}>
          <View style={styles.statusButtons}>
            <Pressable
              style={styles.statusButton}
              onPress={() => actualizarEstado(reporte.id, 'Pendiente')}
            >
              <Text style={styles.statusButtonText}>Pendiente</Text>
            </Pressable>
            <Pressable
              style={styles.statusButton}
              onPress={() => actualizarEstado(reporte.id, 'En curso')}
            >
              <Text style={styles.statusButtonText}>En curso</Text>
            </Pressable>
          </View>
          <Pressable style={styles.button} onPress={marcarComoResuelto}>
            <Text style={styles.buttonText}>✓ Marcar como Resuelto</Text>
          </Pressable>
        </View>
      )}
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
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
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
  stateControls: {
    marginTop: 24,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  resolvedNotice: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  resolvedNoticeText: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});