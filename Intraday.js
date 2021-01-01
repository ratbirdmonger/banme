const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, getColor, getColors } = at
const { intToRgb } = utils
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
    safeRequire,
    // basic gestures
    swipe, sleep, tap, tapMiddle, doubleTap,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll, findColorsInRegion,
    // debug
    debug
} = require(`${at.rootDir()}/bot-common/bot-common`);

const { executeArenaLoop } = safeRequire(`${at.rootDir()}/banme/Arena`);
const { executeExpeditionLoop } = safeRequire(`${at.rootDir()}/banme/Expedition`);
// const { executeRaid1217 } = safeRequire(`${at.rootDir()}/banme/Events/2020-12-17-Raid`);

appActivate("com.square-enix.ffbeww");

// Arena
selectMainMenu("Arena");
tapActiveMainMenuButton();
poll(isBackButtonActive, 10, 0.5, "Arena screen");
sleep(0.5); // make sure the screen finishes fading in
executeArenaLoop();
tapBackButton(); // back to main menu
poll(function(){return getMainMenuLabel() == "World"}, 2, 0.5, "Wait for main menu");

// Raid
// while(executeRaid1217());
// tapBackButton();
// exitVortex(); // back to main menu
// poll(function(){return getMainMenuLabel() == "World"}, 2, 0.5, "Wait for main menu");

// Expeditions
selectMainMenu("Expedition");
tapActiveMainMenuButton();
poll(isBackButtonActive, 10, 0.5, "Expedition screen");
executeExpeditionLoop();
tapBackButton(); // back to main menu
sleep(0.5);
if(isDailyQuestCloseButtonActive()) {
    tapDailyQuestCloseButton(); sleep(1);
}
poll(function(){return getMainMenuLabel() == "World"}, 2, 0.5, "Wait for main menu");