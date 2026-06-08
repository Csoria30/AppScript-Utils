# DateUtils

Utilidades para trabajar con fechas y horas en Google Apps Script.

Permiten obtener fechas formateadas utilizando cualquier zona horaria soportada por Google Apps Script.

---

# fechaActual

Devuelve la fecha y hora actual utilizando el formato y zona horaria especificados.

## Sintaxis

```javascript
DateUtils.fechaActual(config);
```

## Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `config` | Object | No | Configuración opcional de formato y zona horaria. |
| `config.formato` | string | No | Formato de salida de la fecha. Valor por defecto: `dd/MM/yyyy`. |
| `config.zonaHoraria` | string | No | Zona horaria compatible con Apps Script. Valor por defecto: `America/Argentina/Buenos_Aires`. |

## Retorno

```javascript
string
```

Fecha formateada según la configuración recibida.

---

## Ejemplos

### Utilizando valores por defecto

```javascript
const fecha = DateUtils.fechaActual();

Logger.log(fecha);
```

Resultado:

```text
03/06/2026
```

---

### Fecha ISO

```javascript
const fecha = DateUtils.fechaActual({
  formato: "yyyy-MM-dd",
  zonaHoraria: "UTC"
});

Logger.log(fecha);
```

Resultado:

```text
2026-06-03
```

---

### Fecha y hora

```javascript
const fechaHora = DateUtils.fechaActual({
  formato: "dd/MM/yyyy HH:mm:ss",
  zonaHoraria: "America/Argentina/Buenos_Aires"
});
```

Resultado:

```text
03/06/2026 14:30:25
```

---

### Formato para nombres de archivos

```javascript
const nombreArchivo = DateUtils.fechaActual({
  formato: "yyyyMMdd_HHmmss",
  zonaHoraria: "UTC"
});
```

Resultado:

```text
20260603_173025
```

---

### Solo cambiar el formato

```javascript
const fecha = DateUtils.fechaActual({
  formato: "yyyy-MM-dd"
});
```

---

### Solo cambiar la zona horaria

```javascript
const fecha = DateUtils.fechaActual({
  zonaHoraria: "UTC"
});
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
DateUtils.fechaActual();
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

✅ Aprovechar los valores por defecto cuando se trabaje con fechas en Argentina.

✅ Utilizar un objeto de configuración para mejorar la legibilidad del código.

✅ Guardar fechas en formato ISO (`yyyy-MM-dd`) cuando se procesarán posteriormente.

❌ Evitar comparar fechas como texto cuando se requieran operaciones de fecha complejas.
