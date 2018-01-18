
window.koVM = { desc: 'it will be set with KnockOut ViewModel object'};
window.gameControllerBase = new AppController();

window.currentController = gameControllerBase;
window.currentController.bindKoVM();

//To activate/deactive log. Disabled by default
//when a controller is in test mode, log is enabled.
window.logActive = false;
window.activeLog = function (value) { logActive = value; }
window.log = function (message) {
    if (!window.logActive) return;
    console.log(message)
}


window.soundOn = true;
window.switchSound = function () {
	window.soundOn = !window.soundOn;

$("img.soundIco").attr("style", "opacity: " + (window.soundOn ? 1 : 0.4));
}


window.audioBomb = new Audio('./sound/bomb.wav');
window.audioBombKids = new Audio('./sound/bombkids.mp3');
window.audioFullRow = new Audio('./sound/blackrow.mp3');
window.audioWin = new Audio('./sound/youwin.mp3');
window.audioLose = new Audio('./sound/youlose.mp3');

window.playAudio = function (audio) {
	if (!window.soundOn) return;
	 audio.play();
}


window.backToMainMenu = function () {
    $('#matchEndContainer').attr('style', 'display:none;');
    $('#menuManualContainer').attr('style', 'display:none;');
    $("div.score").attr("style", "display: none");
    $('#btnBackToMenu').removeClass('help');

    $('#menuIniContainer').attr('style', 'display:inline;');

   $('body').removeClass('ThemeKids');
   $('body').removeClass('ThemeClassic');
   $('body').removeClass('ThemeBlast4');
   $('body').removeClass('ThemePrime');


    $(".board").attr("style","visibility: hidden");

$("#header").attr("style","visibility: hidden");
	
    this.gameControllerBase.iniScore();
    this.koVM.board(board.newBoard());
}

window.openMenuManualContainer = function () {
    $('#menuIniContainer').attr('style', 'display:none;');
    $('#menuManualContainer').attr('style', 'display:inline;');

    $('#btnBackToMenu').addClass('help');
}

window.startGame = function (mode) {
   $("#header").removeAttr("style");
    window.log('start game mode ' + mode);
    this.gameControllerBase.startGame(mode);
}


window.newMatch = function () {
    this.gameControllerBase.newMatch();
    $('#matchEndContainer').attr('style', 'display:none;');
}


window.increaseScore = function (winner) {
    this.score.matches += 1;
    if (winner == 'U') {
        window.score.user += 1;
    } else {
        window.score.computer += 1;
    }

    window.log('user ' + window.score.user);
    window.log('computer ' + window.score.computer);
}

//Not used
window.wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}