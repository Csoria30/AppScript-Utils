var FuncionesBase = {
  /**
   * Devuelve el spreadsheet activo.
   *
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
   */
  obtenerLibroActivo: function () {
    return SpreadsheetApp.getActiveSpreadsheet();
  },

  /**
   * Obtiene una hoja por nombre.
   *
   * @param {string} nombreHoja
   * @returns {GoogleAppsScript.Spreadsheet.Sheet}
   */
  obtenerHoja: function (nombreHoja) {
    if (!nombreHoja || typeof nombreHoja !== "string") {
      throw new Error(
        "FuncionesBase.obtenerHoja: 'nombreHoja' debe ser un texto no vacio.",
      );
    }

    var hoja = this.obtenerLibroActivo().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(
        'FuncionesBase.obtenerHoja: no existe la hoja "' + nombreHoja + '".',
      );
    }

    return hoja;
  },

  /**
   * Obtiene un rango usando notacion A1.
   *
   * @param {string} nombreHoja
   * @param {string} notacionA1
   * @returns {GoogleAppsScript.Spreadsheet.Range}
   */
  obtenerRangoA1: function (nombreHoja, notacionA1) {
    if (!notacionA1 || typeof notacionA1 !== "string") {
      throw new Error(
        "FuncionesBase.obtenerRangoA1: 'notacionA1' debe ser un texto no vacio.",
      );
    }

    return this.obtenerHoja(nombreHoja).getRange(notacionA1);
  },

  /**
   * Obtiene un rango por coordenadas numericas.
   *
   * @param {string} nombreHoja
   * @param {number} fila
   * @param {number} columna
   * @param {number} [cantidadFilas=1]
   * @param {number} [cantidadColumnas=1]
   * @returns {GoogleAppsScript.Spreadsheet.Range}
   */
  obtenerRango: function (
    nombreHoja,
    fila,
    columna,
    cantidadFilas,
    cantidadColumnas,
  ) {
    if (!Number.isInteger(fila) || fila < 1) {
      throw new Error(
        "FuncionesBase.obtenerRango: 'fila' debe ser un entero mayor o igual a 1.",
      );
    }

    if (!Number.isInteger(columna) || columna < 1) {
      throw new Error(
        "FuncionesBase.obtenerRango: 'columna' debe ser un entero mayor o igual a 1.",
      );
    }

    var filasFinal = cantidadFilas === undefined ? 1 : cantidadFilas;
    var columnasFinal = cantidadColumnas === undefined ? 1 : cantidadColumnas;

    if (!Number.isInteger(filasFinal) || filasFinal < 1) {
      throw new Error(
        "FuncionesBase.obtenerRango: 'cantidadFilas' debe ser un entero mayor o igual a 1.",
      );
    }

    if (!Number.isInteger(columnasFinal) || columnasFinal < 1) {
      throw new Error(
        "FuncionesBase.obtenerRango: 'cantidadColumnas' debe ser un entero mayor o igual a 1.",
      );
    }

    return this.obtenerHoja(nombreHoja).getRange(
      fila,
      columna,
      filasFinal,
      columnasFinal,
    );
  },

  /**
   * Obtiene una celda individual.
   *
   * @param {string} nombreHoja
   * @param {number} fila
   * @param {number} columna
   * @returns {GoogleAppsScript.Spreadsheet.Range}
   */
  obtenerCelda: function (nombreHoja, fila, columna) {
    return this.obtenerRango(nombreHoja, fila, columna, 1, 1);
  },

  /**
   * Lee el valor de una celda.
   *
   * @param {string} nombreHoja
   * @param {number} fila
   * @param {number} columna
   * @returns {*}
   */
  obtenerValorCelda: function (nombreHoja, fila, columna) {
    return this.obtenerCelda(nombreHoja, fila, columna).getValue();
  },

  /**
   * Escribe valor en una celda.
   *
   * @param {string} nombreHoja
   * @param {number} fila
   * @param {number} columna
   * @param {*} valor
   */
  escribirValorCelda: function (nombreHoja, fila, columna, valor) {
    this.obtenerCelda(nombreHoja, fila, columna).setValue(valor);
  },

  /**
   * Devuelve la ultima fila con datos de una hoja.
   *
   * @param {string} nombreHoja
   * @returns {number}
   */
  obtenerUltimaFila: function (nombreHoja) {
    return this.obtenerHoja(nombreHoja).getLastRow();
  },

  /**
   * Devuelve la ultima columna con datos de una hoja.
   *
   * @param {string} nombreHoja
   * @returns {number}
   */
  obtenerUltimaColumna: function (nombreHoja) {
    return this.obtenerHoja(nombreHoja).getLastColumn();
  },
};
