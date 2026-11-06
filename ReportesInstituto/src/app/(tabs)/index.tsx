import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useReportes } from '../../context/ReportesContext';

export default function IndexScreen() {
  const { reportes } = useReportes();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const reportesProcesados = useMemo(() => {
    const termino = busqueda.toLowerCase();
    const pesosEstado: Record<string, number> = {
      pendiente: 1,
      'en curso': 2,
      resuelto: 3,
    };

    return reportes
      .filter((reporte) => {
        const coincideBusqueda =
          reporte.titulo.toLowerCase().includes(termino) ||
          reporte.aula_sector.toLowerCase().includes(termino);
        const coincideEstado =
          filtroEstado === 'Todos' || reporte.estado.toLowerCase() === filtroEstado.toLowerCase();

        return coincideBusqueda && coincideEstado;
      })
      .sort(
        (a, b) =>
          (pesosEstado[a.estado.toLowerCase()] ?? 4) -
          (pesosEstado[b.estado.toLowerCase()] ?? 4),
      );
  }, [reportes, busqueda, filtroEstado]);

  // Función auxiliar para el color del punto de estado
  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'resuelto': return '#22C55E'; // Verde
      case 'en curso': return '#06B6D4'; // Cian
      default: return '#F59E0B'; // Amarillo (Pendiente)
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Link href={`/reporte/${item.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.subtitle}>{item.aula_sector}</Text>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.estado) }]} />
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reportes del Instituto</Text>
      <Text style={styles.subHeader}>Instituto Politécnico Formosa</Text>

      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar por palabra o sector..."
          placeholderTextColor="#94A3B8"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {['Todos', 'Pendiente', 'En curso', 'Resuelto'].map((estado) => {
            const activo = filtroEstado === estado;

            return (
              <Pressable
                key={estado}
                style={[styles.filterButton, { backgroundColor: activo ? '#06B6D4' : '#334155' }]}
                onPress={() => setFiltroEstado(estado)}
              >
                <Text style={[styles.filterText, { color: activo ? '#000000' : '#FFFFFF' }]}>
                  {estado}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={reportesProcesados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Link href="/reporte/nuevo" asChild>
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+ Nuevo Reporte</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Dark slate
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subHeader: {
    color: '#94A3B8',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  controls: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  filters: {
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para que el FAB no tape el último elemento
  },
  card: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    marginTop: 4,
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#06B6D4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});