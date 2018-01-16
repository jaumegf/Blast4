
//Controller for Blast4 and Classic Mode
//It manages Blast4 mode, but also Classic mode
 
function ControllerMode_01(_interfaceKO, _mode) {
    var self = this;

    var mode = _mode; // {blast4, classic}

    self.getMode = function () { return mode; }
    self.bombsOn = function () { return self.getMode() == 'blast4'; }
    self.fullRowOn = function () { return self.getMode() == 'blast4'; }

    var lastThrow = null; // { null, 'U (user)', 'C (computer)'}

    //To  activate throwEffect set throwEffectIni to 'on'
    var THROW_EFFECT_INI = 'off'; // { on, off }
    var throwEffect = THROW_EFFECT_INI;

    //To start match in test mode set to true
    var TEST_ON = false;
    self.testOn = function() { return TEST_ON; }
    //To print log at console.
    var LOG_ON = false;
    self.logOn = function() { return LOG_ON; }


    var TEST_IA = null;
    //To test an specific IA set it in variable TEST_IA 
    //TEST_IA = new IA2('classic', true);
    //TEST_IA = new IA2('blast4', true);
    var IA = null;

    self.getIA = function () { return IA; }

    self.setIA = function () {
        if (TEST_IA != null) {
            window.activeLog(true);
            IA = TEST_IA;
            window.log('play with forced IA ' + IA.getName());
            return;
        }

        var iaMatch = null;

        if (window.score.matches == 0) {
            // first match with IA2 in blast4 and classic mode.
            iaMatch = new IA2(self.getMode(), false);
        } else { // second match or over
            var randNumber = (Math.floor(Math.random() * 5));

            if (self.getMode() == 'blast4') {
                // if user score is equal or higher, IA2 High
                // if is lower, 40 % of times IA1, 60 % of times IA2 (mediumhigh false)
                iaMatch = (window.score.user >= window.score.computer)
                                   ? new IA2(self.getMode(), true)
                                   : randNumber <= 1 ? new IA1(self.getMode()) : new IA2(self.getMode(), false);
            } else { // mode classic
                //if user score is equal or higher. set MediumHigh parameter to true
                iaMatch = (window.score.user >= window.score.computer)
                                   ? new IA2(self.getMode(), true)
                                   : new IA2(self.getMode(), false); 
            }
        }


        IA = iaMatch;
        window.log('play with IA ' + IA.getName());
    }


    //Method new match. Clear board and starts new match
    self.newMatch = function() {
        if (self.logOn()) {
            window.activeLog(true);
        }

        window.log('new match');
        self.setIA();
        self.lastThrow = null;
        _interfaceKO.board(board.newBoard());
        var dashboard = _interfaceKO.getDashboard();
        _interfaceKO.winner(null);


        if (self.testOn()) {
            self.throwEffect = 'off';
            window.activeLog(true);
            self.testStartPosition(dashboard);
            return;
        }

        if (self.getMode() == 'blast4') {
            self.throwEffect = 'off';
            self.setRandomItems(dashboard);
        } else {
            self.setClassicBoard(dashboard);
	    }


        self.throwEffect = THROW_EFFECT_INI;
        if (self.getMode() == 'classic')
	         self.throwEffect = 'on'; // { on, off }
    }


    self.userThrow = function (column) {
        if (self.lastThrow == 'U') return;
        self.lastThrow = 'U';

        var dashboard = _interfaceKO.getDashboard();
        var row = self.throw(column, "O");
        var bomb = self.bombsOn() && board.thereIsBomb(dashboard, column, row);

        var next = function () {
            var dashboard = _interfaceKO.getDashboard();
 
            var bombOrFullRow = self.fullRowOn() && (bomb || board.fullRow(dashboard, row));

            if (!bombOrFullRow && self.getIA().checkThrowWinner(dashboard, column, row, "O")) {
                dashboard[row].cols[column] = 'O' + 'W';
                _interfaceKO.board(dashboard);
                self.showYouWin();
                return;
            }

            if (self.fullRowOn()) {
                setTimeout(self.checkFullRow(dashboard, row), (300 + throwEffect ? (row * 80) : 0));
            }

            if (!board.checkItemsFree(dashboard)) {
                self.showDraw();
                return;
            }

            if (self.bombsOn()) {
                setTimeout(function () { self.checkBomb(dashboard, column, row); }, (300 + throwEffect ? (row * 80) : 0));
            }

            setTimeout(function () { self.computerThrow(); }, !bomb ? 800 : 1100);
        };

        setTimeout(function () { next(); }, !bomb ? (4 + throwEffect ? (row * 80) : 0) : 20);
    }


    //Method computerThrow. Called from userThrow
    self.computerThrow = function () {
        var dashboard = _interfaceKO.getDashboard();

        var computerThrow = self.getIA().nextComputerThrow(dashboard);
        var row = self.throw(computerThrow, "X");
        var bomb = self.bombsOn() && board.thereIsBomb(dashboard, computerThrow, row)

        var next = function () {
            dashboard = _interfaceKO.getDashboard();

            self.lastThrow = 'C';

            var bombOrFullRow = self.fullRowOn() && (bomb || board.fullRow(dashboard, row));

            if (!bombOrFullRow && self.getIA().checkThrowWinner(dashboard, computerThrow, row, "X")) {
                dashboard[row].cols[computerThrow] = 'X' + 'W';
                _interfaceKO.board(dashboard);
                self.showYouLose();
                return;
            }

            if (self.fullRowOn()) {
                setTimeout(self.checkFullRow(dashboard, row), (300 + throwEffect ? (row * 80) : 0));
            }

            if (!board.checkItemsFree(dashboard)) {
                self.showDraw();
                return;
            }

            if (self.bombsOn()) {
                setTimeout(function () { self.checkBomb(dashboard, computerThrow, row); }, (300 + throwEffect ? (row * 80) : 0));
            }
        }

        setTimeout(function () { next(); }, !bomb ? (400 + throwEffect ? (row * 80) : 0) : 20);
    };


    //Throw action. It sets the state of the dashboard, then KnockOut refresh DOM
    self.throw = function (column, ficha) {
        var dashboard = _interfaceKO.getDashboard();
        var row = board.getLastRowFree(dashboard, column);
        if (row < 0) return;
        var bomb = board.thereIsBomb(dashboard, column, row);

        if (self.throwEffect == 'on' && row>0) {
            self.throwMovement(column, ficha, row, 0);
        } else {
            dashboard[row].cols[column] = !bomb ? ficha : null;
        }

        _interfaceKO.board(dashboard);
        return row;
    };



    //TODO: Movement in mobile is very slow
    //Activate it only in computers
    //Also suggest a test with several smartphones.
    self.throwMovement = function (column, ficha, row, i) {
        var dashboard = _interfaceKO.getDashboard();
        var _idx = i;
        if (_idx <= row) {
            if (_idx > 0) {
                dashboard[_idx - 1].cols[column] = null;
            }

            var bomb = (_idx < row || _idx == 8) ? false
                                                : dashboard[_idx + 1].cols[column][0] == 'B';
            dashboard[_idx].cols[column] = ficha;

            _interfaceKO.board(dashboard);

            _idx = _idx + 1;
        }

        if (_idx > row) return row;

        setTimeout(function () { self.throwMovement(column, ficha, row, _idx); }, 75 - (_idx * 5));
    };



    self.checkBomb = function (dashboard, column, row) {
        if (board.thereIsBomb(dashboard, column, row)) {
            setTimeout(function () { self.bombExplodes(column, row); }, 50);
            return true;
        }

        return false;
    }


    self.bombExplodes = function (column, row) {
        var dashboard = _interfaceKO.getDashboard();
        dashboard[row].cols[column] = null;
        dashboard[row + 1].cols[column] = self.lastThrow == 'U' ? 'BEO' : 'BEX';


        _interfaceKO.board(dashboard);

        window.playAudio(window.audioBomb);
        setTimeout(function () { self.bombDestroys(column, row); }, 350);
    }


    self.bombDestroys = function (column, row) {
        var dashboard = _interfaceKO.getDashboard();
        dashboard[row + 1].cols[column] = null;

        _interfaceKO.board(dashboard);
    }


    self.checkFullRow = function (dashboard, row) {
        if (board.fullRow(dashboard, row)) {
            window.playAudio(window.audioFullRow);
            setTimeout(function () { self.rowInBlack(dashboard, row); }, 300);
            return true;
        }
        return false;
    }


    self.rowInBlack = function (dashboard, row) {
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            dashboard[row].cols[col] = 'M';
        }

        self.throwNewRandomBomb(dashboard);
        _interfaceKO.board(dashboard);
    }

    self.throwNewRandomBomb = function (dashboard) {
        var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));
        //window.log('booomba en col ' + randNumber);
        var row = board.getLastRowFree(dashboard, randNumber);
        //window.log('booomba en row ' + row);
        if (row > 0) dashboard[row].cols[randNumber] = 'B';
    }


    self.setRandomItems = function (dashboard) {
        //avoid center
        var numBlocks = 0;
        while (numBlocks < 6) {
            var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));

            if (randNumber < 3 || randNumber > 5) {
                self.throw(randNumber, 'M');
                numBlocks = numBlocks + 1;
            }
        }

        for (var i = 1; i <= 3; i++) {
            var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));
            self.bombCol = randNumber;
            self.throw(randNumber, 'B');
        }
    }

    self.setClassicBoard = function (dashboard) 
    {
        //Cols 0 and 8 locked
        for (var i = 0; i <= 8; i++) {
            self.throw(0, 'M');
            self.throw(8, 'M');
        };

        //3 rows locked
        for (i = 1; i <= 3; i++) {
            self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
            self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M');
        }
    }

    self.showYouWin = function () {
        $('#matchResult').attr('src', './img/youWin.png');
        window.playAudio(window.audioWin);
        gameControllerBase.increaseScore('U');
        _interfaceKO.winner("You Win!!");
        self.showOutcomeSentence();
        self.endMatch();
    }

    self.showDraw = function () {
        _interfaceKO.winner("Draw");
        self.endMatch();
    }

    self.showYouLose = function () {
        var audio = new Audio('./sound/youlose.mp3');
        window.playAudio(window.audioLose);
        _interfaceKO.winner("I Win");

        gameControllerBase.increaseScore('C');
        self.showOutcomeSentence();
        self.endMatch();
    }

    self.showOutcomeSentence = function () {

        if (window.score.computer == 0 && window.score.user == 1) {
            $('#outcomeSentence').html("Let’s go!! Dare you to win 4 matches in a row?");
            return;
        }

        if (window.score.computer == 0 && window.score.user == 4) {
            $('#outcomeSentence').html("Excellent!! You achived the goal!!");
            return;
        }

        if (window.score.computer > window.score.user + 2) {
            $('#outcomeSentence').html("Have you tried kids mode?");
        } else if (window.score.computer == window.score.user + 1 || window.score.computer == window.score.user + 2) {
            $('#outcomeSentence').html("I’ll take it easy, it’s beeing so hard for you.");
        } else if (window.score.computer == window.score.user) {
            $('#outcomeSentence').html("We’re tied, that’s very interesting..");
        } else if (window.score.computer == window.score.user - 1) {
            $('#outcomeSentence').html("Let’s go!! Will you keep this advantage?");
        } else if (window.score.computer < window.score.user) {
            $('#outcomeSentence').html("You’re so good!! I will think more. Will you beat me then?");
        }
    }

    self.endMatch = function () {
        setTimeout(function () {
            $('#playAgain').attr('style', 'display: inline-block;');
            $('#matchEndContainer').attr('style', 'display:inline-block');
        }, 600);
    }


    //To test IA or game in an sepecific scenario
    self.testStartPosition = function (dashboard) {
        self.setClassicBoard(dashboard);

        //Cover/No Cover GAP
        //self.throw(2, 'M'); self.throw(3, 'O'); self.throw(5, 'O'); self.throw(6, 'M');
        //return;

        //Cover diagonals
        //self.throw(1, 'O'); self.throw(2, 'X'); 
        //self.throw(4, 'O'); self.throw(4, 'X'); self.throw(4, 'O'); self.throw(4, 'O');
        //return;

        //Cover diagonals
        //self.throw(2, 'X'); self.throw(2, 'O'); self.throw(2, 'X'); self.throw(2, 'O');
        //self.throw(4, 'O'); self.throw(4, 'X'); self.throw(4, 'O');
        //return;

        //Test WAIT the check.
        //self.throw(2, 'O'); self.throw(2, 'X');
        //self.throw(3, 'X'); self.throw(3, 'X');
        //self.throw(5, 'X'); self.throw(5, 'X');
        //return;

        //Test defense gap below
        //self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M'); 
        //self.throw(2, 'O'); 
        //return;

        //Test defense gap patter right (offset 2)
        //self.throw(3, 'X'); self.throw(3, 'O');
        //self.throw(5, 'O'); self.throw(5, 'O');
        //return;

        //Test defense gap pattern Left (offset 2)
        //self.throw(4, 'X'); self.throw(4, 'O');
        //self.throw(6, 'O'); self.throw(6, 'O');
        //return;



        //Test Attack gap pattern right (offset 2)
        //self.throw(3, 'O'); self.throw(3, 'X');
        //self.throw(5, 'X'); self.throw(5, 'X');
        //return;


        //Test Attack gap Left (offset 2)
        //self.throw(4, 'O'); self.throw(4, 'X');
        //self.throw(6, 'X'); self.throw(6, 'X');
        //return;

        
        //Test eases check mate in col 4.
        //self.throw(2, 'O');
        //self.throw(3, 'X'); self.throw(3, 'X'); self.throw(3, 'O'); self.throw(3, 'X'); self.throw(3, 'X');
        //self.throw(4, 'O'); self.throw(4, 'O'); self.throw(4, 'X'); self.throw(4, 'O');
        //self.throw(5, 'X'); self.throw(5, 'O'); self.throw(5, 'O');



        //Test full row
        //self.throw(0, 'O'); self.throw(1, 'O'); self.throw(2, 'O');
        //self.throw(3, 'X'); self.throw(4, 'X'); self.throw(5, 'X');
        //self.throw(7, 'M'); self.throw(8, 'M');

        //self.throw(3, 'X'); self.throw(3, 'O'); self.throw(3, 'X'); self.throw(3, 'X'); self.throw(3, 'O');
        //self.throw(4, 'X'); self.throw(4, 'O');
        //self.throw(5, 'O'); self.throw(5, 'X'); self.throw(5, 'O'); self.throw(5, 'X'); self.throw(5, 'O'); 
        //self.throw(6, 'O'); self.throw(6, 'O'); self.throw(6, 'O'); self.throw(6, 'X'); self.throw(6, 'O'); self.throw(6, 'O');
        //self.throw(7, 'M'); self.throw(7, 'M'); self.throw(7, 'M'); self.throw(7, 'M'); self.throw(7, 'M'); self.throw(7, 'M'); self.throw(7, 'O');

        //Test Attack GAPPattern
        //self.throw(0, 'M');
        //self.throw(2, 'M'); self.throw(2, 'X');
        //self.throw(3, 'M'); self.throw(3, 'X');

        //Test defende GAPPattern
        //self.throw(0, 'M'); 
        //self.throw(2, 'M'); self.throw(2, 'O');
        //self.throw(3, 'M'); self.throw(3, 'O');

        //Test attack in diagonal
        //self.throw(0, 'X');
        //self.throw(1, 'M');
        //self.throw(2, 'M'); self.throw(2, 'M');
        //self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'X');

          //8. test  Defense to avoid this situation: Called Pattern4
        //          00
        //          00
        //self.throw(2, 'O');
        //self.throw(2, 'O');
        //self.throw(3, 'O');
        //self.throw(4, 'X');

        //To test patter X..X
        //self.throw(0, 'X');
        //self.throw(3, 'X');
    }
}