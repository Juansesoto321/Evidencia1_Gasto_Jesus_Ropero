import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Logo from './Logo';
import { COLORES } from '../theme/colores';

// El "native driver" anima en el hilo nativo (más fluido), pero no existe en web
const USAR_DRIVER_NATIVO = Platform.OS !== 'web';
const DURACION_SALIDA = 450;

/**
 * Pantalla de carga inicial (splash).
 * - Muestra el logo con una animación de entrada y un "latido".
 * - Llena una barra de progreso durante `duracion` milisegundos (3 s).
 * - Al terminar se desvanece (fade out) y avisa al padre con onTerminar().
 *
 * Props:
 * - duracion: tiempo visible en milisegundos (por defecto 3000)
 * - onTerminar: función que se ejecuta cuando la pantalla terminó de ocultarse
 */
export default function PantallaCarga({ duracion = 3000, onTerminar }) {
  const margenes = useSafeAreaInsets();

  const opacidad = useRef(new Animated.Value(0)).current;
  const escalaEntrada = useRef(new Animated.Value(0.6)).current;
  const pulso = useRef(new Animated.Value(1)).current;
  const progreso = useRef(new Animated.Value(0)).current;

  // Se guarda en una referencia para no reiniciar la animación si el padre se renderiza
  const alTerminar = useRef(onTerminar);
  alTerminar.current = onTerminar;

  useEffect(() => {
    // 1. Entrada: aparece y el logo crece
    const entrada = Animated.parallel([
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 500,
        useNativeDriver: USAR_DRIVER_NATIVO,
      }),
      Animated.spring(escalaEntrada, {
        toValue: 1,
        friction: 5,
        useNativeDriver: USAR_DRIVER_NATIVO,
      }),
    ]);

    // 2. Latido continuo del logo
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 1.08,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
        Animated.timing(pulso, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
      ])
    );

    // 3. Barra de progreso durante toda la duración
    const barra = Animated.timing(progreso, {
      toValue: 1,
      duration: duracion,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // el ancho no se puede animar con el driver nativo
    });

    entrada.start();
    latido.start();
    barra.start();

    // 4. Salida: al cumplirse el tiempo se desvanece y avisa al padre
    const temporizador = setTimeout(() => {
      Animated.timing(opacidad, {
        toValue: 0,
        duration: DURACION_SALIDA,
        useNativeDriver: USAR_DRIVER_NATIVO,
      }).start(() => {
        alTerminar.current?.();
      });
    }, duracion);

    return () => {
      clearTimeout(temporizador);
      entrada.stop();
      latido.stop();
      barra.stop();
    };
  }, [duracion, opacidad, escalaEntrada, pulso, progreso]);

  const anchoBarra = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[styles.contenedor, { opacity: opacidad }]}
      accessibilityLabel="Cargando MiGasto"
    >
      <View style={styles.centro}>
        <Animated.View style={{ transform: [{ scale: escalaEntrada }, { scale: pulso }] }}>
          <Logo tamano={110} />
        </Animated.View>

        <Text style={styles.titulo}>MiGasto</Text>
        <Text style={styles.subtitulo}>Control de gastos personales</Text>

        <View style={styles.pista}>
          <Animated.View style={[styles.relleno, { width: anchoBarra }]} />
        </View>
        <Text style={styles.cargando}>Cargando tus gastos...</Text>
      </View>

      <Text style={[styles.pie, { marginBottom: margenes.bottom + 20 }]}>
        SENA · Análisis y Desarrollo de Software
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: COLORES.primarioOscuro,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titulo: {
    marginTop: 24,
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORES.textoClaro,
  },
  subtitulo: {
    marginTop: 4,
    fontSize: 16,
    color: '#C7D7F5',
  },
  pista: {
    marginTop: 40,
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORES.acento,
  },
  cargando: {
    marginTop: 12,
    fontSize: 13,
    color: '#C7D7F5',
  },
  pie: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
