function Board() {
}


Board.prototype.newBoard = function () {
    var colsArray = [null, null, null, null, null, null, null, null, null];

    var board = [
                  { index: 0, cols: colsArray }, { index: 1, cols: colsArray }, { index: 2, cols: colsArray }
                  , { index: 3, cols: colsArray },
                  { index: 4, cols: colsArray }, { index: 5, cols: colsArray }, { index: 6, cols: colsArray },
                  { index: 7, cols: colsArray }, { index: 8, cols: colsArray }
    ];


    return (board);
}



Board.prototype.getNumberInColumn = function (dashboard, col, row, ficha) {
    var numInColumn = 0;

    for (var rowOffset = Math.min(row + 3, dashboard.length - 1) ; rowOffset >= row; rowOffset--) {
        if (dashboard[rowOffset].cols[col] == ficha) {
            numInColumn += 1;
        } else {
            if (dashboard[rowOffset].cols[col] != null) {
                numInColumn = 0;
            }
        }
    }

    return (numInColumn);
}



Board.prototype.isAHollowInRow = function (dashboard, col, row, ficha) {
    if (col == 0 || col == (dashboard.length - 1)) return (false);
    if (dashboard[row].cols[col] == null) {
        if ((dashboard[row].cols[col - 1] == ficha) && (dashboard[row].cols[col + 1] == ficha)) return (true);
    }

    return (false);
}

Board.prototype.getNumberOnRight = function (dashboard, col, row, ficha) {
    var numInRow = 0;

    if (row < 0) return 0;
    if ((col + 1) < dashboard.length && dashboard[row].cols[col + 1] != ficha) return 0;

    for (var colOffset = col + 1; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            return numInRow;
        }
    }

    return (numInRow);
}


Board.prototype.getNumAvilablesOnRight = function (dashboard, col, row, ficha, fichaRival) {
    var numGaps = 0;

    if (row < 0 || col + 1 >= dashboard.length - 1) return 0;
    if ((col + 1) < dashboard.length && (dashboard[row].cols[col + 1] == 'M' || dashboard[row].cols[col + 1] == fichaRival)) return 0;

    for (var colOffset = col + 1; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha
            || dashboard[row].cols[colOffset] == null || dashboard[row].cols[colOffset] == 'B') {
            numGaps += 1;
        } else {
            return numGaps;
        }
    }

    return (numGaps);
}

Board.prototype.getNumberOnLeft = function (dashboard, col, row, ficha) {
    var numInRow = 0;

    if (row < 0) return 0;
    if ((col - 1) >= 0 && dashboard[row].cols[col - 1] != ficha) return 0;

    for (var colOffset = col - 1; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            return numInRow;
        }
    }

    return (numInRow);
}

Board.prototype.getNumAvilablesOnLeft = function (dashboard, col, row, ficha, fichaRival) {
    var numGaps = 0;

    if (row < 0 || col == 0) return 0;
    if ((col - 1) >= 0 && (dashboard[row].cols[col - 1] == 'M' || dashboard[row].cols[col - 1] == fichaRival)) return 0;

    for (var colOffset = col - 1; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha
            || dashboard[row].cols[colOffset] == null || dashboard[row].cols[colOffset] == 'B') {
            numGaps += 1;
        } else {
            return numGaps;
        }
    }

    return (numGaps);
}

Board.prototype.getNumberInDiagonalUpRight = function (dashboard, col, row, ficha, returnIfGap) {
    var numInRow = 0;
    var maxNumInRow = 0;
    if (row < 0) return 0;


    if (typeof (returnIfGap) === 'undefined' || returnIfGap == null) {
        returnIfGap = true;
    }

    if (returnIfGap) {
        if ((col + 1) < dashboard.length && (row - 1) >= 0 && dashboard[row - 1].cols[col + 1] != ficha) return 0;
    } else {
        if ((col + 1) < dashboard.length && (row - 1) >= 0 && dashboard[row - 1].cols[col + 1] == 'M') return 0;
    }

    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else if (returnIfGap) {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row--;
        if (row < 0) return (maxNumInRow);
    }

    return (maxNumInRow);
}



Board.prototype.getNumberAvailablesInDiagonalUpRight = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    if (row < 0) return 0;

    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1); colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha || dashboard[row].cols[colOffset] == null) {
            numInRow += 1;
        } else {
            return numInRow;
        }
        row--;
        if (row < 0) return (numInRow);
    }

    return (numInRow);
}



