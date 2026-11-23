// Funciones de formato reutilizadas por varios componentes.

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/**
 * 15000 → "$ 15.000"
 */
export function formatoMoneda(valor) {
  return Number(valor).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

/**
 * Fecha de hoy en formato "AAAA-MM-DD" usando la hora LOCAL del dispositivo.
 * Nota: new Date().toISOString() usa la hora UTC; en Colombia (UTC-5),
 * después de las 7:00 p. m. devolvería la fecha del día siguiente.
 */
export function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

/**
 * "2026-11-20" → "20 nov. 2026"
 * Se separa el texto a mano para evitar que la zona horaria cambie el día.
 */
export function formatoFecha(fecha) {
  if (!fecha) {
    return '';
  }
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return `${dia} ${MESES[mes - 1].slice(0, 3)}. ${anio}`;
}

/**
 * Nombre del mes actual: "Noviembre 2026"
 */
export function mesActual() {
  const hoy = new Date();
  const mes = MESES[hoy.getMonth()];
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${hoy.getFullYear()}`;
}
