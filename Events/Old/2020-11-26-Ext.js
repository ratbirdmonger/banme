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

const PARTY_NAME = "Behemoth";

function execute1126Ext() {
    // select difficulty
    tap(770, 675); // top option when there's no banner
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

    // Rikku breaks
    selectAbilities(3, [{x: 3, y: 0}, {x: 7, y: 1}, {x: 8, y: 0}]);

    // Tifa and Cloud chain
    selectAbilities(2, [{x:3, y:0}, {x:9, y:0}, {x:9, y:0}, {x:9, y:0}]);
    selectAbilities(5, [{x:1, y:1}, {x:4, y:1}, {x:4, y:1}, {x:4, y:1}]);

    activateUnit(3);
    sleep(2);
    activateUnit(2);
    activateUnit(5);

    sleep(1);
    poll(isMainMenuTopBarVisible, 30, 1);

    dismissVictoryScreenDialogs();
}

module.exports = {
    execute1126Ext
}