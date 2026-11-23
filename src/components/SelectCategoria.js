import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { COLORES } from '../theme/colores';

/**
 * Select (lista desplegable) de categorías. Componente reutilizable:
 * - En FormularioGasto sirve para elegir la categoría del gasto.
 * - En ListaGastos sirve para filtrar por categoría.
 *
 * Las opciones se generan dinámicamente a partir de la lista `categorias`
 * que llega desde la API, por eso al crear una categoría nueva aparece sola.
 *
 * Props:
 * - categorias: [{ id, nombre }]
 * - valor: id seleccionado como texto ('' = ninguna)
 * - onCambiar: función que recibe el nuevo id (texto)
 * - textoVacio: texto de la primera opción (ej. "Selecciona una categoría")
 * - conError: si es true, el borde se pinta de rojo
 * - deshabilitado: si es true, no se puede cambiar
 */
export default function SelectCategoria({
  categorias,
  valor,
  onCambiar,
  textoVacio = 'Selecciona una categoría',
  conError = false,
  deshabilitado = false,
}) {
  return (
    <View
      style={[
        styles.contenedor,
        conError && styles.contenedorError,
        deshabilitado && styles.deshabilitado,
      ]}
    >
      <Picker
        selectedValue={valor}
        onValueChange={(nuevoValor) => onCambiar(String(nuevoValor))}
        enabled={!deshabilitado}
        style={styles.picker}
        dropdownIconColor={COLORES.textoSecundario}
        accessibilityLabel={textoVacio}
      >
        <Picker.Item label={textoVacio} value="" color={COLORES.textoSecundario} />
        {categorias.map((categoria) => (
          <Picker.Item
            key={categoria.id}
            label={categoria.nombre}
            value={String(categoria.id)}
            color={COLORES.texto}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 8,
    backgroundColor: COLORES.tarjeta,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  contenedorError: {
    borderColor: COLORES.error,
  },
  deshabilitado: {
    opacity: 0.5,
  },
  picker: Platform.select({
    web: {
      height: 46,
      paddingHorizontal: 10,
      fontSize: 16,
      borderWidth: 0,
      backgroundColor: 'transparent',
      color: COLORES.texto,
    },
    default: {
      color: COLORES.texto,
    },
  }),
});
