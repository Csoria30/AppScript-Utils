var MenuUtils = {
  /**
   * Crea un menú personalizado en Google Sheets.
   *
   * @param {string} nombre Nombre del menú.
   * @param {Array<Array<string>>} opciones Array de pares [texto, funcion].
   *                                        Para separadores, usar ["-"] o ["separator"].
   */
  crearMenu: function (nombre, opciones) {
    if (!nombre || typeof nombre !== "string") {
      throw new Error(
        "MenuUtils.crearMenu: 'nombre' debe ser un texto no vacio.",
      );
    }

    if (!Array.isArray(opciones) || opciones.length === 0) {
      throw new Error(
        "MenuUtils.crearMenu: 'opciones' debe ser un array con al menos una opcion.",
      );
    }

    const menu = SpreadsheetApp.getUi().createMenu(nombre);

    opciones.forEach(function (opcion) {
      if (!Array.isArray(opcion) || opcion.length === 0) {
        throw new Error(
          "MenuUtils.crearMenu: cada opcion debe ser un array [texto, funcion] o ['-'].",
        );
      }

      const texto = opcion[0];
      const funcion = opcion[1];

      if (texto === "-" || texto === "separator") {
        menu.addSeparator();
        return;
      }

      if (!texto || typeof texto !== "string") {
        throw new Error(
          "MenuUtils.crearMenu: el texto de la opcion debe ser un string no vacio.",
        );
      }

      if (!funcion || typeof funcion !== "string") {
        throw new Error(
          "MenuUtils.crearMenu: la funcion de cada opcion debe ser un string no vacio.",
        );
      }

      menu.addItem(texto, funcion);
    });

    menu.addToUi();
  },
};
