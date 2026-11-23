import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';

import Mensaje from './Mensaje';
import { COLORES } from '../theme/colores';
import {
  validarCategoria,
  buscarCategoriaRepetida,
  formatearNombreCategoria,
} from '../utils/validaciones';

/**
 * Mini formulario para crear una categoría nueva.
 * Antes de registrarla valida que NO exista otra con el mismo nombre
 * (sin importar mayúsculas, minúsculas ni tildes).
 *
 * Props:
 * - categorias: categorías existentes (para validar repetidas)
 * - onCrear: función async (nombre) => { ok, categoria, error } que entrega App.js
 * - onCancelar: cierra el mini formulario
 */
export default function FormularioCategoria({ categorias, onCrear, onCancelar }) {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null); // { tipo, texto }
  const [guardando, setGuardando] = useState(false);

  async function registrarCategoria() {
    // 1. Validar (incluye la regla de categorías repetidas)
    const errores = validarCategoria(nombre, categorias);

    if (errores.nombre) {
      const esRepetida = Boolean(buscarCategoriaRepetida(nombre, categorias));
      setMensaje({ tipo: esRepetida ? 'info' : 'error', texto: errores.nombre });
      return;
    }

    // 2. Enviar al componente padre (App.js), que la guarda en la API
    setGuardando(true);
    const resultado = await onCrear(formatearNombreCategoria(nombre));
    setGuardando(false);

    if (!resultado.ok) {
      setMensaje({ tipo: 'error', texto: resultado.error });
      return;
    }

    // 3. Limpiar
    setNombre('');
    setMensaje(null);
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Nueva categoría</Text>

      <View style={styles.fila}>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Mascotas"
          placeholderTextColor={COLORES.textoSecundario}
          value={nombre}
          onChangeText={(texto) => {
            setNombre(texto);
            setMensaje(null);
          }}
          onSubmitEditing={registrarCategoria}
          maxLength={30}
          autoFocus
        />

        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
          onPress={registrarCategoria}
          disabled={guardando}
          accessibilityRole="button"
        >
          {guardando ? (
            <ActivityIndicator color={COLORES.textoClaro} size="small" />
          ) : (
            <Text style={styles.textoBoton}>Agregar</Text>
          )}
        </Pressable>
      </View>

      {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} style={styles.mensaje} />}

      <Pressable onPress={onCancelar} style={styles.cancelar} accessibilityRole="button">
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORES.fondo,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderStyle: 'dashed',
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORES.texto,
    marginBottom: 8,
  },
  fila: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: COLORES.tarjeta,
    color: COLORES.texto,
  },
  boton: {
    backgroundColor: COLORES.acento,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    minWidth: 84,
    alignItems: 'center',
  },
  textoBoton: {
    color: COLORES.textoClaro,
    fontWeight: 'bold',
  },
  presionado: {
    opacity: 0.7,
  },
  mensaje: {
    marginTop: 8,
  },
  cancelar: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },
  textoCancelar: {
    color: COLORES.textoSecundario,
    fontWeight: '600',
  },
});
