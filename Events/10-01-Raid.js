// --------------------------------------
// Information of recording
// Time: 2020-09-13 10:53:12
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

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

const RAID_ORB_REGION = { x: 1197, y: 476, width: 64, height: 59};
const RAID_ORB_COLORS = [
    { color: 6680888, x: 0, y: 0 },
    { color: 5563937, x: 4, y: 0 }
]

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

    tapBonusFriendOrDefault([2, 1, 0]); // start with event 2, then event 1, then favorites

    if(!selectParty("Raid")) {
        alert("Could not find Raid party");
        at.stop();
    }

    // tap depart
    tap(820, 1880);

    poll(isTurnReady, 30, 1);

    // select the commands if this is the first time running, otherwise just reload
    if(count == 0) {
        // Vaan triple ability, It's Mine, full breakdown x 2
        selectAbilities(1, [{x: 4, y: 0}, {x: 5, y: 0}, {x: 8, y: 0}, {x: 8, y: 0}]);
        // Ashe triple ability, Grand Flame, Magna Flame x 2
        selectAbilities(2, [{x: 3, y: 1}, {x: 8, y: 1}, {x: 10, y: 0}, {x: 10, y: 0}]);
        // Fran triple ability, shooting star shot x 3
        selectAbilities(5, [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 1}, {x: 2, y: 1}]);
    } else {
        pressReload();
    }

    activateUnit(1);
    sleep(0.5); // let the break take effect
    activateUnit(2);
    activateUnit(5);

    poll(isMainMenuTopBarVisible, 30, 1);
    dismissVictoryScreenDialogs();
}

function executeRaidLoop() {
    let count = 0;
    while(raidOrbsLeft()) {  
        executeRaid(count);
        count++;
    }
}

module.exports = {
    executeRaidLoop
}