var SheetUtils = {
  /**
   * Convierte una columna de Sheets a su índice numérico.
   * A = 1, Z = 26, AA = 27, AB = 28...
   *
   * @param {string} columna
   * @returns {number}
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

  /**
   * Limpia el contenido de un rango de datos.
   *
   * @param {string} nombreHoja Nombre de la hoja.
   * @param {number} filaInicial Fila desde la que comienza la limpieza.
   * @param {number} columnaInicial Columna inicial.
   * @param {number} [cantidadColumnas] Cantidad de columnas a limpiar.
   *                                    Si se omite, utiliza hasta la última columna con datos.
   * @param {number} [filaFinal] Última fila a limpiar.
   *                             Si se omite, utiliza la última fila con datos.
   * @returns {{filasLimpiadas:number, columnasLimpiadas:number}} Resumen de limpieza.
   */
  limpiarRangoDatos: function (
    nombreHoja,
    filaInicial,
    columnaInicial,
    cantidadColumnas,
    filaFinal,
  ) {
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
        "SheetUtils.limpiarRangoDatos: 'columnaInicial' debe ser un entero mayor o igual a 1.",
      );
    }

    if (
      cantidadColumnas !== undefined &&
      (!Number.isInteger(cantidadColumnas) || cantidadColumnas < 1)
    ) {
      throw new Error(
        "SheetUtils.limpiarRangoDatos: 'cantidadColumnas' debe ser un entero mayor o igual a 1.",
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
      throw new Error(`No existe la hoja "${nombreHoja}"`);
    }

    const ultimaFila = filaFinal || hoja.getLastRow();

    if (ultimaFila < filaInicial) {
      return {
        filasLimpiadas: 0,
        columnasLimpiadas: 0,
      };
    }

    const columnas =
      cantidadColumnas || hoja.getLastColumn() - columnaInicial + 1;

    if (columnas < 1) {
      return {
        filasLimpiadas: 0,
        columnasLimpiadas: 0,
      };
    }

    const filas = ultimaFila - filaInicial + 1;

    hoja.getRange(filaInicial, columnaInicial, filas, columnas).clearContent();

    return {
      filasLimpiadas: filas,
      columnasLimpiadas: columnas,
    };
  },
};

function setTimestampOnEdit(
  e,
  sheetName,
  watchCol,
  stampCol,
  startRow,
  clearStampOnEmpty,
) {
  if (!e || !e.range) return;
  var range = e.range;
  var sheet = range.getSheet();
  if (sheet.getName() !== sheetName) return;

  startRow = startRow || 2;
  if (clearStampOnEmpty === undefined) clearStampOnEmpty = true;

  var watchIndex =
    typeof watchCol === "number" ? watchCol : columnToIndex(watchCol);
  var stampIndex =
    typeof stampCol === "number" ? stampCol : columnToIndex(stampCol);

  var editFirstCol = range.getColumn();
  var editLastCol = editFirstCol + range.getNumColumns() - 1;
  if (watchIndex < editFirstCol || watchIndex > editLastCol) return;

  var firstRow = range.getRow();
  var lastRow = firstRow + range.getNumRows() - 1;
  var procStart = Math.max(firstRow, startRow);
  var numRows = lastRow - procStart + 1;
  if (numRows <= 0) return;

  var watchVals = sheet.getRange(procStart, watchIndex, numRows, 1).getValues();
  var stampRange = sheet.getRange(procStart, stampIndex, numRows, 1);
  var existingStamps = stampRange.getValues();
  var stampValues = [];
  var now = new Date();

  for (var i = 0; i < watchVals.length; i++) {
    var v = watchVals[i][0];
    if (v !== "" && v !== null) {
      stampValues.push([now]);
    } else {
      stampValues.push([clearStampOnEmpty ? "" : existingStamps[i][0]]);
    }
  }

  stampRange.setValues(stampValues);
}

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
function setHyperlinkInSameCellOnEdit(
  e,
  sheetName,
  watchCol,
  startRow,
  urlBase,
  clearOnEmpty,
) {
  if (!e || !e.range) return;
  var range = e.range;
  var sheet = range.getSheet();
  if (sheet.getName() !== sheetName) return;

  startRow = startRow || 2;
  if (clearOnEmpty === undefined) clearOnEmpty = true;

  var watchIndex =
    typeof watchCol === "number" ? watchCol : columnToIndex(watchCol);

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
}

/**
 *  Setea el correo de la session activa en una celda, al modificar x col
 * @param {sting} sheetName
 * @param {number} watchCol
 * @param {number} emailCol
 * @param {number} startRow
 * @param {boolean} clearOnEmpty
 * @returns
 */
function setUserEmailOnEdit(
  e,
  sheetName,
  watchCol,
  emailCol,
  startRow,
  clearOnEmpty,
) {
  if (!e || !e.range) return;
  var range = e.range;
  var sheet = range.getSheet();
  if (sheet.getName() !== sheetName) return;

  startRow = startRow || 2;
  if (typeof clearOnEmpty === "undefined") clearOnEmpty = true;

  var watchIndex =
    typeof watchCol === "number" ? watchCol : columnToIndex(watchCol);
  var emailIndex =
    typeof emailCol === "number" ? emailCol : columnToIndex(emailCol);

  var editFirstCol = range.getColumn();
  var editLastCol = editFirstCol + range.getNumColumns() - 1;
  if (watchIndex < editFirstCol || watchIndex > editLastCol) return;

  var firstRow = range.getRow();
  var lastRow = firstRow + range.getNumRows() - 1;
  var procStart = Math.max(firstRow, startRow);
  var numRows = lastRow - procStart + 1;
  if (numRows <= 0) return;

  var watchVals = sheet.getRange(procStart, watchIndex, numRows, 1).getValues();
  var existingEmails = sheet
    .getRange(procStart, emailIndex, numRows, 1)
    .getValues();
  var out = [];

  var userEmail = "";
  try {
    userEmail = Session.getActiveUser().getEmail();
  } catch (err) {
    userEmail = "";
  }

  for (var i = 0; i < watchVals.length; i++) {
    var val = watchVals[i][0];
    if (val !== "" && val !== null && val !== undefined) {
      out.push([userEmail || existingEmails[i][0] || ""]);
    } else {
      out.push([clearOnEmpty ? "" : existingEmails[i][0]]);
    }
  }

  sheet.getRange(procStart, emailIndex, numRows, 1).setValues(out);
}

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

function bloquearDuplicadosEnColumnaOnEdit(
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

  var watchIndex =
    typeof watchCol === "number" ? watchCol : columnToIndex(watchCol);

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
}

function columnToIndex(col) {
  if (typeof col === "number") return col;
  return SheetUtils.columnaIndice(String(col));
}

/**
 * Formatea valor como texto sin formato
 * @param {array} columnas
 * @returns
 */

function formatearComoTexto(e, columnas) {
  if (!e || !e.range || !columnas || !columnas.length) return;

  var rango = e.range;
  var hoja = rango.getSheet();
  var editFirstCol = rango.getColumn();
  var editLastCol = editFirstCol + rango.getNumColumns() - 1;
  var filaInicio = rango.getRow();
  var totalFilas = rango.getNumRows();

  var columnasObjetivo = columnas.map(function (c) {
    return typeof c === "number" ? c : columnaAIndice(String(c).toUpperCase());
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
}

function aplicarFormatoColumna(e, columnas) {
  formatearComoTexto(e, columnas);
}

function columnaAIndice(columna) {
  return columnToIndex(columna);
}
