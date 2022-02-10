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
const COMPANION_TAB_PRIORITY = -1;
const VORTEX_X = 0; const VORTEX_Y = 0;
const SELECT_LOCATION = "middle";

sleep(0.5);

// requires cheating
function executeTurnFunction(turn) {
    if(turn == 1) {
        // DPS
        selectAbilities(1, [{x: 3, y: 0}, {x: 5, y: 1}, {x: 3, y: 1}, {x: 3, y: 1}])
        selectAbilities(3, [{x: 0, y: 0}])
        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    } else {
        pressReload();

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    }
}

function executeEvent071321() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        selectLocation: SELECT_LOCATION,
        companionTabPriority: COMPANION_TAB_PRIORITY,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeEvent071321()) { }; }
module.exports = {
    executeEvent071321
}
