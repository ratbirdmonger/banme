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
const EVENT_TEXT = "Girl"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 4;

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Locke break
        selectAbilities(1, [{x: 3, y: 0}, {x: 6, y: 0}, {x: 5, y: 1}])
        // Sabin 2xSR
        selectAbilities(4, [{x:1, y:0}, {x:4, y:0}, {x:4, y:0}])
        // Shadow 2xSR 
        selectAbilities(2, [{x:3, y:0}, {x:10, y:0}, {x:10, y:0}])

        activateUnit(1); 
        sleep(0.5);
        activateUnit(4); activateUnit(2);
        sleep(1.5);

        activateUnit(3); activateUnit(6); activateUnit(5);
    } else {
        pressReload(); sleep(0.5);
    
        activateUnit(1); 
        sleep(0.5);
        activateUnit(4); activateUnit(2);
        sleep(1.5);

        activateUnit(3); activateUnit(6); activateUnit(5);
    }
}

function executeMK1210() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        selectionLocation: "middle",
        companionTabPriority: COMPANION_TAB_PRIORITY,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeMK1210()) { }; }
module.exports = {
    executeMK1210
}