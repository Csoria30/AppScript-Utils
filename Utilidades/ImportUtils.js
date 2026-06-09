var ImportUtils = {
  /**
   * @typedef {Object} ImportCsvConfig
   * @property {Blob} blob
   * @property {string} sheetName
   * @property {number} [startRow=1]
   * @property {number} [startColumn=1]
   * @property {boolean} [clearBeforeImport=false]
   */

  importarCsvDesdeBlob: function (config) {
    if (!config) {
      throw new Error(
        "ImportUtils.importarCsvDesdeBlob: config es obligatorio.",
      );
    }

    const {
      blob,
      sheetName,
      startRow = 1,
      startColumn = 1,
      clearBeforeImport = false,
    } = config;

    if (!blob) {
      throw new Error("ImportUtils.importarCsvDesdeBlob: blob es obligatorio.");
    }

    if (!sheetName) {
      throw new Error(
        "ImportUtils.importarCsvDesdeBlob: sheetName es obligatorio.",
      );
    }

    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (!hoja) {
      throw new Error(`No existe la hoja '${sheetName}'.`);
    }

    const contenido = blob.getDataAsString("UTF-8");
    const datos = Utilities.parseCsv(contenido, ";");

    if (!datos || datos.length === 0) {
      throw new Error("El archivo CSV no contiene datos.");
    }

    if (clearBeforeImport) {
      const ultimaFila = hoja.getMaxRows();
      const ultimaColumna = hoja.getMaxColumns();

      hoja
        .getRange(
          startRow,
          startColumn,
          ultimaFila - startRow + 1,
          ultimaColumna - startColumn + 1,
        )
        .clearContent();
    }

    hoja
      .getRange(startRow, startColumn, datos.length, datos[0].length)
      .setValues(datos);

    return {
      filasImportadas: datos.length,
      columnasImportadas: datos[0].length,
    };
  },

  procesarReclamos: function (sheetName) {
    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (!hoja) {
      throw new Error(`No existe la hoja '${sheetName}'.`);
    }

    const datos = hoja.getDataRange().getValues();

    if (datos.length <= 2) {
      return {
        filasOriginales: datos.length,
        filasProcesadas: 0,
      };
    }

    const bandejasConservar = new Set([
      "Alarma Comunitaria",
      "Asistencia // INFRAESTRUCTURA EXTERNA //",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Comercios",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Hogares",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Empresas",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Consorcios",
      "Soporte Terrazas y Ex CDG // ASISTENCIA EXTERNA //",
      "Preventivos AUI - Acceso",
      "INFRAESTRUCTURA EXTERNA //  Troncal y Distribucion",
    ]);

    const equivalencias = {
      "A 1000 // INFRAESTRUCTURA EXTERNA // Hogares": "A1000 Hogares",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Empresas": "A1000 Empresas",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Comercios": "A1000 Comercios",
      "A 1000 // INFRAESTRUCTURA EXTERNA // Consorcios": "A1000 Consorcios",
      "Asistencia // INFRAESTRUCTURA EXTERNA //": "Asistencia",
      "Soporte Terrazas y Ex CDG // ASISTENCIA EXTERNA //": "Soporte Terrazas",
      "INFRAESTRUCTURA EXTERNA //  Troncal y Distribucion":
        "Troncal y Distribución",
      "Preventivos AUI - Acceso": "Preventivos AUI",
    };

    const resultado = [];

    for (let i = 2; i < datos.length; i++) {
      const fila = [...datos[i]];

      const sector = fila[1];

      if (!bandejasConservar.has(sector)) {
        continue;
      }

      if (equivalencias[sector]) {
        fila[1] = equivalencias[sector];
      }

      resultado.push(fila);
    }

    hoja.clearContents();

    if (resultado.length === 0) {
      return {
        filasOriginales: datos.length,
        filasProcesadas: 0,
      };
    }

    hoja
      .getRange(1, 1, resultado.length, resultado[0].length)
      .setValues(resultado);

    return {
      filasOriginales: datos.length,
      filasProcesadas: resultado.length,
    };
  },
};
