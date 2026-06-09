var SheetUtils = {
  /**
   * Convierte letras de columna de Google Sheets a índice numérico.
   *
   * Ejemplos:
   * A = 1, Z = 26, AA = 27, BL = 64.
   *
   * @param {string} columna Columna en formato A1.
   * @returns {number} Índice numérico de la columna.
   * @throws {Error} Si el valor recibido no es válido.
   */
  columnaIndice: function (columna) {
    if (!columna || typeof columna !== "string") {
      throw new Error(
        "SheetUtils.columnaIndice: 'columna' debe ser un texto no vacio.",
      );
    }

    const columnaNormalizada = columna.trim().toUpperCase();

    if (!/^[A-Z]+$/.test(columnaNormalizada)) {
      throw new Error(
        "SheetUtils.columnaIndice: 'columna' solo puede contener letras de A a Z.",
      );
    }

    let resultado = 0;

    for (let i = 0; i < columnaNormalizada.length; i++) {
      resultado = resultado * 26 + columnaNormalizada.charCodeAt(i) - 64;
    }

    return resultado;
  },

  columnToIndex: function (col) {
    if (typeof col === "number") return col;
    return this.columnaIndice(String(col));
  },

  /**
   * Limpia el contenido de un bloque de datos en una hoja.
   *
   * Permite borrar información desde una fila y columna iniciales
   * hasta una fila o cantidad de columnas determinadas.
   *
   * Si no se especifican `cantidadColumnas` o `filaFinal`,
   * se utilizarán los límites actuales de la hoja.
   *
   * @param {string} nombreHoja Nombre de la hoja.
   * @param {number} filaInicial Fila desde la que comienza la limpieza.
   * @param {number} columnaInicial Columna desde la que comienza la limpieza.
   * @param {number} [cantidadColumnas] Cantidad de columnas a limpiar.
   *                                    Si se omite, utiliza hasta la última columna con datos.
   * @param {number} [filaFinal] Última fila a limpiar.
   *                             Si se omite, utiliza la última fila con datos.
   *
   * @returns {{
   *   filasLimpiadas: number,
   *   columnasLimpiadas: number
   * }} Resumen de la operación realizada.
   *
   * @throws {Error}
   * Si `nombreHoja` es inválido o la hoja no existe.
   *
   * @throws {Error}
   * Si los parámetros numéricos no cumplen las validaciones requeridas.
   */
  limpiarRangoDatos: function (
    nombreHoja,
    filaInicial,
    columnaInicial,
    columnaFinal,
    filaFinal,
  ) {
    columnaInicial = this.columnToIndex(columnaInicial);
    columnaFinal = this.columnToIndex(columnaFinal);

    if (!nombreHoja || typeof nombreHoja !== "string") {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'nombreHoja' debe ser un texto no vacio.",
      );
    }

    if (!Number.isInteger(filaInicial) || filaInicial < 1) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'filaInicial' debe ser un entero mayor o igual a 1.",
      );
    }

    if (!Number.isInteger(columnaInicial) || columnaInicial < 1) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'columnaInicial' debe ser una columna válida.",
      );
    }

    if (!Number.isInteger(columnaFinal) || columnaFinal < columnaInicial) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'columnaFinal' debe ser mayor o igual a 'columnaInicial'.",
      );
    }

    if (
      filaFinal !== undefined &&
      (!Number.isInteger(filaFinal) || filaFinal < filaInicial)
    ) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'filaFinal' debe ser un entero mayor o igual a 'filaInicial'.",
      );
    }

    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(
        `SheetUtils.limpiarRangoDatos: no existe la hoja "${nombreHoja}".`,
      );
    }

    const ultimaFila = filaFinal || hoja.getLastRow();

    if (ultimaFila < filaInicial) {
      return {
        filasLimpiadas: 0,
        columnasLimpiadas: 0,
      };
    }

    const columnas = columnaFinal - columnaInicial + 1;
    const filas = ultimaFila - filaInicial + 1;

    hoja.getRange(filaInicial, columnaInicial, filas, columnas).clearContent();

    return {
      filasLimpiadas: filas,
      columnasLimpiadas: columnas,
    };
  },

  setTimestampOnEdit: function (
    e,
    sheetName,
    watchCol,
    stampCol,
    startRow,
    clearStampOnEmpty,
    onlyIfEmpty,
  ) {
    if (!e || !e.range) return;
    var range = e.range;
    var sheet = range.getSheet();
    if (sheet.getName() !== sheetName) return;

    startRow = startRow || 2;
    if (clearStampOnEmpty === undefined) clearStampOnEmpty = true;
    if (onlyIfEmpty === undefined) onlyIfEmpty = false;

    var watchIndex = SheetUtils.columnToIndex(watchCol);
    var stampIndex = SheetUtils.columnToIndex(stampCol);

    var editFirstCol = range.getColumn();
    var editLastCol = editFirstCol + range.getNumColumns() - 1;
    if (watchIndex < editFirstCol || watchIndex > editLastCol) return;

    var firstRow = range.getRow();
    var lastRow = firstRow + range.getNumRows() - 1;
    var procStart = Math.max(firstRow, startRow);
    var numRows = lastRow - procStart + 1;
    if (numRows <= 0) return;

    var watchVals = sheet
      .getRange(procStart, watchIndex, numRows, 1)
      .getValues();
    var stampRange = sheet.getRange(procStart, stampIndex, numRows, 1);
    var existingStamps = stampRange.getValues();
    var stampValues = [];
    var now = new Date();

    for (var i = 0; i < watchVals.length; i++) {
      var value = watchVals[i][0];
      var existingStamp = existingStamps[i][0];

      var hasExistingStamp =
        existingStamp !== "" &&
        existingStamp !== null &&
        existingStamp !== undefined;

      if (value !== "" && value !== null && value !== undefined) {
        if (onlyIfEmpty && hasExistingStamp) {
          stampValues.push([existingStamp]);
        } else {
          stampValues.push([now]);
        }
      } else {
        stampValues.push([clearStampOnEmpty ? "" : existingStamp]);
      }
    }

    stampRange.setValues(stampValues);
  },

  /**
   * Convierte en un link el valor de una celda, concatenendo una url base.
   *
   * @param {string} sheetName
   * @param {number} watchCol
   * @param {number} startRow
   * @param {string} urlBase
   * @param {boolean} clearOnEmpty
   * @returns {number}
   */
  setHyperlinkInSameCellOnEdit: function (
    e,
    sheetName,
    watchCol,
    startRow,
    urlBase,
    clearOnEmpty,
  ) {
    /* SpreadsheetApp.getActive().toast(
      "Entró a la función de biblioteca",
      "DEBUG",
      3,
    ); */

    if (!e || !e.range) return;
    var range = e.range;
    var sheet = range.getSheet();
    if (sheet.getName() !== sheetName) return;

    startRow = startRow || 2;
    if (clearOnEmpty === undefined) clearOnEmpty = true;

    var watchIndex = SheetUtils.columnToIndex(watchCol);

    var editFirstCol = range.getColumn();
    var editLastCol = editFirstCol + range.getNumColumns() - 1;
    if (watchIndex < editFirstCol || watchIndex > editLastCol) return;

    var firstRow = range.getRow();
    var lastRow = firstRow + range.getNumRows() - 1;
    var procStart = Math.max(firstRow, startRow);
    var numRows = lastRow - procStart + 1;
    if (numRows <= 0) return;

    var vals = sheet.getRange(procStart, watchIndex, numRows, 1).getValues();
    var richArray = [];

    for (var i = 0; i < vals.length; i++) {
      var v = vals[i][0];
      if (v !== "" && v !== null && v !== undefined) {
        var texto = String(v);
        var link = (urlBase || "") + texto;
        var rich = SpreadsheetApp.newRichTextValue()
          .setText(texto)
          .setLinkUrl(link)
          .build();
        richArray.push([rich]);
      } else if (clearOnEmpty) {
        richArray.push([SpreadsheetApp.newRichTextValue().setText("").build()]);
      } else {
        var existing = sheet
          .getRange(procStart + i, watchIndex)
          .getRichTextValue();
        richArray.push([
          existing || SpreadsheetApp.newRichTextValue().setText("").build(),
        ]);
      }
    }

    sheet
      .getRange(procStart, watchIndex, numRows, 1)
      .setRichTextValues(richArray);
  },

  /**
   *  Setea el correo de la session activa en una celda, al modificar x col
   * @param {sting} sheetName
   * @param {number} watchCol
   * @param {number} emailCol
   * @param {number} startRow
   * @param {boolean} clearOnEmpty
   * @returns
   */
  setUserEmailOnEdit: function (
    e,
    sheetName,
    watchCol,
    emailCol,
    startRow,
    clearOnEmpty,
    onlyIfEmpty,
  ) {
    if (!e || !e.range) return;

    var range = e.range;
    var sheet = range.getSheet();

    if (sheet.getName() !== sheetName) return;

    startRow = startRow || 2;

    if (typeof clearOnEmpty === "undefined") {
      clearOnEmpty = true;
    }

    if (typeof onlyIfEmpty === "undefined") {
      onlyIfEmpty = false;
    }

    var watchIndex = SheetUtils.columnToIndex(watchCol);
    var emailIndex = SheetUtils.columnToIndex(emailCol);

    var editFirstCol = range.getColumn();
    var editLastCol = editFirstCol + range.getNumColumns() - 1;

    if (watchIndex < editFirstCol || watchIndex > editLastCol) return;

    var firstRow = range.getRow();
    var lastRow = firstRow + range.getNumRows() - 1;
    var procStart = Math.max(firstRow, startRow);
    var numRows = lastRow - procStart + 1;

    if (numRows <= 0) return;

    var watchVals = sheet
      .getRange(procStart, watchIndex, numRows, 1)
      .getValues();

    var emailRange = sheet.getRange(procStart, emailIndex, numRows, 1);

    var existingEmails = emailRange.getValues();

    var out = [];

    var userEmail = "";

    try {
      userEmail = Session.getActiveUser().getEmail();
    } catch (err) {
      userEmail = "";
    }

    for (var i = 0; i < watchVals.length; i++) {
      var value = watchVals[i][0];
      var existingEmail = existingEmails[i][0];

      var hasExistingEmail =
        existingEmail !== "" &&
        existingEmail !== null &&
        existingEmail !== undefined;

      if (value !== "" && value !== null && value !== undefined) {
        if (onlyIfEmpty && hasExistingEmail) {
          out.push([existingEmail]);
        } else {
          out.push([userEmail || existingEmail || ""]);
        }
      } else {
        out.push([clearOnEmpty ? "" : existingEmail]);
      }
    }

    emailRange.setValues(out);
  },

  /**
 *
  No permite valores duplicados en una col
 * @param {string} sheetName
 * @param {number} watchCol
 * @param {number} startRow
 * @param {boolean} ignoreCase
 * @param {boolean} trimValues
 * @returns
 */

  bloquearDuplicadosEnColumnaOnEdit: function (
    e,
    sheetName,
    watchCol,
    startRow,
    ignoreCase,
    trimValues,
  ) {
    if (!e || !e.range) return true;

    var range = e.range;
    var sheet = range.getSheet();
    if (sheetName && sheet.getName() !== sheetName) return true;

    startRow = startRow || 2;
    if (ignoreCase === undefined) ignoreCase = true;
    if (trimValues === undefined) trimValues = true;

    var watchIndex = SheetUtils.columnToIndex(watchCol);

    var editFirstCol = range.getColumn();
    var editLastCol = editFirstCol + range.getNumColumns() - 1;
    if (watchIndex < editFirstCol || watchIndex > editLastCol) return true;

    var firstRow = range.getRow();
    var lastRow = firstRow + range.getNumRows() - 1;
    var procStart = Math.max(firstRow, startRow);
    if (lastRow < procStart) return true;

    var totalRows = sheet.getLastRow() - startRow + 1;
    if (totalRows <= 0) return true;

    var colValues = sheet
      .getRange(startRow, watchIndex, totalRows, 1)
      .getValues();
    var editValues = sheet
      .getRange(procStart, watchIndex, lastRow - procStart + 1, 1)
      .getValues();
    var normalizedEdited = [];
    var duplicatesToReject = {};

    function normalizeValue(v) {
      if (v === null || v === undefined || v === "") return "";
      var s = String(v);
      if (trimValues) s = s.trim();
      if (ignoreCase) s = s.toLowerCase();
      return s;
    }

    for (var i = 0; i < editValues.length; i++) {
      normalizedEdited.push(normalizeValue(editValues[i][0]));
    }

    var counts = {};
    for (var r = 0; r < colValues.length; r++) {
      var norm = normalizeValue(colValues[r][0]);
      if (!norm) continue;
      if (!counts[norm]) counts[norm] = 0;
      counts[norm]++;
    }

    for (var j = 0; j < normalizedEdited.length; j++) {
      var key = normalizedEdited[j];
      if (!key) continue;
      if (counts[key] > 1) duplicatesToReject[key] = true;
    }

    var duplicateKeys = Object.keys(duplicatesToReject);
    if (!duplicateKeys.length) return true;

    var replaceValues = [];
    for (var k = 0; k < editValues.length; k++) {
      var keyEdited = normalizedEdited[k];
      var current = editValues[k][0];

      if (!keyEdited || !duplicatesToReject[keyEdited]) {
        replaceValues.push([current]);
        continue;
      }

      var isSingleCellEdit =
        range.getNumRows() === 1 && range.getNumColumns() === 1;
      if (isSingleCellEdit && e.oldValue !== undefined) {
        replaceValues.push([e.oldValue]);
      } else {
        replaceValues.push([""]);
      }
    }

    sheet
      .getRange(procStart, watchIndex, replaceValues.length, 1)
      .setValues(replaceValues);

    var msg =
      "No se permiten duplicados en la columna " +
      watchCol +
      ". Valor duplicado eliminado.";

    try {
      SpreadsheetApp.getUi().alert(msg);
    } catch (err) {
      SpreadsheetApp.getActive().toast(msg, "Validacion", 5);
    }

    return false;
  },

  /**
   * Formatea valor como texto sin formato
   * @param {array} columnas
   * @returns
   */

  formatearComoTexto: function (e, columnas) {
    if (!e || !e.range || !columnas || !columnas.length) return;

    var rango = e.range;
    var hoja = rango.getSheet();
    var editFirstCol = rango.getColumn();
    var editLastCol = editFirstCol + rango.getNumColumns() - 1;
    var filaInicio = rango.getRow();
    var totalFilas = rango.getNumRows();

    var columnasObjetivo = columnas.map(function (c) {
      return SheetUtils.columnToIndex(c);
    });

    for (var i = 0; i < columnasObjetivo.length; i++) {
      var col = columnasObjetivo[i];
      if (col < editFirstCol || col > editLastCol) continue;

      var subRango = hoja.getRange(filaInicio, col, totalFilas, 1);
      var valoresPlano = subRango.getDisplayValues();

      subRango
        .setNumberFormat("@")
        .setValues(valoresPlano)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setFontWeight("normal")
        .setFontSize(10);
    }
  },

  parsearDuracion: function (texto) {
    if (!texto || typeof texto !== "string") return null;

    var match = texto.match(/^\s*(\d+)\s*d\s+(\d+)\s*h\s+(\d+)\s*m\s*$/i);

    if (!match) return null;

    var dias = parseInt(match[1], 10);
    var horas = parseInt(match[2], 10);
    var mins = parseInt(match[3], 10);

    return dias * 1440 + horas * 60 + mins;
  },

  actualizarTiempoTranscurridoEnColumnas: function (
    nombreHoja,
    colFecha,
    colTextoBK,
    colMinutosBL,
    filaInicio,
  ) {
    var hojaObjetivo = nombreHoja || "DATA";
    var columnaFecha = colFecha || 36;
    var columnaTexto = colTextoBK || 63;
    var columnaMinutos = colMinutosBL || 64;
    var filaInicial = filaInicio || 4;

    if (!Number.isInteger(filaInicial) || filaInicial < 1) {
      throw new Error(
        "actualizarTiempoTranscurridoEnColumnas: 'filaInicio' debe ser un entero mayor o igual a 1.",
      );
    }

    var hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(hojaObjetivo);

    if (!hoja) {
      throw new Error(
        'actualizarTiempoTranscurridoEnColumnas: no existe la hoja "' +
          hojaObjetivo +
          '".',
      );
    }

    var ultimaFila = hoja.getLastRow();

    if (ultimaFila < filaInicial) {
      return {
        filasProcesadas: 0,
      };
    }

    var numFilas = ultimaFila - filaInicial + 1;

    hoja
      .getRange(filaInicial, columnaFecha, numFilas, 1)
      .setNumberFormat("dd/MM/yyyy HH:mm:ss");

    var rangoFechas = hoja
      .getRange(filaInicial, columnaFecha, numFilas, 1)
      .getValues();
    var ahora = new Date();

    var textoBK = [];
    var minutosBL = [];

    for (var i = 0; i < rangoFechas.length; i++) {
      var raw = rangoFechas[i][0];

      if (!raw) {
        textoBK.push([""]);
        minutosBL.push([""]);
        continue;
      }

      var fecha = raw instanceof Date ? raw : new Date(raw);

      if (isNaN(fecha.getTime())) {
        textoBK.push([""]);
        minutosBL.push([""]);
        continue;
      }

      var diffMs = ahora - fecha;

      if (diffMs < 0) {
        textoBK.push([""]);
        minutosBL.push([""]);
        continue;
      }

      var dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      var horas = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      var minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      var totalMinutos = dias * 1440 + horas * 60 + minutos;

      textoBK.push([dias + "d " + horas + "h " + minutos + "m"]);
      minutosBL.push([totalMinutos]);
    }

    hoja
      .getRange(filaInicial, columnaTexto, textoBK.length, 1)
      .setValues(textoBK);
    hoja
      .getRange(filaInicial, columnaMinutos, minutosBL.length, 1)
      .setValues(minutosBL);

    return {
      filasProcesadas: numFilas,
    };
  },

  /**
   * Escribe un arreglo horizontal en una fila determinada.
   *
   * @param {string} nombreHoja
   * @param {number} fila
   * @param {string[]} encabezados
   */
  escribirFila: function (nombreHoja, fila, encabezados) {
    if (!Array.isArray(encabezados) || encabezados.length === 0) {
      throw new Error("encabezados debe ser un arreglo con datos.");
    }

    const hoja =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (!hoja) {
      throw new Error(`No existe la hoja '${nombreHoja}'.`);
    }

    hoja.getRange(fila, 1, 1, encabezados.length).setValues([encabezados]);
  },

  /**
   * Registra auditoría de modificación sobre un rango de columnas.
   *
   * Cuando se edita cualquier celda comprendida entre
   * `firstWatchCol` y `lastWatchCol`, actualiza:
   * - La fecha y hora de modificación.
   * - El correo del usuario que realizó la modificación.
   *
   * Permite auditar cambios sobre un registro completo
   * sin necesidad de monitorear cada columna por separado.
   *
   * @param {Object} e Evento recibido por el trigger onEdit.
   * @param {string} sheetName Nombre de la hoja a monitorear.
   * @param {string|number} firstWatchCol Primera columna a observar.
   * @param {string|number} lastWatchCol Última columna a observar.
   * @param {string|number} timestampCol Columna donde se registrará la fecha de modificación.
   * @param {string|number} userCol Columna donde se registrará el correo del usuario que modificó.
   * @param {number} [startRow=2] Fila mínima desde la cual comenzar a procesar.
   *
   * @returns {void}
   *
   * @example
   * SheetUtils.setAuditOnEdit(
   *   e,
   *   "STOCK",
   *   "A",
   *   "K",
   *   "O",
   *   "P",
   *   2
   * );
   */

  setAuditOnEdit: function (
    e,
    sheetName,
    firstWatchCol,
    lastWatchCol,
    timestampCol,
    userCol,
    startRow,
  ) {
    if (!e || !e.range) return;

    var range = e.range;
    var sheet = range.getSheet();

    if (sheet.getName() !== sheetName) return;

    startRow = startRow || 2;

    var firstWatchIndex = SheetUtils.columnToIndex(firstWatchCol);
    var lastWatchIndex = SheetUtils.columnToIndex(lastWatchCol);

    var timestampIndex = SheetUtils.columnToIndex(timestampCol);
    var userIndex = SheetUtils.columnToIndex(userCol);

    var editFirstCol = range.getColumn();
    var editLastCol = editFirstCol + range.getNumColumns() - 1;

    // Verifica si la edición toca alguna columna monitoreada
    if (editLastCol < firstWatchIndex || editFirstCol > lastWatchIndex) {
      return;
    }

    var firstRow = range.getRow();
    var lastRow = firstRow + range.getNumRows() - 1;

    var procStart = Math.max(firstRow, startRow);
    var numRows = lastRow - procStart + 1;

    if (numRows <= 0) return;

    var now = new Date();

    var userEmail = "";

    try {
      userEmail = Session.getActiveUser().getEmail();
    } catch (err) {
      userEmail = "";
    }

    var timestampValues = [];
    var userValues = [];

    for (var i = 0; i < numRows; i++) {
      timestampValues.push([now]);
      userValues.push([userEmail]);
    }

    sheet
      .getRange(procStart, timestampIndex, numRows, 1)
      .setValues(timestampValues);

    sheet.getRange(procStart, userIndex, numRows, 1).setValues(userValues);
  },
}; // SheetUtils
