var SheetUtils = {
  /**
   * Convierte una columna de Sheets a su índice numérico.
   * A = 1, Z = 26, AA = 27, AB = 28...
   *
   * @param {string} columna
   * @returns {number}
   */
  columnaIndice: function (columna) {
    let resultado = 0;

    for (let i = 0; i < columna.length; i++) {
      resultado = resultado * 26 + columna.charCodeAt(i) - 64;
    }

    return resultado;
  },

  /**
   * Limpia el contenido de un rango de datos.
   *
   * @param {string} nombreHoja Nombre de la hoja.
   * @param {number} filaInicial Fila desde la que comienza la limpieza.
   * @param {number} columnaInicial Columna inicial.
   * @param {number} [cantidadColumnas] Cantidad de columnas a limpiar.
   *                                    Si se omite, utiliza hasta la última columna con datos.
   * @param {number} [filaFinal] Última fila a limpiar.
   *                             Si se omite, utiliza la última fila con datos.
   */
  limpiarRangoDatos: function (
    nombreHoja,
    filaInicial,
    columnaInicial,
    cantidadColumnas,
    filaFinal,
  ) {
    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(`No existe la hoja "${nombreHoja}"`);
    }

    const ultimaFila = filaFinal || hoja.getLastRow();

    if (ultimaFila < filaInicial) return;

    const columnas =
      cantidadColumnas || hoja.getLastColumn() - columnaInicial + 1;

    hoja
      .getRange(
        filaInicial,
        columnaInicial,
        ultimaFila - filaInicial + 1,
        columnas,
      )
      .clearContent();
  },
};
