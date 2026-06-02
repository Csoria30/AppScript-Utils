var SheetFormat = {
  /**
   * Centra horizontal y verticalmente el contenido de un rango.
   *
   * @param {GoogleAppsScript.Spreadsheet.Range} rango
   */
  centrarRango: function (rango) {
    if (!rango || typeof rango.setHorizontalAlignment !== "function") {
      throw new Error(
        "SheetFormat.centrarRango: debe recibir un rango valido de SpreadsheetApp.",
      );
    }

    rango.setHorizontalAlignment("center").setVerticalAlignment("middle");
  },
};
