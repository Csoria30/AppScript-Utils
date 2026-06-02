# UtilsAppScript

Biblioteca de utilidades para Google Apps Script orientada a Google Sheets.

Incluye helpers para:

- manejo de rangos,
- formato de celdas,
- fecha/hora,
- menues personalizados.

## Estructura

```text
Fechas/
  Fechas.js
Sheets/
  Rangos.js
  SheetFormat.js
UI/
  Menu.js
```

## Instalacion y publicacion

### Requisitos

- Node.js
- clasp (`npm install -g @google/clasp`)
- proyecto Apps Script con acceso al editor

### Flujo recomendado

1. Iniciar sesion:

   ```bash
   clasp login
   ```

2. Subir cambios al proyecto vinculado:

   ```bash
   clasp push
   ```

3. Crear version para compartir como biblioteca:

   ```bash
   clasp version "feat: actualizacion de utilidades"
   ```

4. En Apps Script: Deploy > Manage deployments > New deployment > Library.

Con el Script ID y numero de version, otros proyectos pueden agregar tu biblioteca.

## API

## SheetUtils

### SheetUtils.columnaIndice(columna)

Convierte letras de columna a indice numerico.

- Entrada: string (ej: `A`, `Z`, `AA`, `BL`)
- Salida: number (ej: `1`, `26`, `27`, `64`)

Ejemplo:

```javascript
const colBL = SheetUtils.columnaIndice("BL");
// 64
```

### SheetUtils.limpiarRangoDatos(nombreHoja, filaInicial, columnaInicial, cantidadColumnas, filaFinal)

Limpia contenido en un bloque de datos y devuelve resumen.

Parametros:

- nombreHoja (string, requerido)
- filaInicial (number, requerido)
- columnaInicial (number, requerido)
- cantidadColumnas (number, opcional)
- filaFinal (number, opcional)

Retorno:

```javascript
{
  filasLimpiadas: number,
  columnasLimpiadas: number
}
```

Ejemplos:

```javascript
// Desde A4 hasta ultima fila/columna con datos
SheetUtils.limpiarRangoDatos("DATA", 4, 1);

// Desde A4 hasta BL y ultima fila con datos
SheetUtils.limpiarRangoDatos("DATA", 4, 1, SheetUtils.columnaIndice("BL"));

// Desde A4 hasta BL100
SheetUtils.limpiarRangoDatos("DATA", 4, 1, SheetUtils.columnaIndice("BL"), 100);
```

## MenuUtils

### MenuUtils.crearMenu(nombre, opciones)

Crea un menu personalizado en Google Sheets.

`opciones` recibe una lista de arrays:

- `["Texto", "nombreFuncion"]` para item de menu
- `["-"]` o `["separator"]` para separador

Ejemplo:

```javascript
function onOpen() {
  MenuUtils.crearMenu("Selector", [
    ["Abrir selector de hojas", "abrirSelectorHojas"],
    ["-"],
    ["Activar OpenAutomatico", "activarOpenAutomatico"],
  ]);
}
```

## SheetFormat

### SheetFormat.centrarRango(rango)

Centra horizontal y verticalmente el contenido de un rango.

Ejemplo:

```javascript
const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
const rango = hoja.getRange("A2:D10");

SheetFormat.centrarRango(rango);
```

## DateUtils

### DateUtils.fechaActual(formato, zonaHoraria)

Devuelve fecha actual con formato y zona horaria configurables.

Ejemplo:

```javascript
const iso = DateUtils.fechaActual("yyyy-MM-dd", "UTC");
```

### DateUtils.fechaArgentina()

Atajo para fecha actual en `dd/MM/yyyy` con zona `America/Argentina/Buenos_Aires`.

```javascript
const fecha = DateUtils.fechaArgentina();
Logger.log(fecha); // 02/06/2026
```
