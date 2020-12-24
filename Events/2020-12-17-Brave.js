const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at
const {
    safeRequire,
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);

const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText, isEnergyRecoveryBackButtonActive, tapEnergyRecoveryBackButton,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName, selectNoCompanion,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    executeEvent,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs        
 } = safeRequire(`${at.rootDir()}/banme/banme-common`);

const PARTY_NAME = "Brave";
const EVENT_TEXT = "Brave"
const VORTEX_X = 4; const VORTEX_Y = 0;

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Xon BREAK
        selectAbilities(1, [{x:2, y:1}, {x:10, y:0}, {x:10, y:0}, {x:10, y:0}]);
        // Strago pilfer
        selectAbilities(4, [{x: 9, y: 1}]);

        // Shadow break. damage
        selectAbilities(2, [{x: 3, y: 1}, {x: 13, y: 0}, {x: 13, y: 0}, {x: 13, y: 0}])
        // Cloud 3xSR
        selectAbilities(5, [{x:3, y:0}, {x:6, y:0}, {x:6, y:0}, {x:6, y:0}])
        // Terra 3xCWA
        selectAbilities(3, [{x:3, y:0}, {x:5, y:0}, {x:5, y:0}, {x:5, y:0}])


        // steal, break
        activateUnit(1); activateUnit(4);
        sleep(35);

        activateUnit(2); activateUnit(5); activateUnit(3); activateUnit(6);
    } else {
        alert("should've been done!");
        at.stop();
    }
}

function executeBrave1217() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        selectLocation: "top",
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeBrave1217()) { }; }
module.exports = {
    executeBrave1217
}