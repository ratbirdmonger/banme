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

const PARTY_NAME = "EW2";

usleep(1000000);

function executeEW1029() {
    if(!(readEventText().includes("Grave"))) {
        enterVortex();
        selectVortex(0, 5);
    }
    
    tap(900, 1200);
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
    
    // unit 2 Ibara 3xBS
    selectAbilities(2, [{x:1, y:0}, {x: 3, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}], true);
    
    // unit 5 GLS 3xBS 
    selectAbilities(5, [{x: 4, y: 0}, {x:5, y:1}, {x:5, y:1}, {x:5, y:1}]);
    
    // unit 4 some random magic
    selectAbilities(4, [{x: 2, y: 1}]);

    activateUnit(1);
    activateUnit(3);
    activateUnit(6);
    sleep(3);

    activateUnit(2);
    activateUnit(5);
    activateUnit(4);

    sleep(1);

    while(true) {
        poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
        if(isTurnReady()) {
            pressReload();
            sleep(0.5);
    
            // unit should have stayed in BS, so just select the same moves
            selectAbilities(2, [{x:1, y:0}, {x: 3, y: 0}, {x: 3, y: 0}, {x: 3, y: 0}]);

            activateUnit(1);
            activateUnit(3);
            activateUnit(6);
            sleep(3);
        
            activateUnit(2);
            activateUnit(5);
            activateUnit(4); 
            sleep(3);
        } else {
            break;
        }
    }
    
    dismissVictoryScreenDialogs();
}

if(module === undefined) { var module = {}; executeEW1029(); }
module.exports = {
    executeEW1029
}