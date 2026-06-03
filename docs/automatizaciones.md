# Automatizaciones onEdit

Conjunto de utilidades para simplificar automatizaciones basadas en el evento `onEdit(e)` de Google Sheets.

Estas funciones permiten implementar comportamientos comunes sin repetir lógica en cada proyecto.

---

## Requisitos

Todas las funciones deben ejecutarse dentro de un trigger `onEdit(e)`.

```javascript
function onEdit(e) {
  // Utilizar helpers aquí
}
```

---

## Funciones disponibles

| Función | Descripción |
|----------|-------------|
| `setTimestampOnEdit()` | Registra fecha y hora cuando se modifica una celda. |
| `setHyperlinkInSameCellOnEdit()` | Convierte automáticamente el valor ingresado en un enlace. |
| `setUserEmailOnEdit()` | Guarda el correo del usuario que realizó la edición. |
| `bloquearDuplicadosEnColumnaOnEdit()` | Evita valores duplicados en una columna. |
| `formatearComoTexto()` | Fuerza columnas a formato texto. |
| `aplicarFormatoColumna()` | Aplica formatos personalizados a columnas específicas. |

---

# setTimestampOnEdit

Registra automáticamente la fecha y hora cuando se edita una celda determinada.

## Sintaxis

```javascript
setTimestampOnEdit(
  e,
  sheetName,
  watchCol,
  stampCol,
  startRow,
  clearStampOnEmpty
);
```

## Parámetros

| Parámetro | Tipo | Descripción |
|------------|--------|-------------|
| `e` | Object | Evento onEdit. |
| `sheetName` | string | Nombre de la hoja a monitorear. |
| `watchCol` | string | Columna observada. |
| `stampCol` | string | Columna donde se escribirá la fecha. |
| `startRow` | number | Fila mínima a procesar. |
| `clearStampOnEmpty` | boolean | Borra la fecha si se elimina el valor original. |

## Ejemplo

```javascript
function onEdit(e) {
  setTimestampOnEdit(
    e,
    "DATA",
    "A",
    "B",
    2,
    true
  );
}
```

### Resultado

| A | B |
|---|---|
| Pedido | Fecha |
| 1001 | 03/06/2026 10:15 |

---

# setHyperlinkInSameCellOnEdit

Convierte automáticamente el valor ingresado en un hipervínculo.

## Ejemplo

```javascript
function onEdit(e) {
  setHyperlinkInSameCellOnEdit(
    e,
    "DATA",
    "A",
    2,
    "https://mi-sitio.com/item/",
    true
  );
}
```

### Resultado

Si el usuario escribe:

```text
123
```

La celda quedará como:

```text
123 → https://mi-sitio.com/item/123
```

---

# setUserEmailOnEdit

Registra el correo electrónico del usuario que realizó la modificación.

## Ejemplo

```javascript
function onEdit(e) {
  setUserEmailOnEdit(
    e,
    "DATA",
    "C",
    "D",
    2,
    true
  );
}
```

### Resultado

| C | D |
|---|---|
| Aprobado | usuario@empresa.com |

---

# bloquearDuplicadosEnColumnaOnEdit

Impide que se ingresen valores repetidos dentro de una columna.

## Ejemplo

```javascript
function onEdit(e) {
  bloquearDuplicadosEnColumnaOnEdit(
    e,
    "DATA",
    "A",
    2,
    true,
    true
  );
}
```

### Comportamiento

Si ya existe:

```text
ABC123
```

y un usuario intenta ingresar nuevamente:

```text
ABC123
```

la función revertirá la edición y mostrará el mensaje configurado.

---

# formatearComoTexto

Aplica formato de texto a columnas específicas.

## Ejemplo

```javascript
function onEdit(e) {
  formatearComoTexto(
    e,
    ["A", "B", "C"]
  );
}
```

### Uso recomendado

- DNI
- CUIT
- Códigos internos
- Números con ceros iniciales

---

# aplicarFormatoColumna

Aplica automáticamente formatos configurados a determinadas columnas.

## Ejemplo

```javascript
function onEdit(e) {
  aplicarFormatoColumna(
    e,
    ["G", "H"]
  );
}
```

---

# Ejemplo completo

```javascript
function onEdit(e) {
  setTimestampOnEdit(
    e,
    "DATA",
    "A",
    "B",
    2,
    true
  );

  setHyperlinkInSameCellOnEdit(
    e,
    "DATA",
    "C",
    2,
    "https://mi-sitio.com/item/",
    true
  );

  setUserEmailOnEdit(
    e,
    "DATA",
    "D",
    "E",
    2,
    true
  );

  bloquearDuplicadosEnColumnaOnEdit(
    e,
    "DATA",
    "F",
    2,
    true,
    true
  );

  aplicarFormatoColumna(
    e,
    ["G", "H"]
  );
}
```

---

## Buenas prácticas

✅ Centralizar todas las automatizaciones dentro de un único `onEdit(e)`.

✅ Limitar el procesamiento utilizando `sheetName`.

✅ Utilizar `startRow` para evitar afectar encabezados.

✅ Combinar varias automatizaciones en un único trigger.

❌ Evitar crear múltiples funciones `onEdit(e)` en el mismo proyecto.
