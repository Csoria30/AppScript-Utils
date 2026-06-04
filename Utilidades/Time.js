var Time = {
  /**
   * Convierte una duración en formato:
   * "Xd Yh Zm"
   * a minutos totales.
   *
   * Ejemplos:
   * "3d 5h 32m" => 4652
   * "0d 19h 11m" => 1151
   *
   * @param {string} texto
   * @returns {number|null}
   */
  parsearDuracion: function (texto) {
    if (!texto || typeof texto !== "string") {
      return null;
    }

    var match = texto.match(/^\s*(\d+)\s*d\s+(\d+)\s*h\s+(\d+)\s*m\s*$/i);

    if (!match) {
      return null;
    }

    var dias = parseInt(match[1], 10);
    var horas = parseInt(match[2], 10);
    var minutos = parseInt(match[3], 10);

    return dias * 1440 + horas * 60 + minutos;
  },

  /**
   * Calcula la duración entre dos fechas.
   *
   * @param {Date|string} fechaInicio
   * @param {Date|string} fechaFin
   * @returns {{
   *   texto: string,
   *   minutos: number,
   *   dias: number,
   *   horas: number,
   *   minutosRestantes: number
   * } | null}
   */
  calcularDuracion: function (fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) {
      return null;
    }

    var inicio =
      fechaInicio instanceof Date ? fechaInicio : new Date(fechaInicio);

    var fin = fechaFin instanceof Date ? fechaFin : new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return null;
    }

    var diffMs = fin.getTime() - inicio.getTime();

    if (diffMs < 0) {
      return null;
    }

    var dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    var horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    var minutosRestantes = Math.floor(
      (diffMs % (1000 * 60 * 60)) / (1000 * 60),
    );

    var totalMinutos = dias * 1440 + horas * 60 + minutosRestantes;

    return {
      texto: dias + "d " + horas + "h " + minutosRestantes + "m",
      minutos: totalMinutos,
      dias: dias,
      horas: horas,
      minutosRestantes: minutosRestantes,
    };
  },
  actualizarDuracionColumna: function (
    nombreHoja,
    columnaFecha,
    columnaDestino,
    filaInicial,
  ) {
    filaInicial = filaInicial || 2;

    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(
        'Time.actualizarDuracionColumna: no existe la hoja "' +
          nombreHoja +
          '".',
      );
    }

    var colFecha = SheetUtils.columnToIndex(columnaFecha);
    var colDestino = SheetUtils.columnToIndex(columnaDestino);

    var ultimaFila = hoja.getLastRow();

    if (ultimaFila < filaInicial) {
      return {
        filasProcesadas: 0,
      };
    }

    var filas = ultimaFila - filaInicial + 1;

    var fechas = hoja.getRange(filaInicial, colFecha, filas, 1).getValues();

    var resultados = [];
    var ahora = new Date();

    for (var i = 0; i < fechas.length; i++) {
      var fechaInicio = fechas[i][0];

      if (!fechaInicio) {
        resultados.push([""]);
        continue;
      }

      var duracion = this.calcularDuracion(fechaInicio, ahora);

      resultados.push([duracion ? duracion.texto : ""]);
    }

    hoja
      .getRange(filaInicial, colDestino, resultados.length, 1)
      .setValues(resultados);

    return {
      filasProcesadas: filas,
    };
  },
};
