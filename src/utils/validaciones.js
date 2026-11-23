// Reglas de negocio y validaciones de MiGasto.
// Cada función de validación devuelve un objeto con los errores encontrados.
// Un objeto vacío {} significa que los datos son válidos.

const LARGO_MINIMO_CATEGORIA = 3;
const LARGO_MAXIMO_CATEGORIA = 30;
const LARGO_MAXIMO_DESCRIPCION = 60;

/**
 * Normaliza un texto para poder compararlo:
 * - quita espacios al inicio y al final, y espacios dobles
 * - pasa todo a minúsculas
 * - quita las tildes (á → a), pero conserva la ñ
 *
 * Así "Alimentación", "ALIMENTACIÓN", "alimentacion " se consideran iguales.
 * (Se reemplazan las vocales a mano porque String.normalize no está
 * disponible de la misma forma en todos los motores de JavaScript móviles).
 */
export function normalizarTexto(texto = '') {
  return String(texto)
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u');
}

/**
 * Da formato al nombre de una categoría antes de guardarla:
 * "  comida   RÁPIDA " → "Comida rápida"
 */
export function formatearNombreCategoria(nombre = '') {
  const limpio = String(nombre).trim().replace(/\s+/g, ' ').toLowerCase();
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

/**
 * Busca si ya existe una categoría con el mismo nombre
 * (sin importar mayúsculas, minúsculas, tildes ni espacios).
 * Devuelve la categoría encontrada o undefined.
 */
export function buscarCategoriaRepetida(nombre, categorias = []) {
  const buscado = normalizarTexto(nombre);
  return categorias.find(
    (categoria) => normalizarTexto(categoria.nombre) === buscado
  );
}

/**
 * Valida el nombre de una categoría nueva.
 */
export function validarCategoria(nombre, categorias = []) {
  const errores = {};
  const limpio = String(nombre ?? '').trim();

  if (limpio === '') {
    errores.nombre = 'Escribe el nombre de la categoría.';
  } else if (limpio.length < LARGO_MINIMO_CATEGORIA) {
    errores.nombre = `La categoría debe tener al menos ${LARGO_MINIMO_CATEGORIA} letras.`;
  } else if (limpio.length > LARGO_MAXIMO_CATEGORIA) {
    errores.nombre = `La categoría no puede superar ${LARGO_MAXIMO_CATEGORIA} caracteres.`;
  } else {
    const repetida = buscarCategoriaRepetida(limpio, categorias);
    if (repetida) {
      errores.nombre = `La categoría "${repetida.nombre}" ya existe. Selecciónala en la lista.`;
    }
  }

  return errores;
}

/**
 * Convierte el valor escrito por el usuario a número.
 * Acepta el punto como separador de miles: "15.000" → 15000
 * Si el texto no es un número válido devuelve NaN.
 */
export function convertirValor(texto) {
  const limpio = String(texto ?? '')
    .trim()
    .replace(/\$/g, '')
    .replace(/\s/g, '');

  const sinMiles = /^-?\d{1,3}(\.\d{3})+$/.test(limpio)
    ? limpio.replace(/\./g, '')
    : limpio;

  if (sinMiles === '') {
    return NaN;
  }

  return Number(sinMiles.replace(',', '.'));
}

/**
 * Valida los datos de un gasto antes de registrarlo.
 * Recibe: { descripcion, valor, categoriaId }
 */
export function validarGasto({ descripcion, valor, categoriaId }) {
  const errores = {};

  // Validar descripción
  const descripcionLimpia = String(descripcion ?? '').trim();
  if (descripcionLimpia === '') {
    errores.descripcion = 'La descripción es obligatoria.';
  } else if (descripcionLimpia.length > LARGO_MAXIMO_DESCRIPCION) {
    errores.descripcion = `La descripción no puede superar ${LARGO_MAXIMO_DESCRIPCION} caracteres.`;
  }

  // Validar categoría
  if (!categoriaId) {
    errores.categoria = 'Selecciona una categoría.';
  }

  // Validar valor
  const numero = convertirValor(valor);
  if (String(valor ?? '').trim() === '') {
    errores.valor = 'El valor es obligatorio.';
  } else if (!Number.isFinite(numero)) {
    errores.valor = 'El valor debe ser numérico.';
  } else if (numero <= 0) {
    errores.valor = 'El valor debe ser mayor que cero.';
  }

  return errores;
}

/**
 * Indica si un objeto de errores tiene al menos un error.
 */
export function tieneErrores(errores) {
  return Object.keys(errores).length > 0;
}