Board.prototype.getNumberInDiagonalDownRight = function (dashboard, col, row, ficha, returnIfGap) {
    var numInRow = 0;
    var maxNumInRow = 0;
    if (row < 0 || row >= dashboard.length || col < 0) return 0;

    if (typeof (returnIfGap) === 'undefined' || returnIfGap == null) {
        returnIfGap = true;
    }

    if (returnIfGap) {
        if ((col + 1) < dashboard.length && (row + 1) < dashboard.length && dashboard[row + 1].cols[col + 1] != ficha) return 0;
    } else {
        if ((col + 1) < dashboard.length && (row + 1) < dashboard.length && dashboard[row + 1].cols[col + 1] == 'M') return 0;
    }

    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else if (returnIfGap) {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row++;
        if (row >= (dashboard.length)) return (maxNumInRow);
    }

    return (maxNumInRow);
}


Board.prototype.getNumberAvailablesInDiagonalDownRight = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    if (row < 0 || row >= dashboard.length || col < 0) return 0;

    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1); colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha || dashboard[row].cols[colOffset] == null) {
            numInRow += 1;
        } else {
            return numInRow;
        }


        row++;
        if (row >= (dashboard.length)) return (numInRow);
    }

    return (numInRow);
}



Board.prototype.getNumberInDiagonalUpLeft = function (dashboard, col, row, ficha, returnIfGap) {
    var numInRow = 0;
    var maxNumInRow = 0;
    if (row < 0) return 0;

    if (typeof (returnIfGap) === 'undefined' || returnIfGap == null) {
        returnIfGap = true;
    }

    if (returnIfGap) {
        if ((col - 1) >= 0 && (row - 1) >= 0 && dashboard[row - 1].cols[col - 1] != ficha) return 0;
    } else {
        if ((col - 1) >= 0 && (row - 1) >= 0 && dashboard[row - 1].cols[col - 1] == 'M') return 0;
    }

    for (var colOffset = col; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else if (returnIfGap) {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row--;
        if (row < 0) return (maxNumInRow);
    }

    return (maxNumInRow);
}


Board.prototype.getNumberAvailablesInDiagonalUpLeft = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    if (row < 0) return 0;

    for (var colOffset = col; colOffset >= Math.max(col - 3, 0); colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha || dashboard[row].cols[colOffset] == null) {
            numInRow += 1;
        } else {
            return numInRow;
        }
     
        row--;
        if (row < 0) return (numInRow);
    }

    return (numInRow);
}

Board.prototype.getNumberInDiagonalDownLeft = function (dashboard, col, row, ficha, returnIfGap) {
    var numInRow = 0;
    var maxNumInRow = 0;
    if (row < 0 || row >= dashboard.length || col < 0) return 0;

    if (typeof (returnIfGap) === 'undefined' || returnIfGap == null) {
        returnIfGap = true;
    }

    if (returnIfGap) {
        if ((col - 1) >= 0 && (row + 1) < dashboard.length && dashboard[row + 1].cols[col - 1] != ficha) return 0;
    } else {
        if ((col - 1) >= 0 && (row + 1) < dashboard.length && dashboard[row + 1].cols[col - 1] == 'M') return 0;
    }

    for (var colOffset = col; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else if (returnIfGap) {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row++;
        if (row >= (dashboard.length)) return (maxNumInRow);
    }

    return (maxNumInRow);
}



Board.prototype.getNumberAvailablesInDiagonalDownLeft = function (dashboard, col, row, ficha) {
    var numInRow = 0;

    if (row < 0 || row >= dashboard.length || col < 0) return 0;

    for (var colOffset = col; colOffset >= Math.max(col - 3, 0); colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha || dashboard[row].cols[colOffset] == null) {
            numInRow += 1;
        } else {
            return numInRow;
        }
     
        row++;
        if (row >= (dashboard.length)) return (numInRow);
    }

    return (numInRow);
}



Board.prototype.checkItemsFree = function (dashboard) {
    for (var row = 0; row <= (dashboard.length - 1) ; row++) {
        for (var col = 0; col <= (dashboard[row].cols.length - 1) ; col++) {
            if (dashboard[row].cols[col] == null) {
                return (true);
            }
        }
    }

    return (false);
}

Board.prototype.getLastRowFree = function (dashboard, column) {
    var lastRowFree = -1;

    for (var i = 0; i <= (dashboard.length - 1) ; i++) {
        if (dashboard[i].cols[column] == null) {
            lastRowFree = i;
        }
    }

    return (lastRowFree);
}

Board.prototype.fullRow = function (dashboard, row) {
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        if (dashboard[row].cols[col] == null) {
            return false;
        }
    }

    return true;
}


Board.prototype.thereIsBomb = function (dashboard, column, row) {
    return (row + 1 < dashboard.length && dashboard[row + 1].cols[column] == 'B');
}



