# FuncionesBase

Funciones de acceso rápido para trabajar con Google Sheets.

Este módulo encapsula las operaciones más comunes sobre libros, hojas, rangos y celdas, evitando repetir código en cada proyecto.

## Resumen de funciones

| Función | Retorno | Descripción |
|----------|----------|-------------|
| `obtenerLibroActivo()` | `Spreadsheet` | Devuelve el libro activo. |
| `obtenerHoja(nombreHoja)` | `Sheet` | Obtiene una hoja por nombre. |
| `obtenerRangoA1(nombreHoja, notacionA1)` | `Range` | Obtiene un rango utilizando notación A1. |
| `obtenerRango(nombreHoja, fila, columna, cantidadFilas, cantidadColumnas)` | `Range` | Obtiene un rango mediante coordenadas numéricas. |
| `obtenerCelda(nombreHoja, fila, columna)` | `Range` | Obtiene una única celda. |
| `obtenerValorCelda(nombreHoja, fila, columna)` | `any` | Devuelve el valor de una celda. |
| `escribirValorCelda(nombreHoja, fila, columna, valor)` | `void` | Escribe un valor en una celda. |
| `obtenerUltimaFila(nombreHoja)` | `number` | Devuelve la última fila con datos. |
| `obtenerUltimaColumna(nombreHoja)` | `number` | Devuelve la última columna con datos. |
---

## obtenerLibroActivo

Devuelve el Spreadsheet activo.

### Sintaxis

```javascript
FuncionesBase.obtenerLibroActivo();
```

### Retorno

```javascript
Spreadsheet
```

### Ejemplo

```javascript
const libro = FuncionesBase.obtenerLibroActivo();

Logger.log(libro.getName());
```

---

## obtenerHoja

Obtiene una hoja por nombre.

Lanza una excepción si la hoja no existe.

### Sintaxis

```javascript
FuncionesBase.obtenerHoja(nombreHoja);
```

### Parámetros

| Parámetro  | Tipo   | Descripción        |
| ---------- | ------ | ------------------ |
| nombreHoja | string | Nombre de la hoja. |

### Retorno

```javascript
Sheet
```

### Ejemplo

```javascript
const hoja = FuncionesBase.obtenerHoja("DATA");
```

---

## obtenerRangoA1

Obtiene un rango utilizando notación A1.

### Sintaxis

```javascript
FuncionesBase.obtenerRangoA1(
  nombreHoja,
  notacionA1
);
```

### Ejemplo

```javascript
const rango =
  FuncionesBase.obtenerRangoA1(
    "DATA",
    "A2:D20"
  );
```

---

## obtenerRango

Obtiene un rango utilizando coordenadas numéricas.

### Sintaxis

```javascript
FuncionesBase.obtenerRango(
  nombreHoja,
  fila,
  columna,
  cantidadFilas,
  cantidadColumnas
);
```

### Ejemplo

```javascript
const rango =
  FuncionesBase.obtenerRango(
    "DATA",
    2,
    1,
    10,
    4
  );
```

Equivale a:

```javascript
hoja.getRange(2, 1, 10, 4);
```

---

## obtenerCelda

Atajo para obtener una única celda.

### Sintaxis

```javascript
FuncionesBase.obtenerCelda(
  nombreHoja,
  fila,
  columna
);
```

### Ejemplo

```javascript
const celda =
  FuncionesBase.obtenerCelda(
    "DATA",
    2,
    1
  );
```

---

## obtenerValorCelda

Obtiene el valor de una celda.

### Sintaxis

```javascript
FuncionesBase.obtenerValorCelda(
  nombreHoja,
  fila,
  columna
);
```

### Ejemplo

```javascript
const valor =
  FuncionesBase.obtenerValorCelda(
    "DATA",
    2,
    1
  );

Logger.log(valor);
```

---

## escribirValorCelda

Escribe un valor en una celda.

### Sintaxis

```javascript
FuncionesBase.escribirValorCelda(
  nombreHoja,
  fila,
  columna,
  valor
);
```

### Ejemplo

```javascript
FuncionesBase.escribirValorCelda(
  "DATA",
  2,
  2,
  "Procesado"
);
```

---

## obtenerUltimaFila

Devuelve la última fila con datos.

### Sintaxis

```javascript
FuncionesBase.obtenerUltimaFila(
  nombreHoja
);
```

### Ejemplo

```javascript
const ultimaFila =
  FuncionesBase.obtenerUltimaFila(
    "DATA"
  );
```

---

## obtenerUltimaColumna

Devuelve la última columna con datos.

### Sintaxis

```javascript
FuncionesBase.obtenerUltimaColumna(
  nombreHoja
);
```

### Ejemplo

```javascript
const ultimaColumna =
  FuncionesBase.obtenerUltimaColumna(
    "DATA"
  );
```

---

# Ejemplo completo

```javascript
function ejemploBasico() {
  var hoja =
    FuncionesBase.obtenerHoja("DATA");

  var celdaA2 =
    FuncionesBase.obtenerCelda(
      "DATA",
      2,
      1
    );

  var valor =
    FuncionesBase.obtenerValorCelda(
      "DATA",
      2,
      1
    );

  Logger.log(
    "Hoja: " + hoja.getName()
  );

  Logger.log(
    "A2: " + valor
  );

  FuncionesBase.escribirValorCelda(
    "DATA",
    2,
    2,
    "Procesado"
  );

  var rango =
    FuncionesBase.obtenerRangoA1(
      "DATA",
      "A2:B10"
    );

  rango.setBorder(
    true,
    true,
    true,
    true,
    true,
    true
  );
}
```

---

## Buenas prácticas

✅ Utilizar `obtenerHoja()` en lugar de repetir `getSheetByName()`.

✅ Utilizar `obtenerValorCelda()` para lecturas rápidas.

✅ Utilizar `obtenerRangoA1()` cuando el rango ya es conocido.

✅ Utilizar `obtenerRango()` cuando las coordenadas se calculan dinámicamente.

❌ Evitar acceder directamente a hojas que podrían no existir.

```javascript
// Menos seguro
SpreadsheetApp.getActive()
  .getSheetByName("DATA");

// Recomendado
FuncionesBase.obtenerHoja("DATA");
```
