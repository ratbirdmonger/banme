const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText,
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

usleep(1000000);

function executeMK1126() {
    if(!(readEventText().includes(EVENT_TEXT))) {
        enterVortex();
        selectVortex(0, 0);
    }
    
    // select difficulty
    tap(900, 1200); // top option when there's a banner
    sleep(1.5);
    
    // tap next
    tap(780, 1960);
    sleep(1.5);
    
    tapBonusFriendOrDefault([1, 2, 0]);
    
    if(!selectParty(PARTY_NAME)) {
        alert(`Could not find ${PARTY_NAME}`);
        at.stop();
    }
    
    // tap depart
    tap(820, 1880);
    
    poll(isTurnReady, 30, 1);
    
    // Rikku break
    selectAbilities(3, [{x: 3, y: 0}, {x: 7, y: 1}, {x: 8, y: 0}])

    // Tifa 
    selectAbilities(2, [{x:3, y:0}, {x:9, y:0}, {x:9, y:0}, {x:9, y:0}])

    // Cloud shifts, then AoE 
    selectAbilities(5, [{x:1, y:1}, {x:5, y:0}, {x:5, y:0}, {x:5, y:0}], true) // Cloud

    activateUnit(3);
    sleep(2);
    activateUnit(2);
    activateUnit(5);

    activateUnit(1);
    activateUnit(4);
    activateUnit(6);

    sleep(1);

    while(true) {
        poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
        if(isTurnReady()) {
            pressReload();
            sleep(0.5);
    
            // unit should have stayed in BS, so just select the same moves
            activateUnit(3);
            sleep(2);
            activateUnit(2);
            activateUnit(5);

            activateUnit(1);
            activateUnit(4);
            activateUnit(6);
            sleep(3);
        } else {
            break;
        }
    }
    
    dismissVictoryScreenDialogs();
}

if(module === undefined) { var module = {}; executeMK1126(); }
module.exports = {
    executeMK1126
}