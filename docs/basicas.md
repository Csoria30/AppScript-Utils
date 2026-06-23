# 📖 FuncionesBase

Funciones de acceso rápido para trabajar con Google Sheets.

Este módulo encapsula las operaciones más comunes sobre libros, hojas, rangos y celdas, evitando repetir código en cada proyecto.

---

## 📚 Resumen de funciones

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

<!-- Comment: obtenerRango -->

# 📐 obtenerRango

Obtiene un rango utilizando coordenadas numéricas.

## ⚙️ Sintaxis

```javascript
FuncionesBase.obtenerRango(
  nombreHoja,
  fila,
  columna,
  cantidadFilas,
  cantidadColumnas
);
```

## 📝 Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `nombreHoja` | string | Nombre de la hoja. |
| `fila` | number | Fila inicial. |
| `columna` | number | Columna inicial. |
| `cantidadFilas` | number | Cantidad de filas a obtener. Opcional. |
| `cantidadColumnas` | number | Cantidad de columnas a obtener. Opcional. |

## 🔧 Valores por defecto

```javascript
cantidadFilas = 1
cantidadColumnas = 1
```

## ↩️ Retorno

```javascript
Range
```

## 💡 Ejemplo

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

## ⚠️ Excepciones

La función lanzará un error cuando:

- `fila < 1`
- `columna < 1`
- `cantidadFilas < 1`
- `cantidadColumnas < 1`
- La hoja no exista

---
