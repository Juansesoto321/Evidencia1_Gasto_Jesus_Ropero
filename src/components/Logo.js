import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES } from '../theme/colores';

/**
 * Logo propio de MiGasto: una billetera dentro de un círculo,
 * con una pequeña insignia verde con el signo $.
 * Es reutilizable: lo usan el Encabezado y la PantallaCarga.
 *
 * Props:
 * - tamano: diámetro del logo en píxeles (por defecto 48)
 */
export default function Logo({ tamano = 48 }) {
  const insignia = Math.round(tamano * 0.38);

  return (
    <View
      style={[
        styles.circulo,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
      ]}
      accessibilityRole="image"
      accessibilityLabel="Logo de MiGasto"
    >
      <Ionicons name="wallet" size={tamano * 0.52} color={COLORES.primario} />

      <View
        style={[
          styles.insignia,
          { width: insignia, height: insignia, borderRadius: insignia / 2 },
        ]}
      >
        <Text style={[styles.signo, { fontSize: insignia * 0.62 }]}>$</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    backgroundColor: COLORES.tarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insignia: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: COLORES.acento,
    borderWidth: 2,
    borderColor: COLORES.tarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signo: {
    color: COLORES.textoClaro,
    fontWeight: 'bold',
  },
});
