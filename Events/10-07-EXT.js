const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, findImage } = at

const { 
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, readEventText, areColorsPresentInRegion, poll, 
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, selectMainMenu, getMainMenuLabel,
    tapActiveMainMenuButton, tapMainMenuAdButton, isBackButtonActive,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, 
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs    
} = require(`${at.rootDir()}/ffbe/ffbe`);

// WIP

// TODO round 1
// unit 1 10000 needles
// unit 2 2xCWA
// unit 3 flood
// unit 4 DKL - executioner, dark flow
// unit 5 WRF - LB (to unlock triple cast)

// round 2
activateUnit(3); // flood
sleep(0.967);
activateUnit(4); // 3x AMoE
sleep(0.316)
activateUnit(2); // 2x CWA
sleep(0.05);
activateUnit(5); // 3x DR
