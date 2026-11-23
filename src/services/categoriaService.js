import { peticion } from './api';

// GET /categorias → lista de categorías disponibles
export function obtenerCategorias() {
  return peticion('/categorias');
}

// POST /categorias → crea una categoría y devuelve la categoría creada (con su id)
export function crearCategoria(nombre) {
  return peticion('/categorias', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  });
}
