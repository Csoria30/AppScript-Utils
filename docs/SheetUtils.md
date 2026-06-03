# SheetUtils

Utilidades para trabajar con rangos, columnas y limpieza de datos en Google Sheets.

---

## Resumen de funciones

| Función | Retorno | Descripción |
|----------|----------|-------------|
| `columnaIndice(columna)` | `number` | Convierte una letra de columna a su índice numérico. |
| `limpiarRangoDatos(nombreHoja, filaInicial, columnaInicial, cantidadColumnas, filaFinal)` | `Object` | Limpia un bloque de datos y devuelve un resumen de la operación. |

---

# columnaIndice

Convierte letras de columna de Google Sheets a índices numéricos.

### Sintaxis

```javascript
SheetUtils.columnaIndice(columna);
```

### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `columna` | `string` | Letra o combinación de letras de columna. |

### Retorno

```javascript
number
```

---

## Ejemplos

```javascript
SheetUtils.columnaIndice("A");
// 1
```

```javascript
SheetUtils.columnaIndice("Z");
// 26
```

```javascript
SheetUtils.columnaIndice("AA");
// 27
```

```javascript
SheetUtils.columnaIndice("BL");
// 64
```

---

## Tabla de referencia

| Columna | Índice |
|----------|----------|
| A | 1 |
| B | 2 |
| Z | 26 |
| AA | 27 |
| AB | 28 |
| AZ | 52 |
| BA | 53 |
| BL | 64 |

---

## Casos de uso

### Rangos dinámicos

```javascript
const ultimaColumna =
  SheetUtils.columnaIndice("BL");

const rango =
  hoja.getRange(
    1,
    1,
    100,
    ultimaColumna
  );
```

---

# limpiarRangoDatos

Limpia el contenido de un bloque de datos de manera dinámica.

Permite borrar registros desde una fila determinada hasta la última fila con datos o hasta un límite definido.

---

## Sintaxis

```javascript
SheetUtils.limpiarRangoDatos(
  nombreHoja,
  filaInicial,
  columnaInicial,
  cantidadColumnas,
  filaFinal
);
```

---

## Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `nombreHoja` | `string` | Sí | Hoja donde se realizará la limpieza. |
| `filaInicial` | `number` | Sí | Primera fila a limpiar. |
| `columnaInicial` | `number` | Sí | Primera columna a limpiar. |
| `cantidadColumnas` | `number` | No | Cantidad de columnas a limpiar. |
| `filaFinal` | `number` | No | Última fila a limpiar. |

---

## Retorno

```javascript
{
  filasLimpiadas: number,
  columnasLimpiadas: number
}
```

### Ejemplo de retorno

```javascript
{
  filasLimpiadas: 150,
  columnasLimpiadas: 64
}
```

---

## Ejemplos

### Limpiar desde A4 hasta la última fila y columna con datos

```javascript
SheetUtils.limpiarRangoDatos(
  "DATA",
  4,
  1
);
```

---

### Limpiar desde A4 hasta BL y última fila con datos

```javascript
SheetUtils.limpiarRangoDatos(
  "DATA",
  4,
  1,
  SheetUtils.columnaIndice("BL")
);
```

---

### Limpiar desde A4 hasta BL100

```javascript
SheetUtils.limpiarRangoDatos(
  "DATA",
  4,
  1,
  SheetUtils.columnaIndice("BL"),
  100
);
```

---

## Caso típico: recargar información

```javascript
function importarDatos() {

  SheetUtils.limpiarRangoDatos(
    "DATA",
    2,
    1
  );

  // Cargar nuevos registros...
}
```

---

## Caso típico: limpieza parcial

```javascript
SheetUtils.limpiarRangoDatos(
  "VENTAS",
  5,
  1,
  SheetUtils.columnaIndice("H")
);
```

---

## Buenas prácticas

✅ Utilizar `columnaIndice()` en lugar de números mágicos.

```javascript
SheetUtils.columnaIndice("BL")
```

en lugar de:

```javascript
64
```

---

✅ Limpiar bloques completos en una sola operación.

---

✅ Utilizar esta función antes de importar datos masivos.

---

❌ Evitar limpiar celda por celda dentro de bucles.

```javascript
// No recomendado
for (let fila = 4; fila <= 1000; fila++) {
  hoja.getRange(fila, 1).clearContent();
}
```

```javascript
// Recomendado
SheetUtils.limpiarRangoDatos(
  "DATA",
  4,
  1
);
```
