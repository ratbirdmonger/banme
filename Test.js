const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast } = at

const { 
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, selectMainMenu, getMainMenuLabel,
    tapActiveMainMenuButton, tapMainMenuAdButton, isBackButtonActive, readEventText,
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

const { executeExpeditionLoop } = require(`${at.rootDir()}/banme/Expedition`);
const { executeArenaLoop } = require(`${at.rootDir()}/banme/Arena`);

usleep(500000);

// unit 1 (vaan) steal and break
selectAbilities(1, [{x: 2, y: 1}, {x: 4, y: 0}, {x: 7, y: 0}]);
// unit 3 (elena) damage
selectAbilities(3, [{x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 0}, {x: 3, y: 0}]);
activateUnit(1);
activateUnit(2);
activateUnit(3);
activateUnit(4);
activateUnit(5);
activateUnit(6);
sleep(1.5);
