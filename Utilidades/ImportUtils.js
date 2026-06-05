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
};
