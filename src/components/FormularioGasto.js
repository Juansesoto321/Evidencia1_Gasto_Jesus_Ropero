import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SelectCategoria from './SelectCategoria';
import FormularioCategoria from './FormularioCategoria';
import { COLORES } from '../theme/colores';
import { validarGasto, convertirValor, tieneErrores } from '../utils/validaciones';
import { fechaHoy, formatoMoneda } from '../utils/formato';

/**
 * Formulario para registrar un gasto: descripción, categoría (select) y valor.
 * Maneja su propio estado de "lo que el usuario está escribiendo";
 * el gasto ya validado se envía al padre (App.js) con onAgregar.
 *
 * Props:
 * - categorias: categorías disponibles (para el select)
 * - onAgregar: función async (gasto) => true | false
 * - onCrearCategoria: función async (nombre) => { ok, categoria, error }
 * - deshabilitado: bloquea el formulario (por ejemplo, si no hay conexión con la API)
 */
export default function FormularioGasto({
  categorias,
  onAgregar,
  onCrearCategoria,
  deshabilitado = false,
}) {
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [valor, setValor] = useState('');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [creandoCategoria, setCreandoCategoria] = useState(false);

  const valorNumerico = convertirValor(valor);
  const mostrarVistaPrevia = Number.isFinite(valorNumerico) && valorNumerico > 0;

  // Quita el error de un campo cuando el usuario lo corrige
  function limpiarError(campo) {
    if (errores[campo]) {
      setErrores((anteriores) => ({ ...anteriores, [campo]: undefined }));
    }
  }

  async function crearCategoria(nombre) {
    const resultado = await onCrearCategoria(nombre);

    if (resultado.ok) {
      // Se selecciona automáticamente la categoría recién creada
      setCategoriaId(String(resultado.categoria.id));
      setCreandoCategoria(false);
      limpiarError('categoria');
    }

    return resultado;
  }

  async function registrarGasto() {
    // 1. Ejecutar las validaciones
    const resultado = validarGasto({ descripcion, valor, categoriaId });
    setErrores(resultado);

    // 2. Si existen errores, detener el registro
    if (tieneErrores(resultado)) {
      return;
    }

    // 3. Construir el objeto del gasto
    const nuevoGasto = {
      descripcion: descripcion.trim(),
      valor: convertirValor(valor),
      categoriaId: Number(categoriaId),
      fecha: fechaHoy(),
    };

    // 4. Enviar la información al componente padre
    setGuardando(true);
    const guardado = await onAgregar(nuevoGasto);
    setGuardando(false);

    // 5. Limpiar el formulario solo si se guardó
    if (guardado) {
      setDescripcion('');
      setCategoriaId('');
      setValor('');
      setErrores({});
    }
  }

  const bloqueado = deshabilitado || guardando;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registrar nuevo gasto</Text>

      {/* Descripción */}
      <Text style={styles.etiqueta}>Descripción</Text>
      <TextInput
        style={[styles.input, errores.descripcion && styles.inputError]}
        placeholder="Ejemplo: Almuerzo en la cafetería"
        placeholderTextColor={COLORES.textoSecundario}
        value={descripcion}
        onChangeText={(texto) => {
          setDescripcion(texto);
          limpiarError('descripcion');
        }}
        maxLength={60}
        editable={!bloqueado}
      />
      {errores.descripcion && <Text style={styles.error}>{errores.descripcion}</Text>}

      {/* Categoría */}
      <View style={styles.filaEtiqueta}>
        <Text style={styles.etiqueta}>Categoría</Text>
        {!creandoCategoria && (
          <Pressable
            onPress={() => setCreandoCategoria(true)}
            disabled={bloqueado}
            style={styles.enlace}
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={16} color={COLORES.primario} />
            <Text style={styles.textoEnlace}>Nueva categoría</Text>
          </Pressable>
        )}
      </View>
      <SelectCategoria
        categorias={categorias}
        valor={categoriaId}
        onCambiar={(id) => {
          setCategoriaId(id);
          limpiarError('categoria');
        }}
        conError={Boolean(errores.categoria)}
        deshabilitado={bloqueado}
      />
      {errores.categoria && <Text style={styles.error}>{errores.categoria}</Text>}

      {creandoCategoria && (
        <FormularioCategoria
          categorias={categorias}
          onCrear={crearCategoria}
          onCancelar={() => setCreandoCategoria(false)}
        />
      )}

      {/* Valor */}
      <Text style={styles.etiqueta}>Valor del gasto</Text>
      <TextInput
        style={[styles.input, errores.valor && styles.inputError]}
        placeholder="Ejemplo: 50000"
        placeholderTextColor={COLORES.textoSecundario}
        value={valor}
        onChangeText={(texto) => {
          setValor(texto);
          limpiarError('valor');
        }}
        keyboardType="numeric"
        editable={!bloqueado}
      />
      {errores.valor ? (
        <Text style={styles.error}>{errores.valor}</Text>
      ) : (
        mostrarVistaPrevia && (
          <Text style={styles.ayuda}>Se registrará: {formatoMoneda(valorNumerico)}</Text>
        )
      )}

      <Pressable
        style={({ pressed }) => [
          styles.boton,
          pressed && styles.presionado,
          bloqueado && styles.botonBloqueado,
        ]}
        onPress={registrarGasto}
        disabled={bloqueado}
        accessibilityRole="button"
      >
        {guardando ? (
          <ActivityIndicator color={COLORES.textoClaro} />
        ) : (
          <Text style={styles.textoBoton}>Registrar gasto</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES.tarjeta,
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORES.texto,
  },
  filaEtiqueta: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORES.texto,
    marginBottom: 6,
    marginTop: 12,
  },
  enlace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    paddingVertical: 2,
  },
  textoEnlace: {
    color: COLORES.primario,
    fontWeight: '600',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORES.texto,
    backgroundColor: COLORES.tarjeta,
  },
  inputError: {
    borderColor: COLORES.error,
  },
  error: {
    color: COLORES.error,
    marginTop: 5,
    fontSize: 13,
  },
  ayuda: {
    color: COLORES.exito,
    marginTop: 5,
    fontSize: 13,
  },
  boton: {
    backgroundColor: COLORES.primario,
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  botonBloqueado: {
    opacity: 0.6,
  },
  presionado: {
    opacity: 0.8,
  },
  textoBoton: {
    color: COLORES.textoClaro,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
