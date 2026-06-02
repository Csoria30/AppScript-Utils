var SheetFormat = {
  /**
   * Centra horizontal y verticalmente el contenido de un rango.
   *
   * @param {GoogleAppsScript.Spreadsheet.Range} rango
   */
  centrarRango: function (rango) {
    rango.setHorizontalAlignment("center").setVerticalAlignment("middle");
  },
};
