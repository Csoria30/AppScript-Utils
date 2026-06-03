# UtilsAppScript

Biblioteca de utilidades para Google Apps Script orientada a Google Sheets.

Permite simplificar tareas frecuentes como:
- 📄 Manipulación de hojas y rangos
- 🎨 Formato de celdas
- 📅 Manejo de fechas y horarios
- 🖱️ Menús personalizados
- ⚡ Automatizaciones con `onEdit`
---

## Características
### Utilidades básicas

- Obtener hojas y rangos
- Lectura y escritura de celdas
- Navegación simplificada sobre Sheets

### Rangos
- Conversión de columnas (`A` → `1`, `BL` → `64`)
- Limpieza masiva de datos
- Helpers para trabajar con bloques de información

### Automatizaciones
- Timestamp automático
- Hipervínculos automáticos
- Registro de usuario editor
- Prevención de duplicados

### Formato
- Centrado de contenido
- Formatos reutilizables
- Aplicación automática de estilos

### Menús personalizados
- Creación dinámica de menús
- Separadores automáticos
- Configuración mediante arrays

### Fechas
- Fechas formateadas
- Soporte para zonas horarias
- Helpers para Argentina

---
## Instalación
### Requisitos

- Node.js
- clasp

```bash
npm install -g @google/clasp
```
### Login

```bash
clasp login
```

### Publicar cambios
```bash
clasp push
```

### Crear versión

```bash
clasp version "feat: nueva funcionalidad"
```

### Publicar biblioteca
Apps Script → Deploy → Manage Deployments → New Deployment → Library

---

## Estructura

```text
Fechas/
  Fechas.js
Sheets/
  Rangos.js
  SheetFormat.js
UI/
  Menu.js
Utilidades/
  Basicas.js
```

## Documentación
| Módulo | Descripción |
|----------|----------|
| [Funciones Base](docs/basicas.md) | Operaciones básicas sobre Sheets |
| [Rangos](docs/rangos.md) | Utilidades para rangos y columnas |
| [Automatizaciones](docs/automatizaciones) | Helpers para eventos |
| [Menús](docs/menus.md) | Creación de menús personalizados |
| [Formato](docs/formatos.md) | Aplicación de estilos |
| [Fechas](docs/fechas.md) | Utilidades de fecha y hora |

---

## Ejemplo rápido
```javascript
function ejemplo() {
  var hoja = FuncionesBase.obtenerHoja("DATA");

  var valor = FuncionesBase.obtenerValorCelda(
    "DATA",
    2,
    1
  );

  Logger.log(valor);

  MenuUtils.crearMenu("Herramientas", [
    ["Importar", "importarDatos"],
    ["-"],
    ["Configuración", "abrirConfig"]
  ]);
}
```

## Licencia

MIT
