## SheetUtils.limpiarRangoDatos()

Limpia el contenido de un rango de datos en una hoja.

### Parámetros

| Parámetro        | Tipo   | Requerido | Descripción                    |
| ---------------- | ------ | --------- | ------------------------------ |
| nombreHoja       | string | Sí        | Nombre de la hoja              |
| filaInicial      | number | Sí        | Fila inicial                   |
| columnaInicial   | number | Sí        | Columna inicial                |
| cantidadColumnas | number | No        | Cantidad de columnas a limpiar |
| filaFinal        | number | No        | Última fila a limpiar          |

### Ejemplos

#### Limpiar desde A4 hasta la última fila y columna con datos

```javascript
SheetUtils.limpiarRangoDatos("DATA", 4, 1);
```

#### Limpiar desde A4 hasta BL y la última fila con datos

```javascript
SheetUtils.limpiarRangoDatos("DATA", 4, 1, SheetUtils.columnaIndice("BL"));
```

#### Limpiar desde A4 hasta BL100

```javascript
SheetUtils.limpiarRangoDatos("DATA", 4, 1, SheetUtils.columnaIndice("BL"), 100);
```

## MenuUtils.crearMenu()

Crea un menú personalizado en la interfaz de Google Sheets.

### Parámetros

| Parámetro | Tipo                 | Requerido | Descripción                                     |
| --------- | -------------------- | --------- | ----------------------------------------------- |
| nombre    | string               | Sí        | Nombre que tendrá el menú                       |
| opciones  | Array<Array<string>> | Sí        | Lista de opciones en formato `[texto, funcion]` |

### Ejemplo

```javascript
function onOpen() {
  MenuUtils.crearMenu("Selector", [
    ["Abrir selector de hojas", "abrirSelectorHojas"],
    ["Activar OpenAutomatico", "activarOpenAutomatico"],
  ]);
}
```

### Resultado

Menú:

Selector
├── Abrir selector de hojas
└── Activar OpenAutomatico


## SheetFormat.centrarRango()

Centra horizontal y verticalmente el contenido de un rango.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| rango | Range | Sí | Rango al que se aplicará el formato |

### Ejemplo

```javascript
const hoja = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName("DATA");

const rango = hoja.getRange("A2:D10");

SheetFormat.centrarRango(rango);
```

### Equivalente a

```javascript
rango
  .setHorizontalAlignment("center")
  .setVerticalAlignment("middle");
```


## DateUtils.fechaArgentina()

Obtiene la fecha actual utilizando la zona horaria de Argentina y el formato `dd/MM/yyyy`.

### Retorno

| Tipo | Descripción |
|--------|-------------|
| string | Fecha formateada (ej: 02/06/2026) |

### Ejemplo

```javascript
const fecha = DateUtils.fechaArgentina();

Logger.log(fecha);
```

### Resultado

```text
02/06/2026
```
