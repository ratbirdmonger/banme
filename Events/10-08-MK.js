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

if(!(readEventText() == "Leviathan")) {
    enterVortex();
    selectVortex(0, 0);
}

// tap LGD - if low on NRG, pops up the recovery dialog
tap(900, 1200);
sleep(1.5);

// tap next
tap(780, 1960);
sleep(1.5);

tapBonusFriendOrDefault([1, 2, 0]);

if(!selectParty("MK")) {
    alert("Could not find MK party");
    at.stop();
}

// tap depart
tap(820, 1880);

poll(isTurnReady, 30, 1);

// Aileen restores MP
selectAbilities(1, [{x: 6, y: 1, target: 1}]);
// unit 2 Minwu heal
selectAbilities(2, [{x:5, y:1, target: 1}]);
// Emperor WD (keeps changing because the bastard keeps leveling up)
selectAbilities(3, [{x:6, y:0}]);
// unit 4 (DKL) damage 
selectAbilities(4, [{x: 1, y: 0}, {x: 6, y: 0}, {x: 6, y: 0}]);
// unit 5 (WRF) AoE damage
selectAbilities(5, [{x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 0}]);

activateUnit(3);
sleep(0.5);
activateUnit(2);
activateUnit(4);
activateUnit(5);
activateUnit(6);
sleep(1);
activateUnit(1);
sleep(1);

while(true) {
    poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
    if(isTurnReady()) {
        pressReload();
        activateUnit(3);
        sleep(0.5);
        activateUnit(2);
        activateUnit(4);
        activateUnit(5);
        activateUnit(6);
        sleep(1);
        activateUnit(1);
        sleep(1); 
    } else {
        break;
    }
}

dismissVictoryScreenDialogs();