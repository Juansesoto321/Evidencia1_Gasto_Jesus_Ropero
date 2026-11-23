import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Mensaje from './Mensaje';

/**
 * Muestra un Mensaje flotando en la parte inferior de la pantalla
 * (tipo "toast"), respetando el área segura del celular.
 *
 * Props:
 * - aviso: { tipo, texto } o null para no mostrar nada
 */
export default function AvisoFlotante({ aviso }) {
  const margenes = useSafeAreaInsets();

  if (!aviso) {
    return null;
  }

  return (
    <View
      style={[styles.contenedor, { bottom: margenes.bottom + 16 }]}
      pointerEvents="box-none"
    >
      <Mensaje tipo={aviso.tipo} texto={aviso.texto} style={styles.mensaje} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  mensaje: {
    width: '100%',
    maxWidth: 600,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
