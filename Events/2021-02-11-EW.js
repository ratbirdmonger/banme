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
const EVENT_TEXT = "Cattle"
const COMPANION_TAB_PRIORITY = [1, 2, 0];
const VORTEX_X = 0; const VORTEX_Y = 0;

function executeTurnFunction(turn) {
    if(turn == 1) {
        // Yoshi
        selectAbilities(2, [{x: 3, y: 0}, {x: 6, y: 0, target: 1}, {x: 6, y: 0, target: 4}, {x: 5, y: 1, target: 1}])
        selectAbilities(5, [{x: 4, y: 0}])

        // SElena
        selectAbilities(1, [{x: 2, y: 1}, {x: 5, y: 0}, {x: 5, y: 0}, {x: 5, y: 0}])
        selectAbilities(4, [{x: 1, y: 1}, {x: 4, y: 0}, {x: 4, y: 0}, {x: 4, y: 0}])

        // fish
        selectAbilities(3, [{x: 1, y: 0}, {x: 2, y: 1}, {x: 2, y: 1}, {x: 2, y: 1}])

        activateUnit(2);
        sleep(1);
        activateUnit(5);
        sleep(0.5);
        activateUnit(1); activateUnit(4); activateUnit(3); activateUnit(6); 
    } else {
        pressReload();

        activateUnit(2); activateUnit(5);

        sleep(2);

        activateUnit(1); activateUnit(4); activateUnit(3); activateUnit(6); 
    }

}

function executeEW20210211() {
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

if(module === undefined) { var module = {}; sleep(0.5); while(executeEW20210211()) { }; }
module.exports = {
    executeEW20210211
}