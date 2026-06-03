# MenuUtils

Utilidades para la creación de menús personalizados en Google Sheets.

---

## crearMenu(nombre, opciones)

Crea un menú personalizado en la barra superior de Google Sheets.

### Sintaxis

```javascript
MenuUtils.crearMenu(nombre, opciones);
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `nombre` | `string` | Sí | Nombre que tendrá el menú en la interfaz de Google Sheets. |
| `opciones` | `Array<Array<string>>` | Sí | Lista de opciones que compondrán el menú. |

### Formato de opciones

Cada elemento del array debe tener una de las siguientes estructuras:

#### Opción de menú

```javascript
["Texto visible", "nombreFuncion"]
```

Ejemplo:

```javascript
["Importar datos", "importarDatos"]
```

---

#### Separador

```javascript
["-"]
```

o

```javascript
["separator"]
```

Ejemplo:

```javascript
["-"]
```

---

## Ejemplo básico

```javascript
function onOpen() {
  MenuUtils.crearMenu("Herramientas", [
    ["Importar Datos", "importarDatos"],
    ["Exportar Datos", "exportarDatos"]
  ]);
}
```

### Resultado

```text
Herramientas
├── Importar Datos
└── Exportar Datos
```

---

## Ejemplo con separadores

```javascript
function onOpen() {
  MenuUtils.crearMenu("Selector", [
    ["Abrir selector de hojas", "abrirSelectorHojas"],
    ["-"],
    ["Activar OpenAutomatico", "activarOpenAutomatico"],
    ["Desactivar OpenAutomatico", "desactivarOpenAutomatico"]
  ]);
}
```

### Resultado

```text
Selector
├── Abrir selector de hojas
├──────────────
├── Activar OpenAutomatico
└── Desactivar OpenAutomatico
```

---

## Funciones asociadas

Las funciones referenciadas deben existir en el proyecto:

```javascript
function abrirSelectorHojas() {
  SpreadsheetApp.getUi().alert("Selector abierto");
}

function activarOpenAutomatico() {
  SpreadsheetApp.getUi().alert("Activado");
}
```

---

## Errores

La función lanzará una excepción cuando:

- `nombre` sea nulo o vacío.
- `opciones` no sea un array.
- Una opción no tenga formato válido.
- El texto del menú esté vacío.
- El nombre de la función esté vacío.

Ejemplo:

```javascript
MenuUtils.crearMenu("", []);
```

Resultado:

```text
Error:
MenuUtils.crearMenu: 'nombre' debe ser un texto no vacio.
```

---

## Buenas prácticas

✅ Crear el menú dentro de `onOpen()`.

```javascript
function onOpen() {
  MenuUtils.crearMenu(...);
}
```

✅ Mantener nombres descriptivos para las funciones.

```javascript
["Actualizar Stock", "actualizarStock"]
```

❌ Evitar nombres genéricos.

```javascript
["Botón", "test"]
```
