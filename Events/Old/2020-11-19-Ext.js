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

const PARTY_NAME = "ext";

function execute1119Ext() {
    // select difficulty (there's only one, it's at slot #1)
    tap(770, 675);
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

    // unit 2 dispel, break, damage
    selectAbilities(2, [{x:1, y:1}, {x:11, y:0}, {x:8, y:1}, {x:10, y:1}]);
    // unit 4 LB
    selectAbilities(4, [{x:0, y:0}]);


    activateUnit(2);
    sleep(1);
    activateUnit(4);

    sleep(1);
    poll(isMainMenuTopBarVisible, 30, 1);

    dismissVictoryScreenDialogs();
}

module.exports = {
    execute1119Ext
}