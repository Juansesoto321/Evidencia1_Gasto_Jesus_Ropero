import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Logo from './Logo';
import { COLORES } from '../theme/colores';
import { mesActual } from '../utils/formato';

/**
 * Encabezado (Header) de la aplicación.
 * Respeta el área segura del celular (notch / barra de estado)
 * usando useSafeAreaInsets.
 */
export default function Encabezado() {
  const margenes = useSafeAreaInsets();

  return (
    <View style={[styles.contenedor, { paddingTop: margenes.top + 14 }]}>
      <View style={styles.contenido}>
        <View style={styles.marca}>
          <Logo tamano={50} />

          <View style={styles.textos}>
            <Text style={styles.titulo}>MiGasto</Text>
            <Text style={styles.subtitulo} numberOfLines={1}>
              Control de gastos personales
            </Text>
          </View>
        </View>

        <View style={styles.periodo}>
          <Ionicons name="calendar-outline" size={14} color={COLORES.textoClaro} />
          <Text style={styles.textoPeriodo}>{mesActual()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES.primarioOscuro,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  contenido: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  textos: {
    marginLeft: 12,
    flexShrink: 1,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORES.textoClaro,
  },
  subtitulo: {
    fontSize: 14,
    color: '#C7D7F5',
  },
  periodo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  textoPeriodo: {
    color: COLORES.textoClaro,
    fontSize: 13,
    fontWeight: '600',
  },
});
