
//IA 2.0
//1. Winner throw
//2. Defense 3 in row: Column, row, diagonal
//3. Smart attack (if not danger)
//4. Advance defense (to avoid check mate)
//5. Defense hollow (if not danger). 15% of times 
//6. Defense patterns. 

        //6.0 find column that covers Possible line in diagonal
        //6.1  GAPpattern    
        //          0   0
        //          -   -
        //6.2  PatternSquare


//7. Attack wit GAPPattern.

//8. Defense 2 in a row (if not danger). 50% of times.

//9. Attack with check.

//10. Last check throw. 
// Find this pattern: X..X. This way the empty will be also check.
// Attack with three in a row (if not danger)
// Random throw, but avoid edges, dangerours throws and unusefull throws.

function IA2(_mode, high) {
    var self = this;
    this.getName = function() { return 'IA2 ' +  (high ? 'high' : 'low') + ' mode ' + this.getMode(); };

    var mode = _mode; // {blast4, classic}
    this.getMode = function () { return mode; }

    this.checkBombsOn = function () { return self.getMode() == 'blast4'; }
    this.checkFullRowOn = function () { return self.getMode() == 'blast4'; }


    //if high parameter is true. 
    //IA also will store each match a list of cols in check, 
    // and will wait user throws in that column.
    this.isHighLevelOn = function () { return high; }
    var lstColsInCheck = [];
    this.getLstColsInCheck = function () { return lstColsInCheck; }
 
    this.isColInCheck = function (col) {
        for (var i = 0; i < lstColsInCheck.length; i++) {
            if (lstColsInCheck[i] == col) return true;
        }

        return false;
    };
    this.addColInCheck = function (col) {
        if (self.isColInCheck(col)) return;
        lstColsInCheck.push(col);
    }
    this.removeColInCheck = function (col) {
        for (var i = lstColsInCheck.length - 1; i >= 0; i--) {
            if (lstColsInCheck[i] === col) {
                lstColsInCheck.splice(i, 1);
                return;
            }
        }
    }
}


