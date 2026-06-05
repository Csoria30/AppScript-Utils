var SheetValidation = {
  /**
   * Crea una lista desplegable en una columna.
   *
   * @param {Object} config
   * @param {string} config.nombreHoja
   * @param {string} config.columna
   * @param {string[]} config.opciones
   * @param {number} [config.filaInicial=2]
   */
  crearListaDesplegable: function (config) {
    if (!config) {
      throw new Error(
        "SheetValidation.crearListaDesplegable: config es obligatorio.",
      );
    }

    const { nombreHoja, columna, opciones, filaInicial = 2 } = config;

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

    const columnaIndice = UltilsScipts.SheetUtils.columnaAIndice(columna);

    const regla = SpreadsheetApp.newDataValidation()
      .requireValueInList(opciones, true)
      .setAllowInvalid(false)
      .build();

    hoja
      .getRange(
        filaInicial,
        columnaIndice,
        hoja.getMaxRows() - filaInicial + 1,
        1,
      )
      .setDataValidation(regla);
  },
  crearListasDesplegables: function (configs) {
    configs.forEach((config) => {
      this.crearListaDesplegable(config);
    });
  },
};
