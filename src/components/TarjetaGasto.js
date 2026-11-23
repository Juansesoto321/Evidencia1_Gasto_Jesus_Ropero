import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES } from '../theme/colores';
import { formatoMoneda, formatoFecha } from '../utils/formato';

/**
 * Muestra la información de UN gasto: descripción, categoría, fecha y valor.
 * Para eliminar pide confirmación en la misma tarjeta
 * (Alert.alert con botones no funciona en el navegador).
 *
 * Props:
 * - gasto: { id, descripcion, categoria, valor, fecha }
 * - onEliminar: función async (id) que entrega App.js
 */
export default function TarjetaGasto({ gasto, onEliminar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  async function confirmarEliminacion() {
    setEliminando(true);
    const eliminado = await onEliminar(gasto.id);
    // Si se eliminó, la tarjeta desaparece; si falló, se restaura
    if (!eliminado) {
      setEliminando(false);
      setConfirmando(false);
    }
  }

  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <View style={styles.icono}>
          <Text style={styles.inicial}>{gasto.categoria.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.detalle}>
          <Text style={styles.descripcion} numberOfLines={2}>
            {gasto.descripcion}
          </Text>
          <View style={styles.meta}>
            <View style={styles.chip}>
              <Text style={styles.textoChip}>{gasto.categoria}</Text>
            </View>
            <Text style={styles.fecha}>{formatoFecha(gasto.fecha)}</Text>
          </View>
        </View>

        <View style={styles.derecha}>
          <Text style={styles.valor}>{formatoMoneda(gasto.valor)}</Text>
          {!confirmando && (
            <Pressable
              onPress={() => setConfirmando(true)}
              style={styles.botonIcono}
              accessibilityRole="button"
              accessibilityLabel={`Eliminar ${gasto.descripcion}`}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={18} color={COLORES.textoSecundario} />
            </Pressable>
          )}
        </View>
      </View>

      {confirmando && (
        <View style={styles.confirmacion}>
          <Text style={styles.textoConfirmacion}>¿Eliminar este gasto?</Text>
          <Pressable
            onPress={() => setConfirmando(false)}
            disabled={eliminando}
            style={styles.botonCancelar}
            accessibilityRole="button"
          >
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={confirmarEliminacion}
            disabled={eliminando}
            style={styles.botonEliminar}
            accessibilityRole="button"
          >
            {eliminando ? (
              <ActivityIndicator size="small" color={COLORES.error} />
            ) : (
              <Text style={styles.textoEliminar}>Eliminar</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES.tarjeta,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inicial: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
  detalle: {
    flex: 1,
    minWidth: 0,
  },
  descripcion: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  chip: {
    backgroundColor: COLORES.primarioSuave,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  textoChip: {
    fontSize: 12,
    color: COLORES.primario,
    fontWeight: '600',
  },
  fecha: {
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  derecha: {
    alignItems: 'flex-end',
    marginLeft: 10,
    gap: 6,
  },
  valor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORES.exito,
  },
  botonIcono: {
    padding: 2,
  },
  confirmacion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORES.fondo,
  },
  textoConfirmacion: {
    flex: 1,
    color: COLORES.texto,
    fontSize: 13,
  },
  botonCancelar: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  textoCancelar: {
    color: COLORES.textoSecundario,
    fontWeight: '600',
  },
  botonEliminar: {
    backgroundColor: COLORES.errorFondo,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 76,
    alignItems: 'center',
  },
  textoEliminar: {
    color: COLORES.error,
    fontWeight: 'bold',
  },
});
