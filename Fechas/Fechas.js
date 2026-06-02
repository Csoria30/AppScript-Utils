var DateUtils = {
  /**
   * Obtiene la fecha actual en formato argentino (dd/MM/yyyy).
   *
   * @returns {string} Fecha formateada.
   */
  fechaArgentina: function () {
    return Utilities.formatDate(
      new Date(),
      "America/Argentina/Buenos_Aires",
      "dd/MM/yyyy",
    );
  },
};
