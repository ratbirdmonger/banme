const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, findImage } = at

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

const PARTY_NAME = "Raid";

function execute1015Ext() {
    // select difficulty (there's only one, but it's at slot #2)
    tap(770, 1010);
    sleep(1.5);

    // next
    tap(780, 1970);
    sleep(1.5)

    // "Unit Limited Quest" back button here 
    tap(715, 1525);
    sleep(1);
    
    // select party
    if(!selectParty(PARTY_NAME)) {
        alert(`Could not find ${PARTY_NAME} party`);
        at.stop();
    }

    // tap depart
    tap(820, 1880);

    poll(isTurnReady, 30, 1);

    // unit 2 3xAMoE
    selectAbilities(2, [{x:2, y:0}, {x:9, y:1}, {x:9, y:0}, {x:9, y:0}]);
    // unit 5 2xAMoE
    selectAbilities(5, [{x:2, y:0}, {x:7, y:1}, {x:7, y:1}]);
    // unit 3 2xAMoE
    selectAbilities(3, [{x:1, y:0}, {x:1, y:1}, {x:1, y:1}]);    

    activateUnit(2);
    activateUnit(5);
    sleep(0.9);
    activateUnit(3);

    sleep(1);
    poll(isMainMenuTopBarVisible, 30, 1);

    dismissVictoryScreenDialogs();
}

module.exports = {
    execute1015Ext
}