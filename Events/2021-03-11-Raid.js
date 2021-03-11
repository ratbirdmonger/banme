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
const EVENT_TEXT = "Grand"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 1;
const SELECT_LOCATION = "bottom";

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Vanille breaks
        selectAbilities(1, [{x: 7, y: 0}, {x: 11, y: 0}, {x: 11, y: 1}])

        // Rightning LB to kill multiple enemies
        selectAbilities(5, [{x: 0, y: 0}])

        // NV Lightning does damage
        selectAbilities(2, [{x: 5, y: 1}, {x:7, y: 1}, {x: 7, y: 1}, {x: 7, y: 1}])

        // Fang damage
        selectAbilities(3, [{x: 1, y: 1}, {x: 4, y: 0}, {x: 4, y: 0}])

        // Lumina pilfers
        selectAbilities(4, [{x: 6, y: 1}])

        // break first, then DPS
        activateUnit(1); sleep(1);
        _.forEach(_.range(2,7), function(i) {activateUnit(i)});
    } else {
        // no cooldowns were used previously so reload & repeat
        pressReload();        
        activateUnit(1); sleep(1);
        _.forEach(_.range(2,7), function(i) {activateUnit(i)});
    }
}

function executeMK0225() {
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

if(module === undefined) { var module = {}; sleep(0.5); while(executeMK0225()) { }; }
module.exports = {
    executeMK0225
}