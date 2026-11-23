import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import TarjetaGasto from './TarjetaGasto';
import SelectCategoria from './SelectCategoria';
import { COLORES } from '../theme/colores';

/**
 * Lista de gastos con filtro por categoría.
 * Muestra los estados: cargando, vacío y con datos.
 *
 * Props:
 * - gastos: gastos con el nombre de su categoría [{ id, descripcion, categoria, categoriaId, valor, fecha }]
 * - categorias: categorías para el filtro
 * - cargando: true mientras se consultan los datos en la API
 * - onEliminar: función async (id) => true | false
 */
export default function ListaGastos({ gastos, categorias, cargando, onEliminar }) {
  // Estado local de la interfaz: qué categoría se está filtrando ('' = todas)
  const [filtro, setFiltro] = useState('');

  const gastosFiltrados =
    filtro === ''
      ? gastos
      : gastos.filter((gasto) => String(gasto.categoriaId) === filtro);

  function renderContenido() {
    if (cargando) {
      return (
        <View style={styles.estado}>
          <ActivityIndicator color={COLORES.primario} />
          <Text style={styles.textoEstado}>Consultando gastos...</Text>
        </View>
      );
    }

    if (gastos.length === 0) {
      return (
        <View style={styles.estado}>
          <Text style={styles.textoEstado}>No hay gastos registrados.</Text>
        </View>
      );
    }

    if (gastosFiltrados.length === 0) {
      return (
        <View style={styles.estado}>
          <Text style={styles.textoEstado}>No hay gastos en esta categoría.</Text>
        </View>
      );
    }

    // Se usa map (y no FlatList) porque la lista ya está dentro de un ScrollView
    return gastosFiltrados.map((gasto) => (
      <TarjetaGasto key={gasto.id} gasto={gasto} onEliminar={onEliminar} />
    ));
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Mis gastos</Text>
        {!cargando && gastos.length > 0 && (
          <Text style={styles.contador}>
            {gastosFiltrados.length} de {gastos.length}
          </Text>
        )}
      </View>

      {gastos.length > 0 && (
        <View style={styles.filtro}>
          <SelectCategoria
            categorias={categorias}
            valor={filtro}
            onCambiar={setFiltro}
            textoVacio="Todas las categorías"
          />
        </View>
      )}

      {renderContenido()}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 20,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  contador: {
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  filtro: {
    marginBottom: 12,
  },
  estado: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
    backgroundColor: COLORES.tarjeta,
    borderRadius: 12,
  },
  textoEstado: {
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
