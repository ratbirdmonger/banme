const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, getColor, getColors } = at
const { intToRgb } = utils
const {
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, readEventText, areColorsPresentInRegion, poll, 
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, selectMainMenu, tapActiveMainMenuButton, tapMainMenuAdButton, isBackButtonActive, getMainMenuLabel,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, 
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs    
} = require(`${at.rootDir()}/ffbe/ffbe`);

const { executeRaidLoop } = require(`${at.rootDir()}/ffbe/Events/10-01-Raid`);
const { executeArenaLoop } = require(`${at.rootDir()}/ffbe/Arena`);
const { executeExpeditionLoop } = require(`${at.rootDir()}/ffbe/Expedition`);

appActivate("com.square-enix.ffbeww");

// Raid
enterVortex();
selectVortex(0, 0);
poll(isBackButtonActive, 10, 0.5);
sleep(0.5); // make sure the screen finishes fading in
executeRaidLoop();
tapBackButton();
exitVortex(); // back to main menu
poll(function(){return getMainMenuLabel() == "World"}, 2, 0.5, "Wait for main menu");

// Arena
selectMainMenu("Arena");
tapActiveMainMenuButton();
poll(isBackButtonActive, 10, 0.5);
sleep(0.5); // make sure the screen finishes fading in
executeArenaLoop();
tapBackButton(); // back to main menu
poll(function(){return getMainMenuLabel() == "World"}, 2, 0.5, "Wait for main menu");

// Expeditions
selectMainMenu("Expedition");
tapActiveMainMenuButton();
poll(isBackButtonActive, 10, 0.5);
executeExpeditionLoop();
tapBackButton(); // back to main menu
poll(function(){return getMainMenuLabel() == "World"}, 2, 0.5, "Wait for main menu");

// TODO: optionally burn off some NRG on some farming