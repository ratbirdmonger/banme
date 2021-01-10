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

const PARTY_NAME = "Wave";
const EVENT_TEXT = "Icy"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 1;
const SELECTION_LOCATION = "middle";

function executeTurnFunction(turn) {
    // Selena dispel & attack
    selectAbilities(5, [{x: 3, y: 0}, {x: 6, y: 1}, {x: 5, y: 1},  {x: 5, y: 1}])
    // Yoshi buff & attack
    selectAbilities(3, [{x:1, y:0}, {x:5, y:0}, {x:5, y:0}, {x:5, y:0}])

    activateUnit(1); activateUnit(4); activateUnit(2);
    activateUnit(3); activateUnit(6); activateUnit(5);
}

function executeWave1224() {
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

if(module === undefined) { var module = {}; sleep(0.5); while(executeWave1224()) { }; }
module.exports = {
    executeWave1224
}