var SheetUtils = {
  /**
   * Convierte una columna de Sheets a su índice numérico.
   * A = 1, Z = 26, AA = 27, AB = 28...
   *
   * @param {string} columna
   * @returns {number}
   */
  columnaIndice: function (columna) {
    if (!columna || typeof columna !== "string") {
      throw new Error(
        "SheetUtils.columnaIndice: 'columna' debe ser un texto no vacio.",
      );
    }

    const columnaNormalizada = columna.trim().toUpperCase();

    if (!/^[A-Z]+$/.test(columnaNormalizada)) {
      throw new Error(
        "SheetUtils.columnaIndice: 'columna' solo puede contener letras de A a Z.",
      );
    }

    let resultado = 0;

    for (let i = 0; i < columnaNormalizada.length; i++) {
      resultado = resultado * 26 + columnaNormalizada.charCodeAt(i) - 64;
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
   * @returns {{filasLimpiadas:number, columnasLimpiadas:number}} Resumen de limpieza.
   */
  limpiarRangoDatos: function (
    nombreHoja,
    filaInicial,
    columnaInicial,
    cantidadColumnas,
    filaFinal,
  ) {
    if (!nombreHoja || typeof nombreHoja !== "string") {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'nombreHoja' debe ser un texto no vacio.",
      );
    }

    if (!Number.isInteger(filaInicial) || filaInicial < 1) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'filaInicial' debe ser un entero mayor o igual a 1.",
      );
    }

    if (!Number.isInteger(columnaInicial) || columnaInicial < 1) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'columnaInicial' debe ser un entero mayor o igual a 1.",
      );
    }

    if (
      cantidadColumnas !== undefined &&
      (!Number.isInteger(cantidadColumnas) || cantidadColumnas < 1)
    ) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'cantidadColumnas' debe ser un entero mayor o igual a 1.",
      );
    }

    if (
      filaFinal !== undefined &&
      (!Number.isInteger(filaFinal) || filaFinal < filaInicial)
    ) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'filaFinal' debe ser un entero mayor o igual a 'filaInicial'.",
      );
    }

    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(`No existe la hoja "${nombreHoja}"`);
    }

    const ultimaFila = filaFinal || hoja.getLastRow();

    if (ultimaFila < filaInicial) {
      return {
        filasLimpiadas: 0,
        columnasLimpiadas: 0,
      };
    }

    const columnas =
      cantidadColumnas || hoja.getLastColumn() - columnaInicial + 1;

    if (columnas < 1) {
      return {
        filasLimpiadas: 0,
        columnasLimpiadas: 0,
      };
    }

    const filas = ultimaFila - filaInicial + 1;

    hoja.getRange(filaInicial, columnaInicial, filas, columnas).clearContent();

    return {
      filasLimpiadas: filas,
      columnasLimpiadas: columnas,
    };
  },
};
