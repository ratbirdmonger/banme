// --------------------------------------
// Information of recording
// Time: 2020-09-13 10:53:12
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

const { 
    pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, selectAbilities, sleep, isEsperGaugeFull, isTurnReady, poll, tap, tapMiddle,
    tapBonusFriendOrDefault, isMainMenuTopBarVisible, areColorsPresentInRegion, atEventScreen, selectParty, readText, isDailyQuestCloseButtonActive,
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs,
    selectVortex, enterVortex, exitVortex, exitToVortex, selectMainMenu, selectCompanionTab, tapActiveMainMenuButton, tapMainMenuAdButton,
    readEventText
} = require(`${at.rootDir()}/ffbe/ffbe`);


usleep(1000000);

if(!(readEventText() == "Training with Elena")) {
    enterVortex();
    selectVortex(0, 3);
}

// tap LGD - if low on NRG, pops up the recovery dialog
tap(900, 1200);
sleep(1.5);

// tap next
tap(780, 1960);
sleep(1.5);

tapBonusFriendOrDefault([0, 1, 2, 0]);

if(!selectParty("EW")) {
    alert("Could not find EW party");
    at.stop();
}

// tap depart
tap(820, 1880);

poll(isTurnReady, 30, 1);

// unit 1 (vaan) steal and break
selectAbilities(1, [{x: 2, y: 1}, {x: 4, y: 0}, {x: 7, y: 0}]);
// unit 3 (elena) damage
selectAbilities(3, [{x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 0}, {x: 3, y: 0}]);
activateUnit(1);
activateUnit(2);
activateUnit(3);
activateUnit(4);
activateUnit(5);
activateUnit(6);
sleep(1.5);

poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
if(isTurnReady) {
    pressReload();
    pressRepeat();
    poll(isMainMenuTopBarVisible, 30, 1);
}

dismissVictoryScreenDialogs();