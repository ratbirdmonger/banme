const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, findImage } = at

const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs        
 } = require(`${at.rootDir()}/banme/banme-common`);
const {
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);

    // select difficulty (there's only one)
    tap(770, 670);
    sleep(1.5);

    // next
    tap(780, 1970);
    sleep(1)

    // "Unit Limited Quest" back button here 
    tap(715, 1525);
    sleep(1);
    
    // select party
    if(!selectParty("ext")) {
        alert("Could not find ext party");
        at.stop();
    }

    // tap depart
    tap(820, 1880);

    poll(isTurnReady, 30, 1);

// unit 1 10000 needles
selectAbilities(1, [{x:5, y:1}]);
// unit 2 2xCWA
selectAbilities(2, [{x:4, y:0}, {x:6, y:0}, {x:6, y:0}]);
// unit 3 flood
selectAbilities(3, [{x:6, y:1}]);
// unit 4 DKL - executioner, dark flow
selectAbilities(4, [{x:1, y:0}, {x:5, y:1}, {x:2, y:1}]);
// unit 5 WRF - LB (to unlock triple cast)
selectAbilities(5, [{x:0, y:0}]);

activateUnit(1);
activateUnit(2);
activateUnit(3);
activateUnit(4);
activateUnit(5);
activateUnit(6);

sleep(1);
// rounds 2 and 3
while(true) {
    poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
    if(isTurnReady()) {
        pressReload();
        // unit 4 DKL - executioner, dark flow
        selectAbilities(4, [{x:1, y:0}, {x:4, y:1}, {x:6, y:1}, {x:6, y:1}]);
        selectAbilities(5, [{x:1, y:0}, {x:2, y:1}, {x:2, y:1}, {x:2, y:1}]);

        activateUnit(3); // flood
        sleep(0.967);
        activateUnit(4); // 3x AMoE
        sleep(0.316)
        activateUnit(2); // 2x CWA
        sleep(0.05);
        activateUnit(5); // 3x DR
        activateUnit(1);
        sleep(1);
    } else {
        break;
    }
}

dismissVictoryScreenDialogs();