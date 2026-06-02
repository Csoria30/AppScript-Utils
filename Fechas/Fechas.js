var DateUtils = {
  /**
   * Devuelve la fecha actual con formato y zona horaria configurables.
   *
   * @param {string} [formato="dd/MM/yyyy"] Formato compatible con Utilities.formatDate.
   * @param {string} [zonaHoraria="America/Argentina/Buenos_Aires"] Zona horaria IANA.
   * @returns {string} Fecha formateada.
   */
  fechaActual: function (formato, zonaHoraria) {
    const formatoFinal = formato || "dd/MM/yyyy";
    const zonaFinal = zonaHoraria || "America/Argentina/Buenos_Aires";

    return Utilities.formatDate(new Date(), zonaFinal, formatoFinal);
  },

  /**
   * Obtiene la fecha actual en formato argentino (dd/MM/yyyy).
   *
   * @returns {string} Fecha formateada.
   */
  fechaArgentina: function () {
    return this.fechaActual("dd/MM/yyyy", "America/Argentina/Buenos_Aires");
  },
};
