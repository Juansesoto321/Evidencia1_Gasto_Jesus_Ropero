# MiGasto Móvil

Aplicación móvil para registrar gastos personales, hecha con **React Native + Expo**
(Tecnólogo ADSO – SENA, trimestre VI).

Versión 2 del taller *MiGasto*:

- Código modular (componentes, servicios y utilidades separados).
- Encabezado con logo propio.
- Gastos y categorías consultados desde una **API REST** (json-server).
- Cada gasto muestra **categoría, descripción, valor** y fecha.
- **Select** de categorías cargado dinámicamente.
- Validación de **categorías repetidas**, sin distinguir mayúsculas, minúsculas ni tildes.
- **Pantalla de carga** de 3 segundos con logo y animación.
- Filtro por categoría y eliminación de gastos.

## Documentación

Todo está en la carpeta [docs/](docs/README.md):

- [Guía para entender el código](docs/GUIA_DEL_CODIGO.md): capas, diagramas de secuencia y
  de estados, conceptos de React con ejemplos y preguntas del profesor con respuesta.
- [Sustentación](docs/SUSTENTACION.md): los entregables de la guía (árbol de componentes,
  props, flujos, datos, API y depuración). También en [Word](docs/Sustentacion_MiGasto_Movil.docx).
- [Guías del profesor](docs/guias-del-profesor/): los documentos originales de la actividad.

---

## Requisitos

- Node.js LTS
- Celular Android con **Expo Go** actualizado (Google Play), conectado a la **misma red Wi-Fi** que el PC.

## Cómo ejecutar

1. Instalar dependencias (solo la primera vez):

   ```bash
   npm install
   ```

2. **Terminal 1** – encender la API simulada (json-server en el puerto 3000):

   ```bash
   npm run api
   ```

   Si Windows pregunta por el firewall, permitir el acceso a Node.js en redes privadas
   (sin esto el celular no puede conectarse a la API).

3. **Terminal 2** – encender la app:

   ```bash
   npx expo start
   ```

   - Presionar **w** para abrirla en el navegador (prueba en Windows).
   - Escanear el código QR con **Expo Go** para abrirla en el celular.

La app detecta sola la IP del PC (la toma de Expo), así que no hay que escribirla en el código.
No funciona en modo `--tunnel`, porque en ese modo el celular no ve la red local del PC.

## Estructura del proyecto

```
MiGastoMovil/
├── App.js                      # Componente principal: estado y coordinación
├── data/
│   └── db.json                 # Datos simulados (mock) que sirve json-server
├── docs/
│   └── SUSTENTACION.md         # Documentación para la sustentación
└── src/
    ├── components/
    │   ├── PantallaCarga.js    # Splash de 3 s con logo y animación
    │   ├── Encabezado.js       # Header con logo, nombre y mes actual
    │   ├── Logo.js             # Logo reutilizable
    │   ├── ResumenGastos.js    # Total gastado y cantidad de gastos
    │   ├── FormularioGasto.js  # Registrar gasto (descripción, categoría, valor)
    │   ├── SelectCategoria.js  # Select reutilizable de categorías
    │   ├── FormularioCategoria.js # Crear categoría (valida repetidas)
    │   ├── ListaGastos.js      # Listado + filtro por categoría
    │   ├── TarjetaGasto.js     # Información de un gasto + eliminar
    │   ├── Mensaje.js          # Mensajes de éxito / error / información
    │   └── AvisoFlotante.js    # Mensaje flotante temporal (toast)
    ├── services/
    │   ├── api.js              # URL de la API y función base fetch
    │   ├── gastoService.js     # GET / POST / DELETE de gastos
    │   └── categoriaService.js # GET / POST de categorías
    ├── theme/
    │   └── colores.js          # Paleta de colores
    └── utils/
        ├── validaciones.js     # Reglas de negocio y validaciones
        └── formato.js          # Moneda, fechas
```

## Problemas comunes

| Síntoma | Solución |
|---|---|
| Expo Go muestra *"You're signed in to Expo Go as X, but not signed in to Expo CLI"* | En el PC: `npx expo login` con la **misma cuenta** de Expo Go y volver a ejecutar `npx expo start`. O cerrar sesión en Expo Go. |
| `npm run api` muestra `EADDRINUSE ... port: 3000` | Ya hay otra API encendida en el puerto 3000. Usar esa, o cerrarla con Ctrl+C antes de encenderla de nuevo. |
| Expo pregunta *"Port 8081 is being used… Use port 8082?"* | Hay otro Metro encendido. Responder **yes** sirve, pero conviene cerrar el otro. |
| La app abre pero dice *"No hay conexión con la API"* | Revisar que `npm run api` esté encendida, que el celular esté en la misma Wi-Fi, y en iPhone permitir a Expo Go el acceso a la **Red local** (Configuración → Expo Go → Red local). |

## Volver a los datos iniciales

json-server **escribe en `data/db.json`** cada vez que se registra o elimina algo.
Para volver a los datos originales antes de una presentación (funciona después de
haber hecho *commit* del proyecto en Git):

```bash
git checkout data/db.json
```
