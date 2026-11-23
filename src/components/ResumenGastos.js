import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES } from '../theme/colores';
import { formatoMoneda } from '../utils/formato';

/**
 * Resumen de gastos: total gastado y cantidad de registros.
 *
 * Props:
 * - gastos: lista de gastos (viene del estado de App.js)
 */
export default function ResumenGastos({ gastos }) {
  // Calcular el total de los gastos
  const total = gastos.reduce((acumulado, gasto) => acumulado + Number(gasto.valor), 0);

  // Cantidad de registros
  const cantidad = gastos.length;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Resumen de gastos</Text>

      <View style={styles.tarjetas}>
        <View style={styles.tarjeta}>
          <View style={styles.encabezadoTarjeta}>
            <Ionicons name="cash-outline" size={16} color={COLORES.textoSecundario} />
            <Text style={styles.etiqueta}>Total gastado</Text>
          </View>
          <Text style={styles.total} numberOfLines={1} adjustsFontSizeToFit>
            {formatoMoneda(total)}
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <View style={styles.encabezadoTarjeta}>
            <Ionicons name="receipt-outline" size={16} color={COLORES.textoSecundario} />
            <Text style={styles.etiqueta}>Cantidad de gastos</Text>
          </View>
          <Text style={styles.cantidad}>{cantidad}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORES.texto,
    marginBottom: 12,
  },
  tarjetas: {
    flexDirection: 'row',
    gap: 10,
  },
  tarjeta: {
    flex: 1,
    backgroundColor: COLORES.primarioSuave,
    padding: 15,
    borderRadius: 12,
  },
  encabezadoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etiqueta: {
    fontSize: 13,
    color: '#475467',
    flexShrink: 1,
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES.primario,
    marginTop: 8,
  },
  cantidad: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES.primario,
    marginTop: 8,
  },
});
