import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES } from '../theme/colores';

const TIPOS = {
  exito: { icono: 'checkmark-circle', color: COLORES.exito, fondo: COLORES.exitoFondo },
  error: { icono: 'alert-circle', color: COLORES.error, fondo: COLORES.errorFondo },
  info: { icono: 'information-circle', color: COLORES.info, fondo: COLORES.infoFondo },
};

/**
 * Mensaje informativo reutilizable (éxito, error o información).
 * Se usa en lugar de Alert.alert porque Alert no funciona en el navegador.
 *
 * Props:
 * - tipo: 'exito' | 'error' | 'info'
 * - texto: mensaje a mostrar
 * - accion: (opcional) { texto, onPress } para mostrar un botón, ej. "Reintentar"
 * - style: (opcional) estilos adicionales
 */
export default function Mensaje({ tipo = 'info', texto, accion, style }) {
  const config = TIPOS[tipo] ?? TIPOS.info;

  return (
    <View
      style={[styles.contenedor, { backgroundColor: config.fondo }, style]}
      accessibilityRole="alert"
    >
      <Ionicons name={config.icono} size={20} color={config.color} />
      <Text style={[styles.texto, { color: config.color }]}>{texto}</Text>

      {accion && (
        <Pressable
          onPress={accion.onPress}
          style={({ pressed }) => [
            styles.boton,
            { borderColor: config.color },
            pressed && styles.presionado,
          ]}
        >
          <Text style={[styles.textoBoton, { color: config.color }]}>{accion.texto}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  texto: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  boton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  textoBoton: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  presionado: {
    opacity: 0.6,
  },
});
