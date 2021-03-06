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
const EVENT_TEXT = "Leviathan"
const VORTEX_X = 0; const VORTEX_Y = 0;
const SELECT_LOCATION = "top";

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Requires Ardyn up to 30M
        selectAbilities(2, [{x: 1, y: 1}, {x: 2, y: 0}, {x: 2, y: 0}])
        selectAbilities(3, [{x: 1, y: 1}, {x: 11, y: 0}, {x: 11, y: 0}, {x: 11, y: 0}])
        selectAbilities(4, [{x: 3, y: 0}, {x: 5, y: 0}, {x: 5, y: 0}])
        selectAbilities(5, [{x: 6, y: 1}, {x: 12, y: 0}, {x: 12, y: 0}, {x: 12, y: 0}])
        selectAbilities(1, [{x: 0, y: 1}]) // some random esper

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    } else {
        // no cooldowns were used previously so reload & repeat
        pressReload();
        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    }
}

function executeFF15Levia() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        selectLocation: SELECT_LOCATION,
        partyName: PARTY_NAME,
        companionTabPriority: [0, 1, 2],
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeFF15Levia()) { }; }
module.exports = {
    executeFF15Levia
}
