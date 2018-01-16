
//Controller for Junior mode
//It uses IA1 and IA0 (specific for kids)
 
function ControllerMode_02(_interfaceKO) {
    var self = this;

    var lastThrow = null; // { null, 'U (user)', 'C (computer)'}

    //To  activate throwEffect set throwEffectIni to 'on'
    var THROW_EFFECT_INI = 'off'; // { on, off }
    var throwEffect = THROW_EFFECT_INI;

    // To start match in TEST mode set to true
    var TEST_ON = false;
    self.testOn = function() { return TEST_ON; }

    //To print log at console.
    var LOG_ON = false;
    self.logOn = function() { return LOG_ON; }


    var TEST_IA = null;
    //To test an specific IA set it in variable TEST_IA 
    //TEST_IA = new IA0();
    var IA = null;

    self.getIA = function () { return IA; }

    self.setIA = function () {
        if (TEST_IA != null) {
            IA = TEST_IA;
            window.log('play with forced IA ' + IA.getName());
            return;
        }

        var iaMatch = null;
        //if user has two points more than computer, IA1
        if ( window.score.user > window.score.computer +1) {
            iaMatch  = new IA1('junior');
        } else {
            //66% of times IA0, 33% of times IA1
            var randNumber = (Math.floor(Math.random() * 3));
            iaMatch =(randNumber <=1 ? new IA0() : new IA1('junior'));
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
            self.testStartPosition();
            return;
        }

        self.throwEffect = 'off';
        self.setRandomItems(dashboard);

        self.throwEffect = THROW_EFFECT_INI;
    }


    self.userThrow = function (column) {
        if (self.lastThrow == 'U') return;
            self.lastThrow = 'U';

        var dashboard = _interfaceKO.getDashboard();
        var row = self.throw(column, "O");
        var bomb = board.thereIsBomb(dashboard, column, row);

        var next = function () {
            var dashboard = _interfaceKO.getDashboard();

            if (!bomb && IA.checkThrowWinner(dashboard, column, row, "O")) {
                dashboard[row].cols[column] = 'O' + 'W';
                _interfaceKO.board(dashboard);
                self.showYouWin();
                return;
            }

            if (!board.checkItemsFree(dashboard)) {
                self.showDraw();
                return;
            }

            setTimeout(function () { self.checkBomb(dashboard, column, row); }, 200);
            setTimeout(function () { self.computerThrow(); }, !bomb ? 800 : 1100);
        }

        setTimeout(function () { next(); }, !bomb ? 250 : 20);
    }


    //Method computerThrow. Called from userThrow
    self.computerThrow = function () {
        var dashboard = _interfaceKO.getDashboard();

        var computerThrow = self.getIA().nextComputerThrow(dashboard);
        var row = self.throw(computerThrow, "X");
        var bomb = board.thereIsBomb(dashboard, computerThrow, row);

        var next = function () {
            dashboard = _interfaceKO.getDashboard();

            self.lastThrow = 'C';

            if (!bomb && self.getIA().checkThrowWinner(dashboard, computerThrow, row, "X")) {
                dashboard[row].cols[computerThrow] = 'X' + 'W';
                _interfaceKO.board(dashboard);
                self.showYouLose();
                return;
            }


            if (!board.checkItemsFree(dashboard)) {
                self.showDraw();
                return;
            }

            setTimeout(self.checkBomb(dashboard, computerThrow, row), !bomb ? 250 : 0);
        }

        setTimeout(function () { next(); }, !bomb ? 250 : 20);
    };


    //Throw action. It sets the state of the dashboard, then KnockOut refresh DOM
    self.throw = function (column, ficha) {
        var dashboard = _interfaceKO.getDashboard();
        var row = board.getLastRowFree(dashboard, column);
        var bomb = board.thereIsBomb(dashboard, column, row);

        //if (self.throwEffect == 'on' && row>0) {
        //    self.throwMovement(column, ficha, row, 0);
        //} else {
            dashboard[row].cols[column] = !bomb ? ficha : null;
        //}

        _interfaceKO.board(dashboard);
        return row;
    };


    self.checkBomb = function (dashboard, column, row) {
        if (board.thereIsBomb(dashboard, column, row)) {
            setTimeout(function () { self.bombExplodes(column, row); }, 50);
            return true;
        }

        var randNumber = (Math.floor(Math.random() * 20));
        //5% of times throw a bomb
        if (randNumber < 1) {
            setTimeout(function () { self.throwNewRandomBomb(dashboard); }, 200);
        }

        return false;
    }


    self.bombExplodes = function (column, row) {
        var dashboard = _interfaceKO.getDashboard();
        dashboard[row].cols[column] = null;
        dashboard[row + 1].cols[column] = self.lastThrow == 'U' ? 'BEO' : 'BEX';
        _interfaceKO.board(dashboard);
        window.playAudio(window.audioBombKids);
        setTimeout(function () { self.bombDestroys(column, row); }, 350);
    }

    self.bombDestroys = function (column, row) {
        var dashboard = _interfaceKO.getDashboard();
        dashboard[row + 1].cols[column] = null;

        _interfaceKO.board(dashboard);
    }


    self.checkFullRow = function (dashboard, row) {
        return false;
        //not used

        if (board.fullRow(dashboard, row)) {
            setTimeout(function () { self.throwNewRandomBomb(dashboard, row); }, 300);
            return true;
        }
        return false;
    }


    self.throwNewRandomBomb = function (dashboard) {
        var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));
        //window.log('booomba en col ' + randNumber);
        var row = board.getLastRowFree(dashboard, randNumber);
        //window.log('booomba en row ' + row);
        if (row > 0) dashboard[row].cols[randNumber] = 'B';
        _interfaceKO.board(dashboard);
    }


    self.setRandomItems = function (dashboard) {
        for (var i = 1; i <= 4; i++) {
            var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));
            self.throw(randNumber, 'M');
        }

        for (var i = 1; i <= 4; i++) {
            var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));
            self.bombCol = randNumber;
            self.throw(randNumber, 'B');
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
        _interfaceKO.winner("draw");
        self.endMatch();
    }

    self.showYouLose = function () {
        $('#matchResult').attr('src', './img/youLose2.png');
        window.playAudio(window.audioLose);
        _interfaceKO.winner("I Win");

        gameControllerBase.increaseScore('C');
        self.showOutcomeSentence();
        self.endMatch();
    }

    self.showOutcomeSentence = function () {
        if (window.score.computer > window.score.user ) {
            $('#outcomeSentence').html("Try it again..");
        } else if (window.score.computer == window.score.user) {
            $('#outcomeSentence').html("We’re tied, that’s very interesting..");
        } else if (window.score.computer == window.score.user - 1) {
            $('#outcomeSentence').html("Let’s go!! Will you keep this advantage?");
        } else if (window.score.computer < window.score.user) {
            $('#outcomeSentence').html("You’re so good!!");
        }
    }

    self.endMatch = function () {
        setTimeout(function () {
            $('#playAgain').attr('style', 'display: inline-block;');
            $('#matchEndContainer').attr('style', 'display:inline-block');
        }, 600);
    }



    self.testStartPosition = function () {

        //To test Advance defense
        self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
        self.throw(1, 'B');
        self.throw(2, 'M');
        self.throw(3, 'O'); self.throw(3, 'O'); self.throw(3, 'X');
        self.throw(4, 'O'); self.throw(4, 'O');
        self.throw(5, 'O'); self.throw(5, 'O');


        //To test Diagonal defense
        //self.throw(3, 'O'); 
        //self.throw(4, 'M'); self.throw(4, 'O'); 
        //self.throw(5, 'M'); self.throw(5, 'M'); self.throw(5, 'O'); 
        //self.throw(6, 'X'); self.throw(6, 'X');


        //To test GetLevel2DefensiveThrow()
        //self.throw(0, 'O'); self.throw(0, 'O');
        //self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'O');
        //self.throw(2, 'M'); self.throw(2, 'O'); self.throw(2, 'O');
        //self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'O');
        //self.throw(4, 'M'); self.throw(4, 'M'); self.throw(4, 'M'); self.throw(4, 'O');

        //check bombs
        //self.throw(3, 'B'); self.throw(4, 'B'); self.throw(5, 'B');

    }
}