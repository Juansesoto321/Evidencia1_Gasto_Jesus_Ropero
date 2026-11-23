import { peticion } from './api';

// GET /gastos → lista de gastos, del más reciente al más antiguo
export function obtenerGastos() {
  return peticion('/gastos?_sort=id&_order=desc');
}

// POST /gastos → crea un gasto y devuelve el gasto creado (con su id)
export function crearGasto(gasto) {
  return peticion('/gastos', {
    method: 'POST',
    body: JSON.stringify(gasto),
  });
}

// DELETE /gastos/:id → elimina un gasto
export function eliminarGasto(id) {
  return peticion(`/gastos/${id}`, { method: 'DELETE' });
}
