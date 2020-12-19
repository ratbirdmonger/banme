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
        // Ibara break, damage
        selectAbilities(4, [{x: 3, y: 0}, {x: 7, y: 1}, {x: 6, y: 0}, {x: 6, y: 0}])
        // Physalis 3xCWA
        selectAbilities(2, [{x:1, y:1}, {x:2, y:0}, {x:2, y:0}, {x:2, y:0}])
        // Rem 3xCWA
        selectAbilities(5, [{x:10, y:0}, {x:12, y:1}, {x:14, y:0}, {x:14, y:0}])

        // Xon BREAK
        selectAbilities(3, [{x:2, y:1}, {x:10, y:0}, {x:10, y:0}, {x:10, y:0}]);
        // Vaan steal
        selectAbilities(1, [{x:0, y:0}]);
        activateUnit(3); activateUnit(1);
        sleep(35);

        activateUnit(2); activateUnit(5); activateUnit(4); activateUnit(6);
    } else {
        alert("should've been done!");
        at.stop();
    }
}

function executeBrave1210() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        hasBanner: false,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeBrave1210()) { }; }
module.exports = {
    executeBrave1210
}