var ImportUtils = {
  /**
   * Importa un CSV recibido como Blob.
   *
   * @param {Object} config
   * @param {Blob} config.blob
   * @param {string} config.sheetName
   * @param {number} config.startRow
   * @param {number} config.startColumn
   * @param {boolean} config.clearBeforeImport
   */
  importarCsvDesdeBlob: function (config) {
    if (!config) {
      throw new Error(
        "ImportUtils.importarCsvDesdeBlob: config es obligatorio.",
      );
    }

    if (!config.blob) {
      throw new Error("ImportUtils.importarCsvDesdeBlob: blob es obligatorio.");
    }

    if (!config.sheetName) {
      throw new Error(
        "ImportUtils.importarCsvDesdeBlob: sheetName es obligatorio.",
      );
    }

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      config.sheetName,
    );

    if (!hoja) {
      throw new Error(`No existe la hoja '${config.sheetName}'.`);
    }

    const contenido = config.blob.getDataAsString("UTF-8");

    const datos = Utilities.parseCsv(contenido);

    if (!datos || datos.length === 0) {
      throw new Error("El archivo CSV no contiene datos.");
    }

    const filaInicio = config.startRow || 1;
    const columnaInicio = config.startColumn || 1;

    if (config.clearBeforeImport === true) {
      const ultimaFila = hoja.getMaxRows();
      const ultimaColumna = hoja.getMaxColumns();

      hoja
        .getRange(
          filaInicio,
          columnaInicio,
          ultimaFila - filaInicio + 1,
          ultimaColumna - columnaInicio + 1,
        )
        .clearContent();
    }

    hoja
      .getRange(filaInicio, columnaInicio, datos.length, datos[0].length)
      .setValues(datos);

    return {
      filasImportadas: datos.length,
      columnasImportadas: datos[0].length,
    };
  },
};