IA2.prototype.nextComputerThrow = function (dashboard) {
    window.log("IA 2.0 throw..");

    var self = this;
    window.log('cols in check : ' + self.getLstColsInCheck());

    var randNumber = (Math.floor(Math.random() * 21));


    //1. Winner throw
    var threeInRow = false;
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            //match if it's a winner throw: check if there are three in a row: column, left, or right
            threeInRow = (Math.max(board.getNumberInColumn(dashboard, col, rowFree + 1, "X"),
                                        board.getNumberOnLeft(dashboard, col, rowFree, "X") + board.getNumberOnRight(dashboard, col, rowFree, "X"),
                                        board.getNumberInDiagonalUpRight(dashboard, col, rowFree, "X") + board.getNumberInDiagonalDownLeft(dashboard, col, rowFree, "X"),
                                        board.getNumberInDiagonalUpLeft(dashboard, col, rowFree, "X") + board.getNumberInDiagonalDownRight(dashboard, col, rowFree, "X")
                                   ) >= 3);

            if (threeInRow) {
                var self = this;
                var checkFullRow = function () {
                    this.getFullRow = function () {
                        window.log('checkFullRowOn ' + self.checkFullRowOn());
                        if (!self.checkFullRowOn()) return false;
                        for (var iCol = 0; iCol <= dashboard.length - 1; iCol++) {
                            if (iCol != col && dashboard[rowFree].cols[iCol] == null) {
                                return false;
                            }
                        }

                        window.log('1. Winner throw, col  ' + col + '. Its not ok because fullrow');
                        return true;
                    }
                }

                var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboard, col, rowFree);

                if (!thereIsBomb) {
                    window.log('1. Winner throw, col ' + col);
                    var fullRow = new checkFullRow();
                    if (!fullRow.getFullRow()) {
                        return col;
                    }
                }
             }
        }
    }



    // ***************************************************
    //2. Defense 3 in row

    //defense 3 columns in a row
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            //defense column
            var numInColumn = board.getNumberInColumn(dashboard, col, rowFree + 1, "O");
            if (numInColumn >= 3) {
                window.log("2. Defense column with 3 in a row. defense column");
                return (col);
            }
        }
    }


    //defense 3 rows in a row 
    //window.log('checking defense row');
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            var numOnRight = board.getNumberOnRight(dashboard, col, rowFree, "O");
            var numOnLeft = board.getNumberOnLeft(dashboard, col, rowFree, "O");
            if (numOnRight + numOnLeft >= 3) {
                var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboard, col, rowFree);
                if (!thereIsBomb) { 
                    window.log("2. Defense row with 3 in a row. defense row");
                    return (col);
                }
            }
        }
    }


    //defense 3 diagonals in a row
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            //window.log('checking defense diagonal');
            if (board.getNumberInDiagonalUpRight(dashboard, col, rowFree, "O")
                    + board.getNumberInDiagonalDownLeft(dashboard, col, rowFree, "O") >= 3) {
                var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                if (!thereIsBomb) {
                    window.log('defense 3 diagonals in a row');
                    return (col);
                }
			}
			
            if (board.getNumberInDiagonalUpLeft(dashboard, col, rowFree, "O")
                    + board.getNumberInDiagonalDownRight(dashboard, col, rowFree, "O") >= 3) {
                var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboard, col, rowFree);
                if (!thereIsBomb) {
                    window.log('defense 3 diagonals in a row');
                    return (col);
                }
            }
        }
    }
    //*************

 
    //3. Smart attack
    //Throw that ensures victory in next throw
    var smartAttackColumn = this.SmartAttack(dashboard);
    if (smartAttackColumn != null) {
        var rowFree = board.getLastRowFree(dashboard, smartAttackColumn);
        var dangerousThrow = this.IsDangerousThrow(dashboard, smartAttackColumn, rowFree);
        if (!dangerousThrow) {
            var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboard, smartAttackColumn, rowFree);
            if (!thereIsBomb) { 
                window.log("3. Smart attack");
                return smartAttackColumn;
            }
        }
    }


    //*************************
    //4. Advance defense
    var columnDefenseCheckMate = this.ColumnToAvoidCheckMate(dashboard);
    if (columnDefenseCheckMate != null) {
        var rowFree = board.getLastRowFree(dashboard, columnDefenseCheckMate);
        window.log('4. Advance defense. Defense check mate throw ' + columnDefenseCheckMate);
        return columnDefenseCheckMate;
    }

    var columnSmartDefense = this.getSmartDefensiveThrow(dashboard);
    if (columnSmartDefense != null) {
        var rowFree = board.getLastRowFree(dashboard, columnSmartDefense);
        window.log('4. Advance defense. DeepDefense throw ' + columnSmartDefense);
        return columnSmartDefense;
    }
    //*************************



    //**************************
    //5. defense hollow in row. 15% of times 
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            if (board.isAHollowInRow(dashboard, col, rowFree, "O")) {

                var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                if (!dangerousThrow) {
                    var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                    
                    var numAvailables =  board.getNumAvilablesOnLeft(dashboard, col, rowFree, 'O', 'X')
                                            + board.getNumAvilablesOnRight(dashboard, col, rowFree, 'O', 'X')

                    if (numAvailables>=4 && (!thereIsBomb || (!this.isHighLevelOn() && randNumber < 2))) {
                        window.log('4. defense hollow in row');
                        return (col)
                    }
                }
            };
        }
    }


    //****************************



   
    //*******************************************************************
    //6. Defense Patterns

    //6.0 find column that covers Possible line in diagonal
    for (var col = 0; col <= (dashboard.length - 1); col++) {
        var rowFree = board.getLastRowFree(dashboard, col);
       
        var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
        if (dangerousThrow) continue;

        if (this.isHighLevelOn() && this.ColumnThatCoversPossibleLine4InDiagonal(dashboard, col, rowFree)) {
            window.log('6. Cover possible Line4 in Diagonal. column ' + col);
            return col;
        };
    }


    // 6.1 GapPattern
    // 88% of times. 100% of times in High Level
    if (randNumber > 2 || this.isHighLevelOn()) {
        var GAPpattern = false;
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            var rowFree = board.getLastRowFree(dashboard, col);

            var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
            if (dangerousThrow) continue;

            if (rowFree >= 2 && rowFree < dashboard.length - 1 && dashboard[rowFree + 1].cols[col] != 'B') {

                if ((col + 2) <= (dashboard.length - 1)
                    && (dashboard[rowFree + 1].cols[col + 1] == 'B' || dashboard[rowFree + 1].cols[col + 1] == null)
                    && (dashboard[rowFree].cols[col + 2] == 'O')
                    && (
                        board.getNumAvilablesOnRight(dashboard, col, rowFree, 'O', 'X') >= 2
                        || board.getNumAvilablesOnLeft(dashboard, col, rowFree, 'O', 'X') >= 1
                       )
                 ) {
                    window.log('6. Defense GAPPattern right found');
                    return col;
                }


                if ((col + 3) <= (dashboard.length - 1)
                    && dashboard[rowFree].cols[col + 1] == 'O'
                    && (dashboard[rowFree + 1].cols[col + 2] == 'B' || dashboard[rowFree + 1].cols[col + 2] == null)
                    && (dashboard[rowFree].cols[col + 3] == 'O' || (dashboard[rowFree].cols[col + 3] == null))
                ) {
                    window.log('6. Defense GAPPattern right found (offtset 2)');
                    return col;
                }


                if ((col - 2) >= 0
                    && (dashboard[rowFree + 1].cols[col - 1] == 'B' || dashboard[rowFree + 1].cols[col - 1] == null)
                    && (dashboard[rowFree].cols[col - 2] == 'O')
                     && (
                        board.getNumAvilablesOnRight(dashboard, col, rowFree, 'O', 'X') >= 1
                        || board.getNumAvilablesOnLeft(dashboard, col, rowFree, 'O', 'X') >= 2
                       )
                    ) {
                    window.log('6. Defense GAPPattern left found');
                    return col;
                }

                if ((col - 3) >= 0
                    && dashboard[rowFree].cols[col - 1] == 'O'
                    && (dashboard[rowFree + 1].cols[col - 2] == 'B' || dashboard[rowFree + 1].cols[col - 2] == null)
                    && (dashboard[rowFree].cols[col - 3] == 'O' || (dashboard[rowFree].cols[col - 3] == null))
                ) {
                    window.log('6. Defense GAPPatern left (offtset 2)');
                    return col;
                }

            }
        }

        //Avoid OOO and gap below
        for (var col = 0; col <= (dashboard.length - 1); col++) {
            rowFree = board.getLastRowFree(dashboard, col);
            if (rowFree != -1 && rowFree < dashboard.length - 1) {
                var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                if (dangerousThrow) continue;

                var numOnRight = board.getNumberOnRight(dashboard, col, rowFree, "O");

                if (numOnRight >= 2) {
                    if ((col + 1) <= dashboard.length - 1 && dashboard[rowFree + 1].cols[col + 1] == null) {
                        window.log('6. defense 3 in a row with GAP below/right 2');
                        return (col);
                    }

                    if ((col - 1) >=0 && dashboard[rowFree + 1].cols[col - 1] == null) {
                        window.log('6. defense 3 in a row with GAP below/right 2');
                        return (col);
                    }
                }

                var numOnLeft = board.getNumAvilablesOnLeft(dashboard, col, rowFree, "O");
                if (numOnLeft >= 2) {
                    if ((col - 1) >= 0 && dashboard[rowFree + 1].cols[col + 1] == null) {
                        window.log('6. defense 3 in a row with GAP below/left');
                        return (col);
                    }
                }

            }
        }

    }



    //6.2. Defense PatternSquare. From row 3
    //          00
    //          00
    var PatternSquare = false;
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);

        var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
        if (dangerousThrow) continue;

        if (rowFree > 3 && rowFree < dashboard.length - 1) {
            if (col + 1 <= dashboard.length - 1) {
                PatternSquare = (dashboard[rowFree].cols[col +1 ] == 'O' || dashboard[rowFree].cols[col + 1] == null)
                           && dashboard[rowFree + 1].cols[col] == 'O'
                           && dashboard[rowFree + 1].cols[col + 1] == 'O';

                if (PatternSquare) {
                    window.log('6. Defense PatternSquare found');
                    return col;
                }
            }

            if (col - 1 >= 0) {
                PatternSquare = (dashboard[rowFree].cols[col - 1] == 'O' || dashboard[rowFree].cols[col -1] == null)
                           && dashboard[rowFree + 1].cols[col] == 'O'
                           && dashboard[rowFree + 1].cols[col - 1] == 'O';

                if (PatternSquare) {
                    window.log('6. Defense PatternSquare found');
                    return col;
                }
            }
        }
    }


    // *******************************************************************************************
    //7. Attack with GAPPattern. From row 2
    var GAPpatternAttack = false;
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);

        var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
        if (dangerousThrow) continue;


        if (rowFree >= 2 && rowFree < dashboard.length - 1 && dashboard[rowFree + 1].cols[col] != 'B') {

            if ((col + 2) <= (dashboard.length - 1)
                && (dashboard[rowFree + 1].cols[col + 1] == 'B' || dashboard[rowFree + 1].cols[col + 1] == null)
                && (dashboard[rowFree].cols[col + 2] == 'X')
                && (
                    board.getNumAvilablesOnRight(dashboard, col, rowFree, 'X', 'O') >= 2
                    || board.getNumAvilablesOnLeft(dashboard, col, rowFree, 'X', 'O') >= 1
                   )
             ) {
                window.log('7. Attack with GAPPattern right');

                var numInRow = board.getNumAvilablesOnRight(dashboard, col, rowFree, "X", "0")
                    + board.getNumAvilablesOnLeft(dashboard, col, rowFree, "X", "0");
                if (numInRow >= 2) {
                    self.addColInCheck(col + 1);
                    //window.log('I got the column ' + (col + 1));
                }
                GAPpatternAttack = true;
            }

            if ((col + 3) <= (dashboard.length - 1)
                && (dashboard[rowFree + 1].cols[col + 2] == 'B' || dashboard[rowFree + 1].cols[col + 2] == null)
                && (dashboard[rowFree].cols[col + 3] == 'X')
             ) {
                window.log('7. Attack with GAPPattern right (offtset 2)');

                var numInRow = board.getNumAvilablesOnRight(dashboard, col, rowFree, "X", "0")
                                     + board.getNumAvilablesOnLeft(dashboard, col, rowFree, "X", "0");
                if (numInRow >= 2) {
                    self.addColInCheck(col + 2);
                    //window.log('I got the column ' + (col + 2));
                }
                GAPpatternAttack = true;
            }


            if ((col - 2) >= 0
                && (dashboard[rowFree + 1].cols[col - 1] == 'B' || dashboard[rowFree + 1].cols[col - 1] == null)
                && (dashboard[rowFree].cols[col - 2] == 'X')
                 && (
                    board.getNumAvilablesOnRight(dashboard, col, rowFree, 'X', 'O') >= 1
                    || board.getNumAvilablesOnLeft(dashboard, col, rowFree, 'X', 'O') >= 2
                   )
                ) {
                window.log('7. Attack with GAPPattern left');

                var numInRow = board.getNumAvilablesOnRight(dashboard, col, rowFree, "X", "0")
                    + board.getNumAvilablesOnLeft(dashboard, col, rowFree, "X", "0");
                if (numInRow >= 2) {
                    self.addColInCheck(col - 1);
                    //window.log('I got the column ' + (col - 1));
                }
                GAPpatternAttack = true;
            }

            if ((col - 3) >= 0
                && (dashboard[rowFree + 1].cols[col - 2] == 'B' || dashboard[rowFree + 1].cols[col - 2] == null)
                && (dashboard[rowFree].cols[col - 3] == 'X')
            ) {
                window.log('7. Attack with GAPPattern left (offtset 2)');

                var numInRow = board.getNumAvilablesOnRight(dashboard, col, rowFree, "X", "0")
                                     + board.getNumAvilablesOnLeft(dashboard, col, rowFree, "X", "0");
                if (numInRow >= 2) {
                    self.addColInCheck(col - 2);
                    //window.log('I got the column ' + (col - 2));
                }
                GAPpatternAttack = true;
            }

            if (GAPpatternAttack) return col;
        }
    }




    //*************************
    //8. Attack with check (40% of times)
    if (randNumber > 12) {
        var colCheck = this.checkThrow(dashboard);
        if (colCheck != null) {
           var rowFree = board.getLastRowFree(dashboard, colCheck);
           var dangerousThrow = this.IsDangerousThrow(dashboard, colCheck, rowFree);
           if (!dangerousThrow) {
               var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboard, colCheck, rowFree);
               //If it's a vertical check, avoid it 80% of times, because is very easy to see it.
               var numInCol = board.getNumberInColumn(dashboard, colCheck, rowFree + 1, "X");
               var avoidCheckInCol = (numInCol >= 2 && randNumber >= 6);

               var isColInCheck = self.isColInCheck(colCheck);
               if (isColInCheck) {
                        window.log('8. IA2 High. Even is check, not throw, because I got the column ' + colCheck);
               }

               if (!thereIsBomb && !avoidCheckInCol && !isColInCheck) {
                    window.log('8. Attack with check. col ' + colCheck);
                    return colCheck;
               }
           }
        }
    }


    //*******************************************************
    //9. Defense 2 in a row. 50% of times
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {

            var isColInCheck = self.isHighLevelOn() && self.isColInCheck(colCheck);
            if (isColInCheck) continue;

            //defense row
            if (dashboard[rowFree].cols[col + 1] == "O") {
                var numOnRight = board.getNumberOnRight(dashboard, col, rowFree, "O");
                //window.log('defense row. right on col ' + col + ' equal to ' + numOnRight);
                if (numOnRight >= 2) {
                    var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                    var facilitatesDiagonals = this.FacilitatesDiagonals(dashboard, col, rowFree);
                    if (numOnRight == 2 && !dangerousThrow && !facilitatesDiagonals && randNumber > 5) {
                        //window.log('9. defense 2 in a row');
                        return (col);
                    }
                }
            }

            var numOnLeft = board.getNumberOnLeft(dashboard, col, rowFree, "O");
            if (numOnLeft >= 2) {
                var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                var facilitatesDiagonals = this.FacilitatesDiagonals(dashboard, col, rowFree);
                if (numOnLeft == 2 && !dangerousThrow && !facilitatesDiagonals && randNumber < 18) {
                    //window.log('9. defense 2 in a row');
                    return (col);
                }
            }
        }
    }
    //*******************************


    //*******************************
    //10. Best throw
    //window.log('10. Best throw.');
    var lstBestThrows = [];
    var lst = [];
    var colNotBandFound = -1;
	var firstColMatch = -1;
	var bestCol = -1;
	for (var col = 0; col <= (dashboard.length - 1) ; col++) {
	    rowFree = board.getLastRowFree(dashboard, col);
	    if (rowFree != -1) {

	        var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
	        //window.log('Throw in column ' + col + ' is dangerous ' + dangerousThrow);

            if (!dangerousThrow) {

                //Break bombs to create a check
                if (this.checkBombsOn()) {
                    //Find this pattern:  X[ColumnThrow][VOID|BOMB]X. This way the empty will be also check
                    //It's usefull for bast
                    if (col + 2 <= dashboard.length - 1 && col > 0) {
                        var patternX1 = dashboard[rowFree].cols[col - 1] == 'X'
                            && (dashboard[rowFree].cols[col + 1] == null || dashboard[rowFree].cols[col + 1] == 'B')
                            && dashboard[rowFree].cols[col + 2] == 'X';

                        if (patternX1) {
                            window.log('10. Best throw. check from X .. X found. pattern 1');
                            return col;
                        }
                    }

                    //Find this pattern:  X[VOID|BOMB][ColumnThrow]X. This way the empty will be also check
                    if (col + 1 <= dashboard.length - 1 && col > 1) {
                        var patternX2 = dashboard[rowFree].cols[col - 2] == 'X'
                            && (dashboard[rowFree].cols[col - 1] == null || dashboard[rowFree].cols[col - 1] == 'B')
                            && dashboard[rowFree].cols[col + 1] == 'X';

                        if (patternX2) {
                            window.log('10. Best throw. check from X .. X found.  pattern 2');
                            return col;
                        }
                    }
                }


               //find column to join two in row
	           var numOnSides = board.getNumberOnLeft(dashboard, col, rowFree, "X") + board.getNumberOnRight(dashboard, col, rowFree, "X");
	           var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
               var isColInCheck = self.isHighLevelOn() && self.isColInCheck(col);
               var facilitatesDiagonals = this.FacilitatesDiagonals(dashboard, col, rowFree);
               var stupidThrow = this.itsAStupidThrow(dashboard, col);

               if (numOnSides >= 1 && !thereIsBomb) {
                   if (numOnSides > 1 && rowFree > 0 
                                && !facilitatesDiagonals
                                && !stupidThrow && !isColInCheck) {
	                   colNotBandFound = col;
	                   lstBestThrows.push(col);
	               } else {

                       if (colNotBandFound == -1 && !stupidThrow && !facilitatesDiagonals) {
	                       colNotBandFound = col;
	                   }

                       if (!stupidThrow && !isColInCheck) {
	                       lst.push(col);
	                   }
	               }

	               if (firstColMatch == -1 || colNotBandFound == -1) firstColMatch = col;
	               continue;
               } 

	           if (!thereIsBomb) {
                   if (colNotBandFound == -1
                       && !facilitatesDiagonals
                       && !stupidThrow && !isColInCheck) {
	                   colNotBandFound = col;
	               }
	               
                   if (rowFree > 1 && col > 1 && col < 7
                        && !facilitatesDiagonals
                       && !stupidThrow && !isColInCheck) {
                       lstBestThrows.push(col);
                   } else {
                       lst.push(col);
                   }
               }

               if (firstColMatch == -1 || colNotBandFound == -1) firstColMatch = col;
	        } //!dangerousThrow
	    } // eachColumn
	}


	if (lstBestThrows.length > 0) {
	    var randFromBestThrowList = (Math.floor(Math.random() * lstBestThrows.length));
	    window.log('10. Last check throw in lstBestThrows. col ' + lstBestThrows[randFromBestThrowList]);
	    window.log(lstBestThrows);
	    return lstBestThrows[randFromBestThrowList];
	}

	if (lst.length == 0 && firstColMatch!=-1) lst.push(firstColMatch);
	
    //Not good throw found.  throw first col found
	if (lst.length == 0) {
	    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
	        rowFree = board.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                window.log('10. random throw in col ' + col);
	            return col;
	        }
	    }
	}

	//window.log(lst);
	var randFromList = (Math.floor(Math.random() * lst.length));
    window.log('10. random throw in col ' + lst[randFromList]);
    window.log('10. from list ' + lst);
	return lst[randFromList];
    //*******************************
}




