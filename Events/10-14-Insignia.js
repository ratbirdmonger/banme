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

usleep(1000000);

// tap(800, 1070);
// sleep(1.5);

// // tap next
// tap(780, 1960);
// sleep(1.5);

// const SCROLL_BUTTON_INITIAL_LOCATION = {x: 1515, y: 775};
// const SCROLL_BUTTON_END_LOCATION = {x: 1515, y: 2023};

// // scroll all the way to the bottom, then select no companion
// swipe(SCROLL_BUTTON_INITIAL_LOCATION.x, SCROLL_BUTTON_INITIAL_LOCATION.y, 
//     SCROLL_BUTTON_END_LOCATION.x, SCROLL_BUTTON_END_LOCATION.y);
// sleep(0.5);
// tap(800, 1920);
// sleep(1);

// const PARTY_NAME = "PARTY 5";
// if(!selectParty(PARTY_NAME)) {
//     alert(`Could not find ${PARTY_NAME} party`);
//     at.stop();
// }

// // tap depart
// tap(820, 1880);

// poll(isTurnReady, 30, 1);

// MMXon break
// selectAbilities(4, [{x: 4, y: 1}, {x: 12, y: 0}, {x: 12, y: 0}, {x: 12, y: 0}]);
// Loren DPS
selectAbilities(2, [{x:1, y:0}, {x: 9, y: 0}, {x: 9, y: 0}, {x: 9, y: 0}]);
// Cloud DPS
selectAbilities(5, [{x:1, y:1}, {x: 4, y: 1}, {x: 4, y: 1}, {x: 4, y: 1}], true);

// activateUnit(4);
// sleep(15);

// while(true) {
//     poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
//     if(isTurnReady()) {
//         pressReload();
//         activateUnit(3);
//         sleep(0.5);
//         activateUnit(2);
//         activateUnit(4);
//         activateUnit(5);
//         activateUnit(6);
//         sleep(1);
//         activateUnit(1);
//         sleep(1); 
//     } else {
//         break;
//     }
// }

// dismissVictoryScreenDialogs();