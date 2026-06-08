var DateUtils = {
  /**
   * Devuelve la fecha actual con formato y zona horaria configurables.
   *
   * @param {Object} [config={}] Configuración opcional.
   * @param {string} [config.formato="dd/MM/yyyy"] Formato compatible con Utilities.formatDate.
   * @param {string} [config.zonaHoraria="America/Argentina/Buenos_Aires"] Zona horaria IANA.
   * @returns {string} Fecha formateada.
   */
  fechaActual: function (config) {
    config = config || {};
    const zonaHoraria = config.zonaHoraria || "America/Argentina/Buenos_Aires";
    const formato = config.formato || "dd/MM/yyyy";

    return Utilities.formatDate(new Date(), zonaHoraria, formato);
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
