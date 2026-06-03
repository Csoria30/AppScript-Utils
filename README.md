# UtilsAppScript

Biblioteca de utilidades para Google Apps Script orientada a Google Sheets.

Permite simplificar tareas frecuentes como:

- 📄 Manipulación de hojas y rangos
- 🎨 Formato de celdas
- 📅 Manejo de fechas y horarios
- 🖱️ Menús personalizados
- ⚡ Automatizaciones con `onEdit`

---

## Características

### Utilidades básicas

- Obtener hojas y rangos
- Lectura y escritura de celdas
- Navegación simplificada sobre Sheets

### Rangos

- Conversión de columnas (`A` → `1`, `BL` → `64`)
- Limpieza masiva de datos
- Helpers para trabajar con bloques de información

### Automatizaciones

- Timestamp automático
- Hipervínculos automáticos
- Registro de usuario editor
- Prevención de duplicados

### Funciones DATA reutilizables

- Limpieza configurable de bloques de datos
- Cálculo de antigüedad en formato legible y en minutos
- Parseo de duraciones tipo Xd Yh Zm

### Formato

- Centrado de contenido
- Formatos reutilizables
- Aplicación automática de estilos

### Menús personalizados

- Creación dinámica de menús
- Separadores automáticos
- Configuración mediante arrays

### Fechas

- Fechas formateadas
- Soporte para zonas horarias
- Helpers para Argentina

---

## Instalación

### Requisitos

- Node.js
- clasp

```bash
npm install -g @google/clasp
```

### Login

```bash
clasp login
```

### Publicar cambios

```bash
clasp push
```

### Crear versión

```bash
clasp version "feat: nueva funcionalidad"
```

### Publicar biblioteca

Apps Script → Deploy → Manage Deployments → New Deployment → Library

---

## Estructura

```text
Fechas/
  Fechas.js
Sheets/
  Rangos.js
  SheetFormat.js
UI/
  Menu.js
Utilidades/
  Basicas.js
```

## Documentación

| Módulo                                    | Descripción                       |
| ----------------------------------------- | --------------------------------- |
| [Funciones Base](docs/basicas.md)         | Operaciones básicas sobre Sheets  |
| [Rangos](docs/rangos.md)                  | Utilidades para rangos y columnas |
| [Automatizaciones](docs/automatizaciones) | Helpers para eventos              |
| [Menús](docs/menus.md)                    | Creación de menús personalizados  |
| [Formato](docs/formatos.md)               | Aplicación de estilos             |
| [Fechas](docs/fechas.md)                  | Utilidades de fecha y hora        |

---

## Ejemplo rápido

```javascript
function ejemplo() {
  var hoja = FuncionesBase.obtenerHoja("DATA");

  var valor = FuncionesBase.obtenerValorCelda("DATA", 2, 1);

  Logger.log(valor);

  MenuUtils.crearMenu("Herramientas", [
    ["Importar", "importarDatos"],
    ["-"],
    ["Configuración", "abrirConfig"],
  ]);
}

function ejemploData() {
  // Limpia DATA desde A4 hasta BL.
  SheetUtils.limpiarRangoDatos(
    "DATA",
    4,
    SheetUtils.columnaIndice("A"),
    SheetUtils.columnaIndice("BL"),
  );

  // También se puede reutilizar en otra hoja o rango.
  SheetUtils.limpiarRangoDatos(
    "BACKLOG",
    2,
    SheetUtils.columnaIndice("A"),
    SheetUtils.columnaIndice("Z"),
  );

  // Convierte "3d 5h 32m" a minutos.
  var total = parsearDuracion("3d 5h 32m");
  Logger.log(total); // 5012

  // Calcula antigüedad desde col AJ y escribe en BK/BL.
  calcularDiasBK();
}
```

## API adicional en Sheets/Rangos.js

SheetUtils.limpiarRangoDatos(nombreHoja, filaInicial, columnaInicial, cantidadColumnas, filaFinal)

- Reemplaza el uso de limpiarDATA para evitar lógica duplicada.
- Ejemplo DATA A4:BL ultima fila:

```javascript
SheetUtils.limpiarRangoDatos(
  "DATA",
  4,
  SheetUtils.columnaIndice("A"),
  SheetUtils.columnaIndice("BL"),
);
```

parsearDuracion(texto)

- Entrada esperada: "Xd Yh Zm" (ejemplo: "0d 19h 11m").
- Devuelve minutos totales o null si el formato no coincide.

calcularDiasBK(nombreHoja, colFecha, colTextoBK, colMinutosBL, filaInicio)

- Por defecto: DATA, fecha en AJ(36), salida texto en BK(63) y minutos en BL(64), desde fila 4.
- Calcula diferencia contra fecha/hora actual y completa columnas de salida.

formatearComoTexto(e, columnas)

- Reemplaza el uso de aplicarFormatoColumna para evitar alias duplicado.

```javascript
function onEdit(e) {
  formatearComoTexto(e, ["G", "H"]);
}
```

## Licencia

MIT
