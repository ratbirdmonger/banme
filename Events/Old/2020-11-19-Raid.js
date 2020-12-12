const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName, selectNoCompanion,
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

const RAID_ORB_REGION = { x: 1197, y: 476, width: 64, height: 59};
const RAID_ORB_COLORS = [
    { color: 6680888, x: 0, y: 0 },
    { color: 5563937, x: 4, y: 0 }
]

const PARTY_NAME = "Raid";

function raidOrbsLeft() {
    return areColorsPresentInRegion(RAID_ORB_COLORS, RAID_ORB_REGION);
}

function executeRaid(count) {
    // tap ELT
    tap(950, 1540);
    sleep(1.5);

    // tap Next
    tap(780, 1950);
    sleep(1.5);

    // LOL no one is bothering
    selectNoCompanion();

    // select party
    if(!selectParty(PARTY_NAME)) {
        alert(`Could not find ${PARTY_NAME} party`);
        at.stop();
    }

    // tap depart
    tap(820, 1880);

    poll(isTurnReady, 30, 1);

    // select the commands if this is the first time running, otherwise just reload
    if(count == 0) {
        // unit 4 World Destroyer
        selectAbilities(4, [{x:3, y:0}]);
        // unit 5 3xCWA
        selectAbilities(5, [{x:3, y:1}, {x:6, y:0}, {x:7, y:1}, {x:7, y:1}]);
    } else {
        pressReload();
    }
    
    activateUnit(4);
    sleep(1);
    activateUnit(5);

    poll(isMainMenuTopBarVisible, 30, 1);
    dismissVictoryScreenDialogs();
}

function executeRaid20201119Loop() {
    let count = 0;
    while(raidOrbsLeft()) {  
        executeRaid(count);
        count++;
    }
}

if(module === undefined) { var module = {}; executeRaid20201119Loop(); }
module.exports = {
    executeRaid20201119Loop
}