IA2.prototype.checkThrowWinner = function (dashboard, col, row, ficha) {
    if (board.getNumberInColumn(dashboard, col, row, ficha) == 4) { return (true) };
    if (board.getNumberOnRight(dashboard, col, row, ficha) + board.getNumberOnLeft(dashboard, col, row, ficha) >= 3) { return (true) };

    //Diagonals
    if (board.getNumberInDiagonalUpRight(dashboard, col, row, ficha) >= 4) { return (true) };
    if (board.getNumberInDiagonalDownLeft(dashboard, col, row, ficha) >= 4) { return (true) };
    if (board.getNumberInDiagonalUpLeft(dashboard, col, row, ficha)  >= 4) { return (true) };
    if (board.getNumberInDiagonalDownRight(dashboard, col, row, ficha) >= 4) { return (true) };

    if (board.getNumberInDiagonalUpRight(dashboard, col, row , ficha)
           + board.getNumberInDiagonalDownLeft(dashboard, col , row , ficha) - 1 >= 4) { return (true) };

    if (board.getNumberInDiagonalUpLeft(dashboard, col , row , ficha)
           + board.getNumberInDiagonalDownRight(dashboard, col , row, ficha) - 1 >= 4) { return (true) };

    return (false);
}



IA2.prototype.IsDangerousThrow = function (dashboard, column, row) {
    if (column < 0) return false;
    var dangerousThrow = false;

    dangerousThrow =  board.getNumberInDiagonalUpRight(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownLeft(dashboard, column, row - 1, "O") >= 3;
    dangerousThrow = dangerousThrow || board.getNumberInDiagonalUpLeft(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownRight(dashboard, column, row - 1, "O") >= 3;
    dangerousThrow = dangerousThrow ||
                        (board.getNumberOnLeft(dashboard, column, row - 1, "O")
                           + board.getNumberOnRight(dashboard, column, row - 1, "O") >= 3);

    dangerousThrow = dangerousThrow || this.EasesACheckMate(dashboard, column, row);

    return dangerousThrow;
}

IA2.prototype.EasesACheckMate = function (dashboard, column, row) {

    if (row < 0) return false;

    var parent = this;
    var dashboardNew = dashboard.slice();
    dashboardNew[row].cols[column] = 'X';
    var possibleCheckMate = parent.IsThereACheckMate(dashboardNew);
    dashboardNew[row].cols[column] = null;
    if (possibleCheckMate) {
        //window.log('throw in column ' + column + ' is dangerous because it will eases a possible check mate. (see on message above)');
        return true;
    }

    return false;
}


IA2.prototype.ColumnThatCoversPossibleLine4InDiagonal = function (dashboard, column, row) {
    if (column < 0 || row > dashboard.length - (1 + (this.isHighLevelOn() ? 3 : 0))) {
        return false;
    }

    //window.log('ColumnThatCoversPossibleLine4InDiagonal called in column ' + column);

    var freeFourForO1 = (board.getNumberAvailablesInDiagonalDownLeft(dashboard, column, row, 'O') +
        board.getNumberAvailablesInDiagonalUpRight(dashboard, column, row, 'O') >= 3);

    var numInDiagonal1 = (board.getNumberInDiagonalDownLeft(dashboard, column, row, 'O', false) +
                                board.getNumberInDiagonalUpRight(dashboard, column, row, 'O', false)) >= 2;

    if (column == 1) {
        window.log(board.getNumberInDiagonalUpRight(dashboard, column, row, 'O', false));
    }

    var freeFourForO2 = (board.getNumberAvailablesInDiagonalDownRight(dashboard, column, row, 'O') +
        board.getNumberAvailablesInDiagonalUpLeft(dashboard, column, row, 'O') >= 3);

    var numInDiagonal2 = (board.getNumberInDiagonalDownRight(dashboard, column, row, 'O', false)
                              + board.getNumberInDiagonalUpLeft(dashboard, column, row, 'O', false)) >= 2;

    return ((freeFourForO1 && numInDiagonal1) || (freeFourForO2 && numInDiagonal2));
}


IA2.prototype.FacilitatesDiagonals = function (dashboard, column, row) {
    if (column < 0) return false;
    var facilitatesDiagonals = (column + 1 < dashboard.length && dashboard[row].cols[column + 1] == "O");
    facilitatesDiagonals = facilitatesDiagonals || (column - 1 >= 0 && dashboard.length && dashboard[row].cols[column - 1] == "O");

    facilitatesDiagonals = facilitatesDiagonals || board.getNumberInDiagonalUpRight(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownLeft(dashboard, column, row - 1, "O") >= 2;
    facilitatesDiagonals = facilitatesDiagonals || board.getNumberInDiagonalUpLeft(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownRight(dashboard, column, row - 1, "O") >= 2;

    return facilitatesDiagonals;
}

IA2.prototype.FacilitatesThreeInARow = function (dashboard, col, ficha, fichaRival) {

    var dashboardNew = dashboard.slice();
    var rowFree = board.getLastRowFree(dashboard, col);
    
    if (rowFree >0) {
        dashboardNew[rowFree].cols[col] = ficha;

        var easesThreeInRow = (Math.max(board.getNumberOnLeft(dashboardNew, col, rowFree - 1, fichaRival) + board.getNumberOnRight(dashboardNew, col, rowFree - 1, fichaRival),
                                    board.getNumberInDiagonalUpRight(dashboardNew, col, rowFree - 1, fichaRival) + board.getNumberInDiagonalDownLeft(dashboardNew, col, rowFree - 1, fichaRival),
                                    board.getNumberInDiagonalUpLeft(dashboardNew, col, rowFree - 1, fichaRival) + board.getNumberInDiagonalDownRight(dashboardNew, col, rowFree - 1, fichaRival)
                               ) >= 2);


        dashboardNew[rowFree].cols[col] = null;


        if (easesThreeInRow) {
            //window.log('throw in col ' + col + ' it is not a good idea because it facilitates three in a row');
        }
        
        return easesThreeInRow;
    }
   
    return false;
}


//Avoid check mate in the position that it will take place if user throws there.
IA2.prototype.ColumnToAvoidCheckMate = function (dashboard, log) {
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);

        if (rowFree != -1) {
            var dashboardNew = dashboard.slice();
            dashboardNew[rowFree].cols[col] = "O";

            var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboardNew, col, rowFree);

            var self = this;
            var checkFullRow = function () {
                this.getFullRow = function () {
                    if (!self.checkFullRowOn()) return false;
                    for (var iCol = 0; iCol <= dashboard.length - 1; iCol++) {
                        if (iCol != col && dashboard[rowFree].cols[iCol] == null) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            var fullRow = new checkFullRow().getFullRow();
            if (thereIsBomb || fullRow) {
                dashboardNew[rowFree].cols[col] = null;
                continue;
            }

            var dangerousThrow = this.IsDangerousThrow(dashboardNew, col, rowFree);
            //window.log(col + '. dangerousThrow ' + dangerousThrow);

            if (!dangerousThrow) {
                var self = this;
                var checkDeeper = function () {
                    var numThrowsWinnerFounds = 0;
                    for (var col2 = 0; col2 <= (dashboardNew.length - 1) ; col2++) {
                        var rowFree2 = board.getLastRowFree(dashboardNew, col2);
                        if (rowFree2 != -1) {
                            dashboardNew[rowFree2].cols[col2] = "O";

                            var throwWinnerFound = self.checkThrowWinner(dashboardNew, col2, rowFree2, "O");
                           // window.log(col2 + '.' + rowFree2);

                            var thereIsBomb2 = board.thereIsBomb(dashboardNew, col2, rowFree2);
                            var checkFullRow2 = function () {
                                this.getFullRow = function () {
                                    if (!self.checkFullRowOn()) return false;
                                    for (var iCol = 0; iCol <= dashboardNew.length - 1; iCol++) {
                                        if (iCol != col2 && dashboardNew[rowFree2].cols[iCol] == null) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            }
                            var fullRow2 = new checkFullRow2().getFullRow();
                            dashboardNew[rowFree2].cols[col2] = null;
                            numThrowsWinnerFounds += (throwWinnerFound && !thereIsBomb2 && !fullRow2 ? 1 : 0);

                            if (numThrowsWinnerFounds >= 2) {
                                dashboardNew[rowFree].cols[col] = null;
                                //window.log({ column: col, row: rowFree, desc: 'IA columnDefenseCheckMate' });
                                return col;
                            }
                        }
                    }

                    return null;
                }

                var colDefende = checkDeeper();
                if (colDefende != null) {
                    return colDefende;
                }
            }

            dashboardNew[rowFree].cols[col] = null;
        }
    }


    return null;
}


//Avoid check mate by closing 
IA2.prototype.getSmartDefensiveThrow = function (dashboard) {
    //return null;

    var rowcheckmate = 0;
    var dashboardNew = dashboard.slice();
    var isThereACheckMate = this.IsThereACheckMate(dashboardNew);
    window.log('possible check mate ' + isThereACheckMate);
    if (!isThereACheckMate) return null;

    //window.log('there is a possible checkmate');

    //Search a col NOT dangerous that avoids the check mate
    var self = this;
    var checkDeeper = function () {
        for (var col = 0; col <= (dashboardNew.length - 1) ; col++) {
            var rowFree = board.getLastRowFree(dashboardNew, col);
            if (rowFree != -1) {
                dashboardNew[rowFree].cols[col] = "X";
                var isThereACheckMate2 = self.IsThereACheckMate(dashboardNew);
                dashboardNew[rowFree].cols[col] = null;

                var dangerousThrow = self.IsDangerousThrow(dashboardNew, col, rowFree);
                if (!isThereACheckMate2 && !dangerousThrow) {
                    window.log({ column: col, row: rowFree, desc: 'GetSmartDefensiveThrow found' });
                    return col;
                }
            }
        }
        return null;
    }

    return checkDeeper();
}


//To avoid check mate from user
IA2.prototype.IsThereACheckMate = function (dashboard) {
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            var dashboardNew = dashboard.slice();
            dashboardNew[rowFree].cols[col] = "O";

            var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboardNew, col, rowFree);
            var self = this;
            var checkFullRow = function () {
                this.getFullRow = function () {
                    if (!self.checkFullRowOn()) return;
                    for (var iCol = 0; iCol <= dashboard.length - 1; iCol++) {
                        if (iCol != col && dashboard[rowFree].cols[iCol] == null) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            var fullRow = new checkFullRow().getFullRow();

            if (thereIsBomb || fullRow) {
                dashboardNew[rowFree].cols[col] = null;
                continue;
            }

            var numThrowsWinnerFounds = 0;
            for (var col2 = 0; col2 <= (dashboardNew.length - 1) ; col2++) {
                var rowFree2 = board.getLastRowFree(dashboardNew, col2);
                if (rowFree2 != -1) {
                    dashboardNew[rowFree2].cols[col2] = "O";

                    var throwWinnerFound = this.checkThrowWinner(dashboardNew, col2, rowFree2, "O");
                    var thereIsBomb2 = this.checkBombsOn() && board.thereIsBomb(dashboardNew, col2, rowFree2);

                    var self = this;
                    var checkFullRow2 = function () {
                        this.getFullRow = function () {
                            if (!self.checkFullRowOn()) return false;
                            for (var iCol = 0; iCol <= dashboardNew.length - 1; iCol++) {
                                if (iCol != col2 && dashboardNew[rowFree2].cols[iCol] == null) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    }
                    var fullRow2 = new checkFullRow2().getFullRow();
                    dashboardNew[rowFree2].cols[col2] = null;
                    numThrowsWinnerFounds += (throwWinnerFound && !thereIsBomb2 && !fullRow2 ? 1 : 0);

                    if (numThrowsWinnerFounds >= 2) {
                        dashboardNew[rowFree].cols[col] = null;
                        //window.log({ column: col, row: rowFree, desc: 'IA IsThereACheckMate is TRUE' });
                        return true;
                    }
                }
            }

            dashboardNew[rowFree].cols[col] = null;
        }
    }

    return false;
}



//Finds check
IA2.prototype.checkThrow = function (dashboard) {
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            var dashboardNew = dashboard.slice();
            dashboardNew[rowFree].cols[col] = "X";

            var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboardNew, col, rowFree);

            var self = this;
            var checkFullRow = function () {
                this.getFullRow = function () {
                    if (!self.checkFullRowOn()) return;
                    for (var iCol = 0; iCol <= dashboard.length - 1; iCol++) {
                        if (iCol != col && dashboard[rowFree].cols[iCol] == null) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            var fullRow = new checkFullRow().getFullRow();

            var fullRow = board.fullRow(dashboardNew, col, rowFree);
            if (thereIsBomb || fullRow) {
                dashboardNew[rowFree].cols[col] = null;
                continue;
            }

            for (var col2 = 0; col2 <= (dashboardNew.length - 1) ; col2++) {
                var rowFree2 = board.getLastRowFree(dashboardNew, col2);
                if (rowFree2 != -1) {
                    dashboardNew[rowFree2].cols[col2] = "X";
                    var throwWinnerFound = this.checkThrowWinner(dashboardNew, col2, rowFree2, "X");
                    var thereIsBomb2 = board.thereIsBomb(dashboardNew, col2, rowFree2);

                    var self = this;
                    var checkFullRow2 = function () {
                        this.getFullRow = function () {
                            if (!self.checkFullRowOn()) return false;
                            for (var iCol = 0; iCol <= dashboardNew.length - 1; iCol++) {
                                if (iCol != col2 && dashboardNew[rowFree2].cols[iCol] == null) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    }
                    var fullRow2 = new checkFullRow2().getFullRow();
                    if (throwWinnerFound && !thereIsBomb2 && !fullRow2) {
                        dashboardNew[rowFree].cols[col] = null;
                        window.log('check throw found at ' + col);
                        //window.log({ column: col, row: rowFree });
                        return col;
                    }

                    dashboardNew[rowFree2].cols[col2] = null;
                }
            }

            dashboardNew[rowFree].cols[col] = null;
        }
    }

    return null;
}


//Finds a check mate to win
IA2.prototype.SmartAttack = function (dashboard) {
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            var dashboardNew = dashboard.slice();
            dashboardNew[rowFree].cols[col] = "X";

            var thereIsBomb = this.checkBombsOn() && board.thereIsBomb(dashboardNew, col, rowFree);

            var self = this;
            var checkFullRow = function () {
                this.getFullRow = function () {
                    if (!self.checkFullRowOn()) return;
                    for (var iCol = 0; iCol <= dashboard.length - 1; iCol++) {
                        if (iCol != col && dashboard[rowFree].cols[iCol] == null) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            var fullRow = new checkFullRow().getFullRow();

            if (thereIsBomb || fullRow) {
                dashboardNew[rowFree].cols[col] = null;
                continue;
            }

            var numThrowsWinnerFounds = 0;
            for (var col2 = 0; col2 <= (dashboardNew.length - 1) ; col2++) {
                var rowFree2 = board.getLastRowFree(dashboardNew, col2);
                if (rowFree2 != -1) {
                    dashboardNew[rowFree2].cols[col2] = "X";
                    var throwWinnerFound = this.checkThrowWinner(dashboardNew, col2, rowFree2, "X");
                    var thereIsBomb2 = board.thereIsBomb(dashboardNew, col2, rowFree2);

                    var self = this;
                    var checkFullRow2 = function () {
                        this.getFullRow = function () {
                            if (!self.checkFullRowOn()) return false;
                            for (var iCol = 0; iCol <= dashboardNew.length - 1; iCol++) {
                                if (iCol != col2 && dashboardNew[rowFree2].cols[iCol] == null) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    }
                    var fullRow2 = new checkFullRow2().getFullRow();
                    numThrowsWinnerFounds += (throwWinnerFound && !thereIsBomb2 && !fullRow2 ? 1 : 0);
                    if (numThrowsWinnerFounds >= 2) {
                        dashboardNew[rowFree].cols[col] = null;
                        window.log('Smart attack found at ' + col);
                        window.log({ column: col, row: rowFree });
                        return col;
                    }

                    dashboardNew[rowFree2].cols[col2] = null;
                }
            }

            dashboardNew[rowFree].cols[col] = null;
        }
    }

    return null;
}



// TO MATCH THREE IN A ROW BUT AVOID STUPID THROWS
// Called when IA finds three in row. It checks that the throw is not on side borders.
IA2.prototype.itsAStupidThrow = function (dashboard, col) {

    var stupidThrow = false;

    stupidThrow = this.FacilitatesThreeInARow(dashboard, col, 'X', 'O');
    if (stupidThrow) return true;


    var rowFree = board.getLastRowFree(dashboard, col);

    var sidesLock =  (board.getNumAvilablesOnLeft(dashboard, col, rowFree, 'X', 'O')
                        + board.getNumAvilablesOnRight(dashboard, col, rowFree, 'X', 'O') < 3);

    var diagonal1Lock = (board.getNumberAvailablesInDiagonalDownLeft(dashboard, col, rowFree, 'X')
        + board.getNumberAvailablesInDiagonalUpRight(dashboard, col, rowFree, 'X') < 3);

    var diagonal2Lock = (board.getNumberAvailablesInDiagonalDownRight(dashboard, col, rowFree, 'X')
        + board.getNumberAvailablesInDiagonalUpLeft(dashboard, col, rowFree, 'X') < 3);

    stupidThrow = sidesLock && diagonal1Lock && diagonal2Lock;

    if (stupidThrow) return true;


    //stupidThrow = ( col+2>=(dashboard.length-1) 
    //                && board.getNumberOnRight(dashboard, col, rowFree, "X") >= 2
    //                && dashboard[rowFree].cols[col - 1] != null);

    //stupidThrow = stupidThrow ||
    //                    (col + 3 <= (dashboard.length - 1)
    //                        && board.getNumberOnRight(dashboard, col, rowFree, "X") == 2
    //                        && dashboard[rowFree].cols[col + 3] != null);

    //stupidThrow = stupidThrow ||
    //                        (col - 2 == 0
    //                        && board.getNumberOnLeft(dashboard, col, rowFree, "X") >= 2
    //                        && dashboard[rowFree].cols[col + 1] != null);

    if (stupidThrow) {
        window.log('Stupid throw found in column ' + col);
    }

    return stupidThrow;
}



