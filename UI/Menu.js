var MenuUtils = {
  /**
   * Crea un menú personalizado en Google Sheets.
   *
   * @param {string} nombre Nombre del menú.
   * @param {Array<Array<string>>} opciones Array de pares [texto, funcion].
   */
  crearMenu: function (nombre, opciones) {
    const menu = SpreadsheetApp.getUi().createMenu(nombre);

    opciones.forEach(([texto, funcion]) => {
      menu.addItem(texto, funcion);
    });

    menu.addToUi();
  },
};
