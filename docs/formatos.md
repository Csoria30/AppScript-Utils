# SheetFormat

Utilidades para aplicar formatos visuales a rangos de Google Sheets.

---

## Resumen de funciones

| Función | Retorno | Descripción |
|----------|----------|-------------|
| `centrarRango(rango)` | `Range` | Centra horizontal y verticalmente el contenido de un rango. |

---

## centrarRango

Centra horizontal y verticalmente todas las celdas de un rango.

### Sintaxis

```javascript
SheetFormat.centrarRango(rango);
```

### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `rango` | `Range` | Rango al que se aplicará el formato. |

### Retorno

```javascript
Range
```

Devuelve el mismo rango formateado para permitir encadenamiento de operaciones.

---

## Ejemplo básico

```javascript
const hoja = SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("DATA");

const rango = hoja.getRange("A2:D10");

SheetFormat.centrarRango(rango);
```

### Resultado

Antes:

| Nombre | Estado |
|----------|----------|
| Juan | Activo |
| María | Pendiente |

Alineación:

```text
Horizontal: Izquierda
Vertical: Superior
```

Después:

```text
Horizontal: Centro
Vertical: Centro
```

---

## Ejemplo con FuncionesBase

```javascript
const rango =
  FuncionesBase.obtenerRangoA1(
    "DATA",
    "A2:D10"
  );

SheetFormat.centrarRango(rango);
```

---

## Casos de uso

### Encabezados

```javascript
const encabezado =
  hoja.getRange("A1:F1");

SheetFormat.centrarRango(encabezado);
```

### Tablas de datos

```javascript
const tabla =
  hoja.getRange("A2:H100");

SheetFormat.centrarRango(tabla);
```

### Reportes

```javascript
const reporte =
  hoja.getRange("A1:J50");

SheetFormat.centrarRango(reporte);
```

---

## Buenas prácticas

✅ Utilizar para encabezados y tablas de consulta.

✅ Combinar con bordes, colores y formatos personalizados.

✅ Aplicar sobre rangos completos en lugar de celda por celda para mejorar el rendimiento.

❌ Evitar aplicar formato repetidamente dentro de bucles.

```javascript
// No recomendado
for (let i = 1; i <= 100; i++) {
  SheetFormat.centrarRango(
    hoja.getRange(i, 1)
  );
}
```

```javascript
// Recomendado
SheetFormat.centrarRango(
  hoja.getRange("A1:A100")
);
```
