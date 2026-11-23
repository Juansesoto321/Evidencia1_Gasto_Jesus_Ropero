import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Componentes
import PantallaCarga from './src/components/PantallaCarga';
import Encabezado from './src/components/Encabezado';
import ResumenGastos from './src/components/ResumenGastos';
import FormularioGasto from './src/components/FormularioGasto';
import ListaGastos from './src/components/ListaGastos';
import Mensaje from './src/components/Mensaje';
import AvisoFlotante from './src/components/AvisoFlotante';

// Servicios (comunicación con la API REST)
import { obtenerGastos, crearGasto, eliminarGasto } from './src/services/gastoService';
import { obtenerCategorias, crearCategoria } from './src/services/categoriaService';

// Reglas de negocio y estilos
import { buscarCategoriaRepetida } from './src/utils/validaciones';
import { COLORES } from './src/theme/colores';

const DURACION_PANTALLA_CARGA = 3000;
const DURACION_AVISO = 3500;

// Ordena las categorías alfabéticamente (respetando tildes y ñ)
function ordenarCategorias(lista) {
  return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

/**
 * Componente principal.
 * Administra el estado de la aplicación (gastos y categorías),
 * se comunica con la API mediante los servicios
 * y reparte los datos a los componentes hijos mediante props.
 */
export default function App() {
  // ---------- Estado principal ----------
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // ---------- Estado de la interfaz ----------
  const [mostrarPantallaCarga, setMostrarPantallaCarga] = useState(true);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorConexion, setErrorConexion] = useState(null);
  const [aviso, setAviso] = useState(null);
  const temporizadorAviso = useRef(null);

  // Muestra un mensaje flotante que se oculta solo
  function mostrarAviso(tipo, texto) {
    clearTimeout(temporizadorAviso.current);
    setAviso({ tipo, texto });
    temporizadorAviso.current = setTimeout(() => setAviso(null), DURACION_AVISO);
  }

  // ---------- Consultar datos en la API (GET) ----------
  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true);
    setErrorConexion(null);

    try {
      // Las dos consultas se hacen al mismo tiempo
      const [listaGastos, listaCategorias] = await Promise.all([
        obtenerGastos(),
        obtenerCategorias(),
      ]);
      setGastos(listaGastos);
      setCategorias(ordenarCategorias(listaCategorias));
    } catch (error) {
      setErrorConexion(error.message);
    } finally {
      setCargandoDatos(false);
    }
  }, []);

  // Se ejecuta una sola vez, al iniciar la aplicación
  // (mientras se ve la pantalla de carga)
  useEffect(() => {
    cargarDatos();
    return () => clearTimeout(temporizadorAviso.current);
  }, [cargarDatos]);

  // ---------- Unir cada gasto con el nombre de su categoría ----------
  // En la API el gasto solo guarda "categoriaId" (relación con /categorias)
  const gastosConCategoria = useMemo(
    () =>
      gastos.map((gasto) => {
        const categoria = categorias.find(
          (item) => String(item.id) === String(gasto.categoriaId)
        );
        return { ...gasto, categoria: categoria ? categoria.nombre : 'Sin categoría' };
      }),
    [gastos, categorias]
  );

  // ---------- Registrar un gasto (POST) ----------
  async function agregarGasto(nuevoGasto) {
    try {
      const gastoCreado = await crearGasto(nuevoGasto);
      setGastos((anteriores) => [gastoCreado, ...anteriores]);
      mostrarAviso('exito', 'Gasto registrado correctamente.');
      return true;
    } catch (error) {
      mostrarAviso('error', error.message);
      return false;
    }
  }

  // ---------- Eliminar un gasto (DELETE) ----------
  async function eliminarGastoPorId(id) {
    try {
      await eliminarGasto(id);
      setGastos((anteriores) => anteriores.filter((gasto) => gasto.id !== id));
      mostrarAviso('exito', 'Gasto eliminado.');
      return true;
    } catch (error) {
      mostrarAviso('error', error.message);
      return false;
    }
  }

  // ---------- Registrar una categoría (POST) ----------
  async function agregarCategoria(nombre) {
    // Regla de negocio: verificar que la categoría NO exista antes de registrarla
    const repetida = buscarCategoriaRepetida(nombre, categorias);
    if (repetida) {
      return { ok: false, error: `La categoría "${repetida.nombre}" ya existe.` };
    }

    try {
      const categoriaCreada = await crearCategoria(nombre);
      setCategorias((anteriores) => ordenarCategorias([...anteriores, categoriaCreada]));
      mostrarAviso('exito', `Categoría "${categoriaCreada.nombre}" creada.`);
      return { ok: true, categoria: categoriaCreada };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  return (
    <SafeAreaProvider>
      <View style={styles.pantalla}>
        <StatusBar style="light" />

        <Encabezado />

        <KeyboardAvoidingView
          style={styles.pantalla}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.contenido}
            keyboardShouldPersistTaps="handled"
          >
            {errorConexion && (
              <Mensaje
                tipo="error"
                texto={errorConexion}
                accion={{ texto: 'Reintentar', onPress: cargarDatos }}
                style={styles.errorConexion}
              />
            )}

            {/* Componente de resumen */}
            <ResumenGastos gastos={gastos} />

            {/* Componente de formulario */}
            <FormularioGasto
              categorias={categorias}
              onAgregar={agregarGasto}
              onCrearCategoria={agregarCategoria}
              deshabilitado={Boolean(errorConexion) || cargandoDatos}
            />

            {/* Componente de listado */}
            <ListaGastos
              gastos={gastosConCategoria}
              categorias={categorias}
              cargando={cargandoDatos}
              onEliminar={eliminarGastoPorId}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <AvisoFlotante aviso={aviso} />

        {/* Pantalla de carga: se dibuja encima de todo y se desvanece a los 3 s */}
        {mostrarPantallaCarga && (
          <PantallaCarga
            duracion={DURACION_PANTALLA_CARGA}
            onTerminar={() => setMostrarPantallaCarga(false)}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 90,
  },
  errorConexion: {
    marginBottom: 16,
  },
});
