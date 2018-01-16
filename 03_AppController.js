//Main controller
//It manages menus, css themes and scorer.

function AppController() {
    var self = this;
    
    var mode = null; // {blast4, classic, prime, junior }
    this.setMode = function (_mode) { mode = _mode; };
    this.getMode = function () { return mode; };

    this.iniScore = function () {
        window.score = { matches: 0, user: 0, computer: 0 };
        self.showScore();
    }

    this.increaseScore = function (winner) {
        window.score.matches += 1;
        if (winner == 'U') {
            window.score.user += 1;
        } else {
            window.score.computer += 1;
        }

        self.showScore();
    }

    this.showScore = function () {
        //window.log('user ' + window.score.user);
        //window.log('computer ' + window.score.computer);

        $("#scoreUser").html(window.score.user);
        $("#scoreComputer").html(window.score.computer);
    }

    this.startGame = function (mode) {
        $('#menuIniContainer').attr('style', 'display:none');
        $('.board').attr('style', 'display:table;');
        $("div.score").attr("style", "display: inline-block");
        $('#playAgain').attr('style', 'display: inline-block;');
        self.iniScore();
        self.newMatch(mode);
    }

    this.newMatch = function (_mode) {
        if (_mode==undefined || _mode == null) {
             _mode = self.getMode();
        } else {
               self.setMode(_mode);
        }

        if (_mode == 'blast4' || _mode == 'classic') {
            self.initGameMode01(_mode);
        } else if (_mode == 'junior') {
            self.initGameMode02();
        } else { //Prime
            self.initGameMode03();
        }

       
        var curController = koVM.getControllerMode();
        curController.newMatch();
    }

    this.removeAllThemes = function () {
        $("#header").removeClass("ThemeBlast4");
        $("#header").removeClass("ThemeKids");
        $("#header").removeClass("ThemeNumbers");
        $("#header").removeClass("ThemeClassic");

        $("#matchEndContainer").removeClass("ThemeKids");
        $("#matchEndContainer").removeClass("ThemePrime");
        $("#matchEndContainer").removeClass("ThemeBlast4");
        $("#matchEndContainer").removeClass("ThemeClassic");

        $("div.board").removeClass("ThemeNumbers");
        $("div.board").removeClass("ThemeKids");
        $("div.board").removeClass("ThemeClassic");
        $("div.board").removeClass("ThemePrime");

        $("body").removeClass("ThemeBlast4");
        $("body").removeClass("ThemeKids");
        $("body").removeClass("ThemePrime");
        $("body").removeClass("ThemeClassic");
    }


    //Init game Mode 01: controllerMode-01 - blast4 & classic
    this.initGameMode01 = function (mode) {
        this.removeAllThemes();
	
        if (mode == 'classic') {
            $("div.board").addClass("ThemeClassic");
 	$("#header").addClass("ThemeClassic");
	$("body").addClass("ThemeClassic");
            $("#matchEndContainer").addClass("ThemeClassic");
        } else {
	$("body").addClass("ThemeBlast4");
            $("#matchEndContainer").addClass("ThemeBlast4");
        }

        $("div.board").addClass("ThemeBlast4");
        $("#header").addClass("ThemeBlast4");

        koVM.setControllerMode(new ControllerMode_01(koVM, mode));
    }


    //Init game Mode 02: controllerMode-02. For KIDS. ThemeKids and IA0/IA1
    this.initGameMode02 = function () {
        this.removeAllThemes();


        $("body").addClass("ThemeKids");
        $("div.board").addClass("ThemeKids");
        $("#header").addClass("ThemeKids");
        $("#matchEndContainer").addClass("ThemeKids");
	
        koVM.setControllerMode(new ControllerMode_02(koVM));
    }


    //Init game Mode 03: controllerMode-03 Prime
    this.initGameMode03 = function () {
        this.removeAllThemes();
 	$("body").addClass("ThemePrime");
        $("#header").addClass("ThemeBlast4");
        $("div.board").addClass("ThemeBlast4");
        $("div.board").addClass("ThemePrime");
        $("#matchEndContainer").addClass("ThemePrime");

       
        koVM.setControllerMode(new ControllerMode_03(koVM));
    }


    this.bindKoVM = function () {
        //Apply binding to KnockOut
        koVM = new KnockoutViewModel();
        ko.applyBindings(koVM);
    }

}


