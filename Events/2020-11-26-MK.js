const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText, isEnergyRecoveryBackButtonActive, tapEnergyRecoveryBackButton,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
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
const VORTEX_X = 0; const VORTEX_Y = 0;

function executeTurn(turn) {
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

function tapDifficulty(hasBanner) {
    if(hasBanner) {
        tap(900, 1200); // top option when there's a banner
    } else {
        tap(770, 675); // top option when there's no banner
    }

    sleep(1.5);
}

usleep(1000000);

function executeMK1126Loop() {
    while(executeMK1126()) { }
}

function executeMK1126() {
    if(!(readEventText().includes(EVENT_TEXT))) {
        enterVortex();
        selectVortex(VORTEX_X, VORTEX_Y);
    }
    
    tapDifficulty(true);

    if(isEnergyRecoveryBackButtonActive()) {
        // ran out of energy, time to stop
        tapEnergyRecoveryBackButton();
        return false;
    }
    
    // tap next
    tap(780, 1960);
    sleep(1.5);
    
    tapBonusFriendOrDefault(COMPANION_TAB_PRIORITY);
    
    if(!selectParty(PARTY_NAME)) {
        alert(`Could not find ${PARTY_NAME}`);
        at.stop();
    }
    
    // tap depart
    tap(820, 1880);
    
    var turn = 1;
    poll(isTurnReady, 30, 1);
    executeTurn(turn++); sleep(1);

    while(true) {
        poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
        if(isTurnReady()) {
            executeTurn(turn++); sleep(1);
        } else {
            break;
        }
    }
    
    dismissVictoryScreenDialogs();

    return true;
}

if(module === undefined) { var module = {}; executeMK1126Loop(); }
module.exports = {
    executeMK1126, executeMK1126Loop
}