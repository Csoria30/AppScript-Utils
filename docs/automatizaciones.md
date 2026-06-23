# 🚀Automatizaciones onEdit

Conjunto de utilidades para simplificar automatizaciones basadas en el evento `onEdit(e)` de Google Sheets.

Estas funciones permiten implementar comportamientos comunes sin repetir lógica en cada proyecto.

<br>

## 📋Requisitos

Todas las funciones deben ejecutarse dentro de un trigger `onEdit(e)`.

```javascript
function onEdit(e) {
  // Utilizar helpers aquí
}
```

<br>

## 📚Funciones disponibles

| Función                               | Descripción                                                |
| ------------------------------------- | ---------------------------------------------------------- |
| [`setTimestampOnEdit()`](#setTimestampOnEdit)                | Registra fecha y hora cuando se modifica una celda.        |
| [`setHyperlinkInSameCellOnEdit()`](#setHyperlinkInSameCellOnEdit)      | Convierte automáticamente el valor ingresado en un enlace. |
| [`setUserEmailOnEdit()`](#setUserEmailOnEdit)                | Guarda el correo del usuario que realizó la edición.       |
| [`bloquearDuplicadosEnColumnaOnEdit()`](#bloquearDuplicadosEnColumnaOnEdit) | Evita valores duplicados en una columna.                   |
| [`formatearComoTexto()`](#formatearComoTexto)                | Fuerza columnas a formato texto.                           |


---

<br><br><br><br>

<a id="setTimestampOnEdit"></a>
# 🕒setTimestampOnEdit

Registra automáticamente una fecha y hora cuando se modifica una celda determinada.

Puede configurarse para:

- Actualizar siempre la fecha al editar.
- Registrar la fecha una única vez y conservarla en futuras modificaciones.
- Eliminar la fecha cuando se borra el valor original.

## ⚙️Sintaxis

```javascript
setTimestampOnEdit(
  e,
  sheetName,
  watchCol,
  stampCol,
  startRow,
  clearStampOnEmpty,
  onlyIfEmpty,
);
```

## 📝Parámetros

| Parámetro           | Tipo    | Descripción                                                                   |
| ------------------- | ------- | ----------------------------------------------------------------------------- |
| `e`                 | Object  | Evento `onEdit`.                                                              |
| `sheetName`         | string  | Nombre de la hoja a monitorear.                                               |
| `watchCol`          | string  | Columna observada.                                                            |
| `stampCol`          | string  | Columna donde se escribirá la fecha y hora.                                   |
| `startRow`          | number  | Fila mínima a procesar.                                                       |
| `clearStampOnEmpty` | boolean | Si es `true`, elimina la fecha cuando se borra el valor observado.            |
| `onlyIfEmpty`       | boolean | Si es `true`, solo registra la fecha cuando la celda de timestamp está vacía. |

## 🔧Valores por defecto

```javascript
startRow = 2;
clearStampOnEmpty = true;
onlyIfEmpty = false;
```

## 💡Ejemplo 1 - Actualizar siempre la fecha

```javascript
function onEdit(e) {
  setTimestampOnEdit(e, "DATA", "A", "B", 2, true, false);
}
```

### 🔄Comportamiento

Cada vez que se modifica una celda de la columna A, la fecha de la columna B se actualiza.

| A           | B                |
| ----------- | ---------------- |
| Pedido 1001 | 22/06/2026 10:00 |

Si posteriormente se modifica:

| A                   | B                |
| ------------------- | ---------------- |
| Pedido 1001 Editado | 22/06/2026 10:30 |

La fecha se reemplaza por la nueva.

---

## 💡Ejemplo 2 - Registrar solo la primera vez

```javascript
function onEdit(e) {
  setTimestampOnEdit(e, "DATA", "A", "B", 2, true, true);
}
```

### 🔄Comportamiento

La fecha solo se registra cuando la columna de timestamp está vacía.

Primera edición:

| A           | B                |
| ----------- | ---------------- |
| Pedido 1001 | 22/06/2026 10:00 |

Ediciones posteriores:

| A                   | B                |
| ------------------- | ---------------- |
| Pedido 1001 Editado | 22/06/2026 10:00 |

La fecha original se conserva.

---

## 💡Ejemplo 3 - Conservar timestamp al borrar

```javascript
function onEdit(e) {
  setTimestampOnEdit(e, "DATA", "A", "B", 2, false, true);
}
```

### 🔄Comportamiento

Si el usuario elimina el contenido de la columna observada, la fecha permanece registrada.

---

## 🎯Casos de uso

### 📅Fecha de creación de registros

```javascript
onlyIfEmpty = true;
```

Ideal para conservar la fecha original de alta.

### 📝Fecha de última modificación

```javascript
onlyIfEmpty = false;
```

Ideal para auditoría de cambios.

### 📊Seguimiento de tareas

Registrar cuándo una tarea fue creada o modificada por última vez.

<br><br><br><br>


<a id="setHyperlinkInSameCellOnEdit"></a>
<!-- Comment: setHyperlinkInSameCellOnEdit -->
# 🕒setHyperlinkInSameCellOnEdit

Convierte automáticamente el valor ingresado en una celda en un hipervínculo.
La URL se genera concatenando el valor de la celda con una URL base configurada.

## ⚙️Sintaxis

```javascript
setHyperlinkInSameCellOnEdit(
  e,
  sheetName,
  watchCol,
  startRow,
  urlBase,
  clearOnEmpty,
);
```

## 📝Parámetros

| Parámetro     | Tipo    | Descripción                                                  |
| ------------- | ------- | ------------------------------------------------------------ |
| `e`           | Object  | Evento `onEdit`.                                             |
| `sheetName`   | string  | Nombre de la hoja a monitorear.                              |
| `watchCol`    | string  | Columna donde se generarán los enlaces.                      |
| `startRow`    | number  | Fila mínima a procesar.                                      |
| `urlBase`     | string  | URL base que se concatenará con el valor de la celda.        |
| `onlyIfEmpty` | boolean | Si es `true`, elimina el enlace cuando la celda queda vacía. |

## 🔧Valores por defecto

```javascript
startRow = 2;
clearOnEmpty = true;
```

## Ejemplo

```javascript
function onEdit(e) {
  setHyperlinkInSameCellOnEdit(
    e,
    "DATA",
    "A",
    2,
    "https://mi-sitio.com/item/",
    true,
  );
}
```

### 🔄Comportamiento

Si el usuario escribe: 123

La función convertirá automáticamente el contenido en un enlace.

### ✅Resultado

Texto visible:

```text
123
```

URL asociada:

```text
https://mi-sitio.com/item/123
```

## 🎯Casos de uso

#### 🎫 Ticket

Generar enlaces automáticos hacia sistemas de soporte.

#### 📄 Documentos

Abrir documentos a partir de un identificador.

#### 🔍 Búsquedas

Construir URLs dinámicas utilizando códigos o identificadores.

## ⚠️ Consideraciones

- La función modifica únicamente la columna configurada en watchCol.
- Soporta edición de múltiples filas mediante pegado masivo.
- El texto visible de la celda se mantiene sin cambios.
- Solo se modifica el enlace asociado al contenido.
- Si clearOnEmpty es true, al borrar el contenido también se elimina el hipervínculo.

<br><br><br><br>


<a id="setUserEmailOnEdit"></a>
<!-- Comment: setUserEmailOnEdit -->
# 👤setUserEmailOnEdit

Registra automáticamente el correo electrónico del usuario que realizó una modificación en una hoja.

Puede configurarse para:

- Actualizar siempre el correo al editar.
- Registrar el primer usuario y conservarlo en futuras modificaciones.
- Eliminar el correo cuando se borra el valor observado.

## ⚙️Sintaxis

```javascript
setUserEmailOnEdit(
  e,
  sheetName,
  watchCol,
  emailCol,
  startRow,
  clearOnEmpty,
  onlyIfEmpty,
);
```

## 📝Parámetros

| Parámetro      | Tipo    | Descripción                                                               |
| -------------- | ------- | ------------------------------------------------------------------------- |
| `e`            | Object  | Evento `onEdit`.                                                          |
| `sheetName`    | string  | Nombre de la hoja a monitorear.                                           |
| `watchCol`     | string  | Columna observada.                                                        |
| `emailCol`     | string  | Columna donde se almacenará el correo electrónico.                        |
| `startRow`     | number  | Fila mínima a procesar.                                                   |
| `clearOnEmpty` | boolean | Si es `true`, elimina el correo cuando se borra el valor observado.       |
| `onlyIfEmpty`  | boolean | Si es `true`, solo registra el correo cuando la celda destino está vacía. |

## 🔧Valores por defecto

```javascript
startRow = 2;
clearOnEmpty = true;
onlyIfEmpty = false;
```

## 💡Ejemplo 1 - Actualizar siempre el usuario

```javascript
function onEdit(e) {
  setUserEmailOnEdit(e, "DATA", "C", "D", 2, true, false);
}
```

### 🔄Comportamiento

Cada vez que se modifica una celda de la columna `C`, el correo de la columna `D` se actualiza con el usuario que realizó la edición.

### ✅Resultado

| C        | D                   |
| -------- | ------------------- |
| Aprobado | usuario@empresa.com |

Si otro usuario modifica posteriormente la misma fila:
| C | D |
|---|---|
| Reaprobado | supervisor@empresa.com |

## 💡 Ejemplo 2 - Registrar solo el primer usuario

```javascript
function onEdit(e) {
  setUserEmailOnEdit(e, "DATA", "C", "D", 2, true, true);
}
```

### 🔄 Comportamiento

El correo se registra únicamente la primera vez.

Primera edición:

| C        | D                   |
| -------- | ------------------- |
| Aprobado | usuario@empresa.com |

Ediciones posteriores:

| C          | D                   |
| ---------- | ------------------- |
| Reaprobado | usuario@empresa.com |

El correo original se conserva.

---

## 💡 Ejemplo 3 - Conservar el correo al borrar

```javascript
function onEdit(e) {
  setUserEmailOnEdit(e, "DATA", "C", "D", 2, false, true);
}
```

### 🔄 Comportamiento

Si el valor de la columna observada es eliminado, el correo permanecerá registrado.

---

## 🎯 Casos de uso

### 👤 Usuario creador

```javascript
onlyIfEmpty = true;
```

Permite identificar quién creó originalmente un registro.

### ✏️ Último editor

```javascript
onlyIfEmpty = false;
```

Permite identificar quién realizó la última modificación.

### 📋 Auditoría

Registrar automáticamente responsables de aprobaciones, validaciones o cambios de estado.

---

## ⚠️ Consideraciones

- La obtención del correo depende de los permisos y políticas de Google Workspace.
- En cuentas personales de Google el correo puede devolverse vacío.
- Funciona tanto para ediciones individuales como para pegado de múltiples filas.
- Solo procesa cambios realizados en la columna configurada en `watchCol`.
- Si `clearOnEmpty` es `true`, al borrar el valor observado también se elimina el correo asociado.
- Si no es posible obtener el correo del usuario, la función conservará el valor existente cuando corresponda.

<br><br><br><br>



<a id="bloquearDuplicadosEnColumnaOnEdit"></a>
<!-- Comment: bloquearDuplicadosEnColumnaOnEdit -->
# 🚫 bloquearDuplicadosEnColumnaOnEdit

Impide que se ingresen valores duplicados dentro de una columna determinada.

La función valida automáticamente los datos ingresados y, en caso de detectar un valor repetido, revierte la edición o elimina el valor duplicado.

## ⚙️ Sintaxis

```javascript
bloquearDuplicadosEnColumnaOnEdit(
  e,
  sheetName,
  watchCol,
  startRow,
  ignoreCase,
  trimValues,
);
```

## 📝 Parámetros

| Parámetro    | Tipo    | Descripción                                           |
| ------------ | ------- | ----------------------------------------------------- |
| `e`          | Object  | Evento `onEdit`.                                      |
| `sheetName`  | string  | Nombre de la hoja a monitorear.                       |
| `watchCol`   | string  | Columna donde se validarán los duplicados.            |
| `startRow`   | number  | Fila mínima a procesar.                               |
| `ignoreCase` | boolean | Ignora diferencias entre mayúsculas y minúsculas.     |
| `trimValues` | boolean | Elimina espacios al inicio y final antes de comparar. |

## 🔧 Valores por defecto

```javascript
startRow = 2;
ignoreCase = true;
trimValues = true;
```

## 💡 Ejemplo básico

```javascript
function onEdit(e) {
  bloquearDuplicadosEnColumnaOnEdit(e, "DATA", "A", 2, true, true);
}
```

### 🔄 Comportamiento

Si ya existe:

```text
ABC123
```

y un usuario intenta ingresar nuevamente:

```text
ABC123
```

la función revertirá la edición y mostrará una advertencia.

### ✅ Resultado

| A      |
| ------ |
| ABC123 |
|        |

Mensaje mostrado:

```text
No se permiten duplicados en la columna A.
Valor duplicado eliminado.
```

---

## 💡 Ejemplo ignorando mayúsculas y minúsculas

```javascript
function onEdit(e) {
  bloquearDuplicadosEnColumnaOnEdit(e, "DATA", "A", 2, true, true);
}
```

### 🔄 Comportamiento

Los siguientes valores serán considerados iguales:

```text
ABC123
abc123
AbC123
```

Solo se permitirá uno de ellos.

---

## 💡 Ejemplo considerando mayúsculas y minúsculas

```javascript
function onEdit(e) {
  bloquearDuplicadosEnColumnaOnEdit(e, "DATA", "A", 2, false, true);
}
```

### 🔄 Comportamiento

Los siguientes valores serán considerados diferentes:

```text
ABC123
abc123
```

Por lo tanto ambos podrán existir en la columna.

---

## 💡 Ejemplo eliminando espacios

```javascript
function onEdit(e) {
  bloquearDuplicadosEnColumnaOnEdit(e, "DATA", "A", 2, true, true);
}
```

### 🔄 Comportamiento

Los siguientes valores serán considerados iguales:

```text
ABC123
 ABC123
ABC123
```

Los espacios al inicio o final serán ignorados.

---

## 🎯 Casos de uso

### 🆔 Identificadores únicos

Evitar números de cliente duplicados.

### 📦 Códigos de productos

Garantizar que cada producto tenga un código único.

### 🎫 Tickets

Evitar la carga accidental de tickets repetidos.

### 📄 Documentos

Controlar que no existan números de expediente duplicados.

---

## ⚠️ Consideraciones

- Solo valida la columna configurada en `watchCol`.
- Soporta edición individual y pegado masivo.
- Los valores vacíos no se consideran duplicados.
- Cuando se detecta un duplicado, la edición es revertida automáticamente.
- Si la edición proviene de un pegado múltiple, los valores duplicados se eliminan.
- Muestra una alerta o notificación informando la validación realizada.

---

<br><br><br><br>




<a id="formatearComoTexto"></a>
<!-- Comment: formatearComoTexto -->
# 📄 formatearComoTexto
Aplica formato de texto a una o varias columnas cuando se realiza una edición.

La función fuerza que los valores se almacenen como texto, evitando conversiones automáticas de Google Sheets y conservando caracteres especiales o ceros iniciales.

Además, aplica un formato visual uniforme a las celdas procesadas.


## ⚙️ Sintaxis

```javascript
formatearComoTexto(
  e,
  columnas
);
```

## 📝 Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `e` | Object | Evento `onEdit`. |
| `columnas` | Array<string> | Lista de columnas que se formatearán como texto. |

## 💡 Ejemplo básico

```javascript
function onEdit(e) {
  formatearComoTexto(
    e,
    ["A", "B", "C"]
  );
}
```

## 🔄 Comportamiento

Si el usuario ingresa:

```text
001234
```

Google Sheets normalmente podría interpretar el valor como:

```text
1234
```

La función conservará el contenido original:

```text
001234
```

### ✅ Resultado

| Valor ingresado | Valor almacenado |
|----------------|------------------|
| 001234 | 001234 |
| 000001 | 000001 |
| 08-12345678-9 | 08-12345678-9 |

---

## 🎨 Formato aplicado

Además de convertir la celda a texto, la función aplica automáticamente:

- Formato de número: Texto (`@`)
- Alineación horizontal: Centrada
- Alineación vertical: Centrada
- Tamaño de fuente: 10
- Estilo de fuente: Normal

---

## 🎯 Casos de uso

### 🆔 DNI

Evita modificaciones no deseadas en números de documento.

### 🏢 CUIT / CUIL

Conserva guiones y formatos personalizados.

### 📦 Códigos internos

Mantiene códigos alfanuméricos sin alteraciones.

### 🔢 Valores con ceros iniciales

Ideal para:

```text
00001
00025
00100
```

### 📞 Teléfonos

Evita conversiones automáticas realizadas por Sheets.

### 🏷️ Números de serie

Conserva exactamente el valor ingresado por el usuario.

---

## ⚠️ Consideraciones

- Solo procesa las columnas indicadas en el parámetro `columnas`.
- Soporta edición individual y pegado masivo.
- Mantiene el valor visible exactamente como fue ingresado.
- Evita la pérdida de ceros iniciales.
- Aplica automáticamente el formato visual definido en la función.
- Si una columna no forma parte de la edición realizada, no será procesada.

---

