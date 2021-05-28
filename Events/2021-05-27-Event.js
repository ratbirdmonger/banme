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
const EVENT_TEXT = "Consumer"
const COMPANION_TAB_PRIORITY = 0;
const VORTEX_X = 0; const VORTEX_Y = 0;
const SELECT_LOCATION = "middle";

sleep(0.5);

// requires cheating
function executeTurnFunction(turn) {
    if(turn == 1) {
        // DPS
        selectAbilities(1, [{x: 7, y: 0}])
        selectAbilities(4, [{x: 1, y: 0}, {x: 3, y: 0}, {x: 3, y: 0},  {x: 3, y: 0}])
        selectAbilities(5, [{x: 1, y: 1}, {x: 3, y: 1}, {x: 3, y: 1},  {x: 3, y: 1}])
        selectAbilities(3, [{x: 6, y: 0}]) // bushido

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    } else {
        pressReload();

        activateUnit(3); 
        sleep(1);
        activateUnit(1);
        sleep(1);

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    }
}

function executeMK0527() {
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

if(module === undefined) { var module = {}; sleep(0.5); while(executeMK0527()) { }; }
module.exports = {
    executeMK0527
}
