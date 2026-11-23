import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Puerto donde corre json-server (ver script "api" en package.json)
const PUERTO_API = 3000;

// Tiempo máximo de espera de una petición (milisegundos)
const TIEMPO_LIMITE = 8000;

/**
 * Obtiene la IP del computador donde corre la API.
 * - En el celular (Expo Go), "localhost" sería el propio celular, por eso
 *   se usa la IP del PC que Expo informa en hostUri (ej: "192.168.1.10:8081").
 * - En el navegador (Windows) se usa el mismo host de la página.
 */
function obtenerHost() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    return hostUri.split(':')[0];
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.hostname;
  }

  return 'localhost';
}

export const API_URL = `http://${obtenerHost()}:${PUERTO_API}`;

/**
 * Función base para consumir la API REST.
 * Centraliza la URL, los encabezados, el tiempo límite y los mensajes de error.
 */
export async function peticion(ruta, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE);

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: { 'Content-Type': 'application/json' },
      signal: controlador.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La API no respondió a tiempo. Intenta de nuevo.');
    }
    throw new Error(
      'No hay conexión con la API. Verifica que esté encendida con "npm run api".'
    );
  } finally {
    clearTimeout(temporizador);
  }

  if (!respuesta.ok) {
    throw new Error(`La API respondió con un error (código ${respuesta.status}).`);
  }

  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}
