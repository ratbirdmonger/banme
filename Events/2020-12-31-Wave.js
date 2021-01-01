const _ = require('lodash');
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

const PARTY_NAME = "MK";
const EVENT_TEXT = "Save"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 3;
const SELECT_LOCATION = "middle";

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Christine
        selectAbilities(4, [{x: 5, y: 0}, {x: 14, y: 0}, {x: 14, y: 0}])

        // Lucas
        selectAbilities(2, [{x:4, y:0}, {x:10, y:1}, {x:10, y:1}])

        // Kryla
        selectAbilities(3, [{x:1, y:1}, {x:12, y:0}, {x:12, y:0}, {x:12, y:0}])

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    } else {
        pressReload();
        
        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    }

}

function executeWave1224() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        selectLocation: SELECT_LOCATION,
        companionTabPriority: COMPANION_TAB_PRIORITY,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeWave1224()) { }; }
module.exports = {
    executeWave1224
}