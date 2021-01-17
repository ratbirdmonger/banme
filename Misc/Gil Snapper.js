const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, getColor, getColors } = at
const { intToRgb } = utils
const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName, selectNoCompanion,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected, executeEvent,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs        
} = require(`${at.rootDir()}/banme/banme-common`);
const {
    // basic gestures
    swipe, sleep, tap, tapMiddle, doubleTap,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll, findColorsInRegion
} = require(`${at.rootDir()}/bot-common/bot-common`);

sleep(0.5);

function gilSnapper() {
    let arguments = {
        vortexX: 1, vortexY: 8,
        eventText: "Cave",
        selectLocation: "top",
        partyName: "story",
        executeTurnFunction: function(turn) {
            activateUnit(1); activateUnit(4); activateUnit(2); activateUnit(5); activateUnit(3);
        }
    };

    return executeEvent(arguments);
}


while(gilSnapper()) { };