
//Controller for Prime match mode.
//Prime mode mixes random matches between classic mode and blast4.
//Also adds random and predefined scenarios to blast4 mode.
//Game ends when user or computer scores 4 points.
 
function ControllerMode_03(_interfaceKO) {
    var self = this;

    //It's modified randomly each match.
    //blast4 mode throws bombs and check full row.
    var mode = 'blast4'; // {blast4, classic}

    self.getMode = function () { return mode; }
    self.setMode = function (_mode) { mode = _mode; }

    self.bombsOn = function () { return (self.getMode() == 'blast4'); }
    self.fullRowOn = function () { return (self.getMode() == 'blast4'); }

    var lastThrow = null; // { null, 'U (user)', 'C (computer)'}

    //To  activate throwEffect set throwEffectIni to 'on'
    var THROW_EFFECT_INI = 'off'; // { on, off }
    var throwEffect = THROW_EFFECT_INI;

    // To start match in test mode set to true
    var TEST_ON = false;
    self.testOn = function() { return TEST_ON; }

    //To print log at console.
    var LOG_ON = false;
    self.logOn = function() { return LOG_ON; }

    var TEST_IA = null;
    //To test an specific IA set it in variable TEST_IA 
    TEST_IA = new IA2('blast4');
    //TEST_IA = new IA2('blast4');
    var IA = null;


    self.getIA = function () { return IA; }

    //set IA according to score and mode
    self.setIA = function () {
        if (TEST_IA != null) {
            IA = TEST_IA;
            window.log('play with forced IA ' + IA.getName());
            return;
        }

        var iaMatch = null;

        if (window.score.matches == 0) {
            // with IA1 in blast4Prime mode.
            iaMatch =  new IA1(self.getMode());
        } else { // second match or over
            var randNumber = (Math.floor(Math.random() * 5));
            // modes blast4Prime and classic
            //if user score is equal or higher, IA2 (high TRUE)
            // if is lower, 60 % of times IA1, 40 % of times IA2 (high parameter FALSE)
            iaMatch = (window.score.user >= window.score.computer)
                                   ? new IA2(self.getMode(), true)
                                   : randNumber <= 2 ? new IA1(self.getMode()) : new IA2(self.getMode(), false); 
        }


        IA = iaMatch;
    }

    //To test IA or game in an specific scenario
    //Set TEST_ON true and test IA. e.g: TEST_IA = new IA2('blast4');
    self.testStartPosition = function () {
        //To test Advance defense. IA2 will save a throw in col 7. IA1 won't avoid check mate.

        self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
        self.throw(1, 'B');
        self.throw(2, 'M');
        self.throw(3, 'O'); self.throw(3, 'O'); self.throw(3, 'X');
        self.throw(4, 'O'); self.throw(4, 'O');
        self.throw(5, 'O'); self.throw(5, 'O');
    }


    //force to specific IA. Used in some scenarios.
    self.changeIA = function (iq, high) {
        switch (iq) {
            case 1:
                IA = new IA1(self.getMode());
                break;
            case 2:
                IA = new IA2(self.getMode(), high);
                break;
        }
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

        if (TEST_SCENARIO >= 0) {
            self.throwEffect = 'off';
            window.activeLog(true);
            self.setMode('blast4');
            self.predefinedScenario(dashboard, TEST_SCENARIO);
            window.log('play with TEST_SCENARIO. IA ' + IA.getName() + ' mode ' + self.getMode());
            self.throwEffect = THROW_EFFECT_INI;
            return;
        }


        if (window.score.matches == 0) {
            self.setMode('blast4');
        } else {
            var randNumber = (Math.floor(Math.random() * 6));
            //85% of times blast4 mode, 15% of times Classic mode
            if (randNumber > 0
                    || window.score.user == 2
                    || (window.score.computer == 3 && window.score.user == 0)) {
                self.setMode('blast4');
            } else {
                self.setMode('classic');
                self.setClassicBoard(dashboard);
            }
        }


        if (self.testOn()) {
            self.throwEffect = 'off';
            window.activeLog(true);
            self.testStartPosition();
            return;
        }

        if (self.getMode() == 'blast4') {
            self.throwEffect = 'off';
            var randScenario = (Math.floor(Math.random() * self.getNumberOfScenarios()));
            self.predefinedScenario(dashboard, randScenario);
        }


        //changes themes according to scorer. 
        $("#header").removeClass("ThemeKids");
        $("#header").removeClass("ThemeNumbers");
        $("#header").removeClass("ThemeClassic")
        $("div.board").removeClass("ThemePrime"); $("div.board").removeClass("ThemeNumbers");
        $("div.board").removeClass("ThemeKids"); $("div.board").removeClass("ThemeClassic");

        $("#matchEndContainer").removeClass("ThemeKids"); $("#matchEndContainer").removeClass("ThemePrime");
        $("#matchEndContainer").removeClass("ThemeBlast4"); $("#matchEndContainer").removeClass("ThemeClassic");

        $("body").removeClass("ThemeBlast4"); $("body").removeClass("ThemeKids");
        $("body").removeClass("ThemePrime");$("body").removeClass("ThemeClassic");
 
        //window.score.computer = 3;
        if (window.score.computer == 3 && window.score.user == 0) {
            // if computer scorer is equal to 3, and user score is 0.
            // apply theme kids.
            $("body").addClass("ThemeKids");
            $("div.board").addClass("ThemeKids");
            $("#header").addClass("ThemeKids");
            $("#matchEndContainer").addClass("ThemeKids");

	        self.changeIA(1);
        } else {
            $("body").addClass("ThemeBlast4");
            $("#matchEndContainer").addClass("ThemeBlast4");

            //if user scorer is equal to 2. ThemeNumber
            if (window.score.user == 2 || true) {
                $("div.board").addClass("ThemeNumbers");
                $("#header").addClass("ThemeNumbers");
            } else {
                $("div.board").addClass("ThemeBlast4");
                $("#header").addClass("ThemeBlast4");
            }
        }

        if (self.getMode() == 'classic') {
            $("body").addClass("ThemeClassic");
            $("#header").addClass("ThemeClassic");
            $("div.board").addClass("ThemeClassic");
            $("#matchEndContainer").addClass("ThemeClassic");
	        self.changeIA(2, window.score.user>=window.score.computer);
        }


        window.log('play with IA ' + IA.getName() + ' mode ' + self.getMode());
        self.throwEffect = THROW_EFFECT_INI;

        self.throwEffect = THROW_EFFECT_INI;
        if (self.getMode() == 'classic')
            self.throwEffect = 'off'; // { on, off }
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

        setTimeout(function () { next(); }, !bomb ? (200 + throwEffect ? (row * 80) : 0) : 20);
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

        setTimeout(function () { next(); }, !bomb ? (200 + throwEffect ? (row * 80) : 0) : 20);
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

        setTimeout(function () { self.throwMovement(column, ficha, row, _idx); }, 60 - (_idx*5));
    };



    self.checkBomb = function (dashboard, column, row) {
        if (board.thereIsBomb(dashboard, column, row)) {
            setTimeout(function () { self.bombExplodes(column, row); }, 50);
            return true;
        }

        var randNumber = (Math.floor(Math.random() * 25));
        //8% of times throws a bomb
        if (randNumber < 2) {
            setTimeout(function () { 
	                var randNumber = (Math.floor(Math.random() * (dashboard[0].cols.length - 2)) + 1);
                    self.bombCol = randNumber;
                    self.throw(randNumber, 'B');
			 }, 200);
        }

        return false;
    }


    self.bombExplodes = function (column, row) {
        var dashboard = _interfaceKO.getDashboard();
        dashboard[row].cols[column] = null;

        dashboard[row + 1].cols[column] = self.lastThrow == 'U' ? 'BEO' : 'BEX';

        //Stand by: Bomb that explodes two columns
        //if (row + 2 <= dashboard.length - 1) {
        //    dashboard[row + 2].cols[column] = (dashboard[row + 2].cols[column] == 'M'
        //                                                ? 'ME'
        //                                                : self.lastThrow == 'U' ? 'BEO' : 'BEX');
        //}

        _interfaceKO.board(dashboard);
        window.playAudio(window.audioBomb);
        setTimeout(function () { self.bombDestroys(column, row); }, 350);
    }


    self.bombDestroys = function (column, row) {
        var dashboard = _interfaceKO.getDashboard();
        dashboard[row + 1].cols[column] = null;

        //Stand by: Bomb that explodes two columns
        //if (row + 2 <= dashboard.length - 1) {
        //    dashboard[row + 2].cols[column] = null;
        //}

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
        var row = board.getLastRowFree(dashboard, randNumber);
        if (row > 0) dashboard[row].cols[randNumber] = 'B';
    }


    self.setRandomItems = function (dashboard, numBlocksToPlace, numBombsToPlace) {
        //avoid center
        var numBlocks = 0;
        while (numBlocks < numBlocksToPlace) {
            var randNumber = (Math.floor(Math.random() * dashboard[0].cols.length));

            if (randNumber < 3 || randNumber > 5) {
                self.throw(randNumber, 'M');
                numBlocks = numBlocks + 1;
            }
        }

        for (var i = 1; i <= numBombsToPlace; i++) {
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
        _interfaceKO.winner("Draw");
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

        if (window.score.computer == 0 && window.score.user == 1) {
            $('#outcomeSentence').html("Let’s go! The first one to score 4 points wins the match.");
            return;
        }

        if (window.score.computer == 1 && window.score.user == 0) {
            $('#outcomeSentence').html("Wake up!! The first one to score 4 points wins the match.");
            return;
        }

        if (window.score.computer == 0 && window.score.user == 2) {
            $('#outcomeSentence').html("Let’s go!! I dare you to win 4 matches in a row!");
            return;
        }

        if (window.score.computer == 4) {
            $('#outcomeSentence').html("I win. If you can’t beat me, practice with the kids mode.");
            return;
        }

        if (window.score.computer == 0 && window.score.user == 4) {
            $('#outcomeSentence').html("Excellent! You made it!");
            return;
        }

        if (window.score.user == 4) {
            $('#outcomeSentence').html("Congratulations! You win the match!");
            return;
        }

        if (window.score.user == 2) {
            $('#outcomeSentence').html("Let’s go! Will you beat me in numbers mode?");
            return;
        }


        if (window.score.computer == 3 && window.score.user ==0) {
            $('#outcomeSentence').html("Have you tried kids mode?");
        } else if (window.score.computer == window.score.user + 1 || window.score.computer == window.score.user + 2) {
            $('#outcomeSentence').html("I’ll make it easier for you so that you can do it");
        } else if (window.score.computer == window.score.user) {
            $('#outcomeSentence').html("We’re tied, this is getting exciting...");
        } else if (window.score.computer == window.score.user - 2) {
            $('#outcomeSentence').html("Let’s go!! Will you keep this advantage?");
        } else if (window.score.computer < window.score.user) {
            $('#outcomeSentence').html("You’re so good!! I will think more. Will you beat me then?");
        }
    }

    self.endMatch = function () {
        setTimeout(function () {

            if (window.score.computer == 4 || window.score.user == 4) {
                $('#playAgain').attr('style', 'display: none;');
            }

            $('#matchEndContainer').attr('style', 'display:inline-block');
        }, 600);
    }


    //To test a specific scenario, set this variable.
    var TEST_SCENARIO = -1;
    //TEST_SCENARIO = 15;

    self.getNumberOfScenarios = function () { return 17; }
    self.predefinedScenario = function (dashboard, scenario) {
        
        window.log('predefinedScenario ' + scenario);

        switch (scenario) {
            case 0: // IA2 will throw a check mate unless user avoids it.
                self.changeIA(2, window.score.user >= window.score.computer);

                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(2, 'B');
                self.throw(2, 'M');
                self.throw(3, 'X'); self.throw(3, 'X'); 
                self.throw(4, 'X'); self.throw(4, 'X');
                self.throw(5, 'X'); self.throw(5, 'X'); self.throw(5, 'B');

                break;

            case 1: // IA2 will throw a check mate unless user avoids it. User should defende column 3.
                self.changeIA(2, window.score.user >= window.score.computer);

                self.throw(0, 'X'); self.throw(0, 'X');
                self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'X');
                self.throw(2, 'M'); self.throw(2, 'X'); self.throw(2, 'X');
                self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'X');
                self.throw(4, 'M'); self.throw(4, 'M'); self.throw(4, 'M'); self.throw(4, 'X');

                break;

            case 2: //two full rows and random bombs
                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.setRandomItems(dashboard, 4, 2);

                break;

            case 3: //one full rows and random bombs
                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.setRandomItems(dashboard,4, 2);

                break;

            case 4: //four full rows
                //force IA 1, because otherwise it will be very difficult.
                if (window.score.user < window.score.computer) {
                    self.changeIA(1);
                } 

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                break;

            case 5: //if user does not cover row, check mate. Both IA1 & IA2 would win.
                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');


                self.throw(1, 'X'); self.throw(2, 'X'); self.throw(3, 'X');
                self.throw(4, 'B');
                self.throw(6, 'X'); self.throw(7, 'X'); self.throw(8, 'X');

                break;

            case 6: //Many blocks and bombs
                var randNumber = (Math.floor(Math.random() * 5));
                self.setRandomItems(dashboard, randNumber + 8, randNumber + 4);

                break;

            case 7: //dangerous situation based in pattern4

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');


                self.throw(1, 'X'); self.throw(2, 'X'); self.throw(3, 'B'); self.throw(4, 'X');
                self.throw(1, 'X'); self.throw(4, 'X'); self.throw(6, 'X');

                break;

            case 8: //col 0 && col 8 locked
                for (var i = 0; i <= 8; i++) {
                    self.throw(0, 'M');
                    self.throw(8, 'M');
                };

                break;

            case 9: // IA2 will throw a check mate unless user avoids it.
                self.changeIA(2, window.score.user >= window.score.computer);

                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M'); self.throw(5, 'X'); self.throw(8, 'M');
                self.throw(2, 'M'); self.throw(3, 'X'); self.throw(4, 'X'); self.throw(5, 'X');
                self.throw(3, 'M'); self.throw(4, 'X');

                break;

            case 10: //a black row and Two squares. Change to IA1, otherwise it's very difficult avoid check mate
                //force IA 1, because otherwise it will be very difficult.
                if (window.score.user < window.score.computer) {
                    self.changeIA(1);
                } 

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.throw(0, 'M');
                self.throw(1, 'X'); self.throw(2, 'X'); self.throw(6, 'X'); self.throw(7, 'X');
                self.throw(1, 'X'); self.throw(2, 'X'); self.throw(6, 'X'); self.throw(7, 'X');

                break;


            case 11: //Dangerous scenario
                self.throw(2, 'X'); self.throw(3, 'X'); self.throw(4, 'X'); 
                self.throw(2, 'X'); self.throw(3, 'X'); 
                self.throw(5, 'B');
                break;

            case 12: //tower with IA2. Only possible defense in col 7
                self.changeIA(2, window.score.user >= window.score.computer);

                self.throw(2, 'M'); self.throw(3, 'M');
                self.throw(3, 'B'); 

                self.throw(4, 'X'); self.throw(5, 'X');
                self.throw(4, 'X'); self.throw(5, 'X');
                self.throw(4, 'X'); self.throw(5, 'X');
                self.throw(4, 'X'); self.throw(5, 'M');
                self.throw(4, 'X'); self.throw(5, 'X');

                self.throw(4, 'B'); self.throw(5, 'B');
                break;

            case 13: //One full row and 3 random balls

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); self.throw(4, 'M');
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                var previousNumber = -1;
                for (var i = 0; i < 3; i++) {
                    var randNumber = (Math.floor(Math.random() * 9));
                    //to avoid three in a row, because it's a check mate
                    while (randNumber == previousNumber + 1 || randNumber == previousNumber - 1) {
                        randNumber = (Math.floor(Math.random() * 9));
                    }

                    self.throw(randNumber, 'X');

                    previousNumber = randNumber;
                }

                break;

            case 14: //Gap Pattern. User should avoid GAP Pattern or IA2 will throw Gap attack pattern.
                self.changeIA(2, window.score.user >= window.score.computer);

                self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(2, 'M'); self.throw(3, 'M'); 
                self.throw(5, 'M'); self.throw(6, 'M'); self.throw(7, 'M'); self.throw(8, 'M');

                self.throw(2, 'X'); self.throw(3, 'X');

                break;

            case 15: //Ladder
                self.changeIA(2, window.score.user >= window.score.computer);

                self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M');
                self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'M');
                self.throw(2, 'M'); self.throw(2, 'M'); self.throw(2, 'M'); self.throw(2, 'M'); self.throw(2, 'M'); self.throw(2, 'M');
                self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'M'); self.throw(3, 'M');
                self.throw(4, 'M'); self.throw(4, 'M'); self.throw(4, 'M'); self.throw(4, 'M'); 
                self.throw(5, 'M'); self.throw(5, 'M'); self.throw(5, 'M');
                self.throw(6, 'M'); self.throw(6, 'M');
                self.throw(7, 'M');

                break;

            case 16: //Double Ladder
                self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); self.throw(0, 'M'); 
                self.throw(1, 'M'); self.throw(1, 'M'); self.throw(1, 'M');
                self.throw(2, 'M'); self.throw(2, 'M');
                self.throw(3, 'M');
                self.throw(5, 'M');
                self.throw(6, 'M'); self.throw(6, 'M');
                self.throw(7, 'M'); self.throw(7, 'M'); self.throw(7, 'M'); 
                self.throw(8, 'M'); self.throw(8, 'M'); self.throw(8, 'M'); self.throw(8, 'M');

                break;
        }
    }


    self.setClassicBoard = function (dashboard) {
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

}