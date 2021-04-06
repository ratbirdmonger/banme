const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at
const _ = require('lodash');

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

const PARTY_NAME = "Wave";
const EVENT_TEXT = "Bad"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 0;

function executeTurnFunction(turn) {
    if(turn == 1) {
        selectAbilities(2, [{x: 1, y: 1}, {x: 3, y: 1}, {x: 3, y: 1}, {x: 3, y: 1}])
        selectAbilities(5, [{x: 1, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}])
        selectAbilities(3, [{x: 1, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}])

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    } else {
        pressReload();

        _.forEach(_.range(1,7), function(i) {activateUnit(i)});
    }

}

function executeEW20210401() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        selectLocation: "middle",
        companionTabPriority: COMPANION_TAB_PRIORITY,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeEW20210401()) { }; }
module.exports = {
    executeEW20210401
}