
//IA 0.0
//1. Winner throw (85% of times)
//2. Defense 3 in row: Column (90% of times), row (90% of times), diagonal (70% of times)
//3. Attack with three in a row (75% of times)
//4. Defense hollow in row (60% of times)
//5. Defense 2 in a row. 42% of times
//6. Random throw. 


function IA0() {
    this.getName = function () { return 'IA0'; };
}


IA0.prototype.nextComputerThrow = function (dashboard) {
    //window.log("IA 1.0 throw..");

    var randNumber = (Math.floor(Math.random() * 21));


    //1. Winner throw (85% of times)
    if (randNumber > 2) {
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
                    var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                    if (!thereIsBomb) {
                        window.log('1. Winner throw, col ' + col);
                        return (col);
                    }
                };
            }
        }
    }


    // ******************
    //2. Defense 3 in row

    //defense 3 in a row. 90% of times
    if (randNumber > 2) {
        //columns
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

        //rows
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            rowFree = board.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                var numOnRight = board.getNumberOnRight(dashboard, col, rowFree, "O");
                var numOnLeft = board.getNumberOnLeft(dashboard, col, rowFree, "O");
                if (numOnRight + numOnLeft >= 3) {
                    var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                    if (!thereIsBomb || randNumber < 4) { //if there is bomb, fails 20% of times
                        window.log("2. Defense row with 3 in a row. defense row");
                        return (col);
                    }
                }
            }
        }
    }


    //defense 3 diagonals in a row: 71% of times
    if (randNumber > 5) {
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            rowFree = board.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                //window.log('checking defense diagonal');
                if (board.getNumberInDiagonalUpRight(dashboard, col, rowFree, "O")
                        + board.getNumberInDiagonalDownLeft(dashboard, col, rowFree, "O") >= 3) {
                    var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                    if (!thereIsBomb || randNumber < 4) //if there is bomb, fails 20% of times
                        return (col);
                }

                if (board.getNumberInDiagonalUpLeft(dashboard, col, rowFree, "O")
                        + board.getNumberInDiagonalDownRight(dashboard, col, rowFree, "O") >= 3) {
                    var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                    if (!thereIsBomb || randNumber < 4) //if there is bomb, fails 20% of times
                        return (col);
                }
            }
        }
    }
    //*************

 

    //*************************
    //3. Attack with three in a row
    //match better throw
    var betterColAttack4 = -1;
    var betterRow = -1;

    if (randNumber > 5) { //71% of times
        var bestInRow = 0;
        var numInRow = 0;
        var bestInRow = 0;
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            var rowFree = board.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                //match better column
                numInRow = Math.max(
                                      board.getNumberOnLeft(dashboard, col, rowFree, "X") + board.getNumberOnRight(dashboard, col, rowFree, "X"),
                                      board.getNumberInDiagonalUpRight(dashboard, col, rowFree, "X") + board.getNumberInDiagonalDownLeft(dashboard, col, rowFree, "X"),
                                      board.getNumberInDiagonalUpLeft(dashboard, col, rowFree, "X") + board.getNumberInDiagonalDownRight(dashboard, col, rowFree, "X")
                                   );

                if (numInRow >= 2 && numInRow > bestInRow) {
                    betterColAttack4 = col;
                    bestInRow = numInRow;
                    betterRow = rowFree;
                    if (randNumber > 10) break; //Randomly get first option (or last)
                };
            }
        }

        //check 3 in column: 70% of times
        if (bestInRow < 2 && randNumber > 14) {
            for (var col = 0; col <= (dashboard.length - 1) ; col++) {
                var rowFree = board.getLastRowFree(dashboard, col);
                if (rowFree != -1) {
                    numInRow = board.getNumberInColumn(dashboard, col, rowFree + 1, "X");
                    if (numInRow >= 2 && numInRow > bestInRow) {
                        betterColAttack4 = col;
                        bestInRow = numInRow;
                        betterRow = rowFree;
                        if (randNumber > 15) break; //Randomly get first option (or last)
                    };
                }
            }
        }
    }

    var dangerousThrow = this.IsDangerousThrow(dashboard, betterColAttack4, betterRow);
    //if betterCol found and it is not dangerous
    if (betterColAttack4 >= 0 && !dangerousThrow) {
        var thereIsBomb = board.thereIsBomb(dashboard, betterColAttack4, betterRow);
        if (!thereIsBomb || randNumber < 3) {
            window.log('4. Attack with 3 in a row');
            return betterColAttack4;
        }
    }


    
    //**************************
    //4. defense hollow in row (60% of times)
    if (randNumber > 9) {
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            rowFree = board.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                if (board.isAHollowInRow(dashboard, col, rowFree, "O")) {
                    var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                    if (!dangerousThrow) {
                        var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
                        if (!thereIsBomb || randNumber < 2) {
                            window.log('6. defense hollow in row');
                            return (col)
                        }
                    }
                };
            }
        }
    }
    //****************************


    //5. Defense 2 in a row. 42% of times
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            //defense row
            if (dashboard[rowFree].cols[col + 1] == "O") {
                var numOnRight = board.getNumberOnRight(dashboard, col, rowFree, "O");
                //window.log('defense row. right on col ' + col + ' equal to ' + numOnRight);
                if (numOnRight >= 2) {
                    var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                    if (numOnRight == 2 && !dangerousThrow && randNumber > 7) {
                        window.log('5. defense 2 in a row');
                        return (col);
                    }
                }
            }

            var numOnLeft = board.getNumberOnLeft(dashboard, col, rowFree, "O");
            if (numOnLeft >= 2) {
                var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
                if (numOnLeft == 2 && !dangerousThrow && randNumber < 17) {
                    window.log('5. defense 2 in a row');
                    return (col);
                }
            }
        }
    }
    //*******************************


    //*******************************
    //6. Random throw
	window.log('5. Best random throw');
	var lst = [];
	var firstColMatch = -1;
	for (var col = 0; col <= (dashboard.length - 1) ; col++) {
	    rowFree = board.getLastRowFree(dashboard, col);
	    if (rowFree != -1) {
	        var dangerousThrow = this.IsDangerousThrow(dashboard, col, rowFree);
	        if (!dangerousThrow) {
	            var thereIsBomb = board.thereIsBomb(dashboard, col, rowFree);
	            if (!thereIsBomb || randNumber < 8) {
	                lst.push(col);
	            }
	        }

	        if (firstColMatch == -1) firstColMatch = col;
	    }
	}
	if (lst.length == 0 && betterColAttack4 > 0) lst.push(betterColAttack4);
	if (lst.length == 0) lst.push(firstColMatch);
	///window.log(lst);
	var randFromList = (Math.floor(Math.random() * lst.length));
	return lst[randFromList];
    //*******************************
}



