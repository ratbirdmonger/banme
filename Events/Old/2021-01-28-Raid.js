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
const EVENT_TEXT = "Battle"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 3;

function executeTurnFunction(turn) {
    // Vaan
    selectAbilities(1, [{x: 0, y: 0}])

    // Physalis
    selectAbilities(2, [{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 1}, {x: 3, y: 1}])
    // Sol
    selectAbilities(3, [{x:2, y:0}, {x: 2, y: 1}, {x: 2, y: 1}, {x: 2, y: 1}])

    // PGL SPR break
    selectAbilities(5, [{x:10, y:0}])

    activateUnit(5);
    sleep(0.5);

    activateUnit(1); activateUnit(4); activateUnit(2);
    activateUnit(3); activateUnit(6); 
}

function executeRaid20210128() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        selectLocation: "bottom",
        companionTabPriority: COMPANION_TAB_PRIORITY,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeRaid20210128()) { }; }
module.exports = {
    executeRaid20210128
}