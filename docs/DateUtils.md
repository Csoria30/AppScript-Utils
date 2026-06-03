# DateUtils

Utilidades para trabajar con fechas y horas en Google Apps Script.

Permiten obtener fechas formateadas utilizando cualquier zona horaria soportada por Google Apps Script.

---

# fechaActual

Devuelve la fecha y hora actual utilizando el formato y zona horaria especificados.

## Sintaxis

```javascript
DateUtils.fechaActual(formato, zonaHoraria);
```

## Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `formato` | string | Sí | Formato de salida de la fecha. |
| `zonaHoraria` | string | Sí | Zona horaria compatible con Apps Script. |

## Retorno

```javascript
string
```

Fecha formateada según los parámetros recibidos.

---

## Ejemplos

### Fecha ISO

```javascript
const fecha = DateUtils.fechaActual(
  "yyyy-MM-dd",
  "UTC"
);

Logger.log(fecha);
```

Resultado:

```text
2026-06-03
```

---

### Fecha y hora

```javascript
const fechaHora = DateUtils.fechaActual(
  "dd/MM/yyyy HH:mm:ss",
  "America/Argentina/Buenos_Aires"
);
```

Resultado:

```text
03/06/2026 14:30:25
```

---

### Formato para nombres de archivos

```javascript
const nombreArchivo = DateUtils.fechaActual(
  "yyyyMMdd_HHmmss",
  "UTC"
);
```

Resultado:

```text
20260603_173025
```

---

## Formatos comunes

| Formato | Resultado |
|----------|------------|
| `dd/MM/yyyy` | 03/06/2026 |
| `yyyy-MM-dd` | 2026-06-03 |
| `dd/MM/yyyy HH:mm:ss` | 03/06/2026 14:30:25 |
| `yyyyMMdd` | 20260603 |
| `HH:mm:ss` | 14:30:25 |

---

# fechaArgentina

Atajo para obtener la fecha actual en formato argentino.

Internamente utiliza:

```javascript
DateUtils.fechaActual(
  "dd/MM/yyyy",
  "America/Argentina/Buenos_Aires"
);
```

## Sintaxis

```javascript
DateUtils.fechaArgentina();
```

## Retorno

```javascript
string
```

Fecha actual en formato argentino.

---

## Ejemplo

```javascript
const fecha = DateUtils.fechaArgentina();

Logger.log(fecha);
```

Resultado:

```text
03/06/2026
```

---

## Casos de uso

### Registrar fecha de carga

```javascript
hoja.getRange("A2").setValue(
  DateUtils.fechaArgentina()
);
```

### Generar reportes diarios

```javascript
const reporte = `Ventas_${DateUtils.fechaArgentina()}`;
```

### Guardar fecha en registros

```javascript
datos.fechaCreacion = DateUtils.fechaArgentina();
```

---

## Buenas prácticas

✅ Utilizar `fechaActual()` cuando se necesite control total sobre formato y zona horaria.

✅ Utilizar `fechaArgentina()` para proyectos destinados a usuarios en Argentina.

✅ Guardar fechas en formato ISO (`yyyy-MM-dd`) cuando se procesarán posteriormente.

❌ Evitar comparar fechas como texto cuando se requieran operaciones de fecha complejas.