IA0.prototype.checkThrowWinner = function (dashboard, col, row, ficha) {
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



IA0.prototype.IsDangerousThrow = function (dashboard, column, row) {
    if (column < 0) return false;
    var dangerousThrow = false;

    dangerousThrow =  board.getNumberInDiagonalUpRight(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownLeft(dashboard, column, row - 1, "O") >= 3;
    dangerousThrow = dangerousThrow || board.getNumberInDiagonalUpLeft(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownRight(dashboard, column, row - 1, "O") >= 3;
    dangerousThrow = dangerousThrow ||
                        (board.getNumberOnLeft(dashboard, column, row - 1, "O")
                           + board.getNumberOnRight(dashboard, column, row - 1, "O") >= 3);
    
    return dangerousThrow;
}


IA0.prototype.FacilitatesDiagonals = function (dashboard, column, row) {
    //NOT IMPLEMENTED IN IA0

    //if (column < 0) return false;
    //var dangerousThrow = false;

    //var facilitatesDiagonals = board.getNumberInDiagonalUpRight(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownLeft(dashboard, column, row - 1, "O") >= 2;
    //facilitatesDiagonals = facilitatesDiagonals || board.getNumberInDiagonalUpLeft(dashboard, column, row - 1, "O") + board.getNumberInDiagonalDownRight(dashboard, column, row - 1, "O") >= 2;
    
    //return facilitatesDiagonals;
}




IA0.prototype.IsThereACheckMate = function (dashboard, log) {
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        var rowFree = board.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            var dashboardNew = dashboard.slice();
            dashboardNew[rowFree].cols[col] = "O";

            var numThrowsWinnerFounds = 0;
            for (var col2 = 0; col2 <= (dashboardNew.length - 1) ; col2++) {
                var rowFree2 = board.getLastRowFree(dashboardNew, col2);
                if (rowFree2 != -1) {
                    dashboardNew[rowFree2].cols[col2] = "O";

                    var throwWinnerFound = this.checkThrowWinner(dashboardNew, col2, rowFree2, "O");
                    dashboardNew[rowFree2].cols[col2] = null;
                    numThrowsWinnerFounds += (throwWinnerFound ? 1 : 0);

                    if (numThrowsWinnerFounds >= 2) {
                        dashboardNew[rowFree].cols[col] = null;
                        if (log) {
                            window.log({ column: col, row: rowFree, desc: 'IA IsThereACheckMate is TRUE' });
                        }
                        return true;
                    }
                }
            }

            dashboardNew[rowFree].cols[col] = null;
        }
    }

    return false;
}





