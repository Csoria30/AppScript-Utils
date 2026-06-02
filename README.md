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
Utilidades/
  Basicas.js
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

## Funciones Base (en espanol)

Estas funciones estan pensadas para personas que recien empiezan con Apps Script.
El objetivo es evitar repetir codigo para abrir hoja, celda y rangos.

Archivo: Utilidades/Basicas.js

### FuncionesBase.obtenerLibroActivo()

Devuelve el spreadsheet activo.

### FuncionesBase.obtenerHoja(nombreHoja)

Devuelve una hoja por nombre y lanza error si no existe.

### FuncionesBase.obtenerRangoA1(nombreHoja, notacionA1)

Devuelve un rango usando notacion A1 (por ejemplo: A2:D20).

### FuncionesBase.obtenerRango(nombreHoja, fila, columna, cantidadFilas, cantidadColumnas)

Devuelve un rango por coordenadas numericas.

### FuncionesBase.obtenerCelda(nombreHoja, fila, columna)

Atajo para obtener una sola celda.

### FuncionesBase.obtenerValorCelda(nombreHoja, fila, columna)

Lee el valor de una celda.

### FuncionesBase.escribirValorCelda(nombreHoja, fila, columna, valor)

Escribe un valor en una celda.

### FuncionesBase.obtenerUltimaFila(nombreHoja)

Devuelve la ultima fila con datos.

### FuncionesBase.obtenerUltimaColumna(nombreHoja)

Devuelve la ultima columna con datos.

Ejemplo rapido:

```javascript
function ejemploBasico() {
  var hoja = FuncionesBase.obtenerHoja("DATA");
  var celdaA2 = FuncionesBase.obtenerCelda("DATA", 2, 1);
  var valor = FuncionesBase.obtenerValorCelda("DATA", 2, 1);

  Logger.log("Hoja: " + hoja.getName());
  Logger.log("A2: " + valor);

  FuncionesBase.escribirValorCelda("DATA", 2, 2, "Procesado");

  var rango = FuncionesBase.obtenerRangoA1("DATA", "A2:B10");
  rango.setBorder(true, true, true, true, true, true);
}
```

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

### Automatizaciones onEdit en Sheets/Rangos.js

Funciones disponibles para usar dentro de onEdit(e):

- setTimestampOnEdit(e, sheetName, watchCol, stampCol, startRow, clearStampOnEmpty)
- setHyperlinkInSameCellOnEdit(e, sheetName, watchCol, startRow, urlBase, clearOnEmpty)
- setUserEmailOnEdit(e, sheetName, watchCol, emailCol, startRow, clearOnEmpty)
- bloquearDuplicadosEnColumnaOnEdit(e, sheetName, watchCol, startRow, ignoreCase, trimValues)
- formatearComoTexto(e, columnas)
- aplicarFormatoColumna(e, columnas)

Ejemplo de onEdit combinado:

```javascript
function onEdit(e) {
  setTimestampOnEdit(e, "DATA", "A", "B", 2, true);
  setHyperlinkInSameCellOnEdit(
    e,
    "DATA",
    "C",
    2,
    "https://mi-sitio.com/item/",
    true,
  );
  setUserEmailOnEdit(e, "DATA", "D", "E", 2, true);
  bloquearDuplicadosEnColumnaOnEdit(e, "DATA", "F", 2, true, true);
  aplicarFormatoColumna(e, ["G", "H"]);
}
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
