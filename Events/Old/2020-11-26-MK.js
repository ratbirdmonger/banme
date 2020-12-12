const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

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
 } = require(`${at.rootDir()}/banme/banme-common`);
const {
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);

const PARTY_NAME = "Behemoth";
const EVENT_TEXT = "Scala"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 3;

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Rikku break
        selectAbilities(3, [{x: 3, y: 0}, {x: 7, y: 1}, {x: 8, y: 0}])
        // Tifa 3xSR
        selectAbilities(2, [{x:3, y:0}, {x:9, y:0}, {x:9, y:0}, {x:9, y:0}])
        // Cloud shifts, then 3xSR AoE 
        selectAbilities(5, [{x:1, y:1}, {x:5, y:0}, {x:5, y:0}, {x:5, y:0}], true)

        activateUnit(3); sleep(2);
        activateUnit(2); activateUnit(5); activateUnit(1); activateUnit(4); activateUnit(6);
    } else {
        // Cloud should have stayed in BS, so just select the same moves
        pressReload(); sleep(0.5);
    
        activateUnit(3);sleep(2);
        activateUnit(2); activateUnit(5); activateUnit(1); activateUnit(4); activateUnit(6);
    }
}

function executeMK1126() {
    let arguments = {
        vortexX: VORTEX_X,
        vortexY: VORTEX_Y,
        eventText: EVENT_TEXT,
        hasBanner: true,
        companionTabPriority: COMPANION_TAB_PRIORITY,
        partyName: PARTY_NAME,
        executeTurnFunction: executeTurnFunction
    };

    return executeEvent(arguments);
}

if(module === undefined) { var module = {}; sleep(0.5); while(executeMK1126()) { }; }
module.exports = {
    executeMK1126
}