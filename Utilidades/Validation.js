var SheetValidation = {
  /**
   * Crea una lista desplegable en una columna.
   *
   * @param {Object} config
   * @param {string} config.nombreHoja
   * @param {string} config.columna
   * @param {string[]} config.opciones
   * @param {number} [config.filaInicial=2]
   * @param {number} [config.cantidadFilas]
   */
  crearListaDesplegable: function (config) {
    if (!config) {
      throw new Error(
        "SheetValidation.crearListaDesplegable: config es obligatorio.",
      );
    }

    const {
      nombreHoja,
      columna,
      opciones,
      filaInicial = 2,
      cantidadFilas,
    } = config;

    if (!nombreHoja) {
      throw new Error("nombreHoja es obligatorio.");
    }

    if (!columna) {
      throw new Error("columna es obligatoria.");
    }

    if (!Array.isArray(opciones) || opciones.length === 0) {
      throw new Error("opciones debe ser un arreglo con al menos un elemento.");
    }

    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(`No existe la hoja '${nombreHoja}'.`);
    }

    const columnaIndice = SheetUtils.columnToIndex(columna);

    const regla = SpreadsheetApp.newDataValidation()
      .requireValueInList(opciones, true)
      .setAllowInvalid(false)
      .build();

    const filas =
      Number.isInteger(cantidadFilas) && cantidadFilas > 0
        ? cantidadFilas
        : hoja.getMaxRows() - filaInicial + 1;

    hoja
      .getRange(filaInicial, columnaIndice, filas, 1)
      .setDataValidation(regla);
  },

  /**
   * Crea múltiples listas desplegables.
   *
   * @param {Object[]} configs
   */
  crearListasDesplegables: function (configs) {
    if (!Array.isArray(configs)) {
      throw new Error(
        "SheetValidation.crearListasDesplegables: configs debe ser un arreglo.",
      );
    }

    configs.forEach((config) => {
      this.crearListaDesplegable(config);
    });
  },
};
