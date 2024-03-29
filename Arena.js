const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, stop } = at
const { 
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText, isImagePresentInRegion, isEnergyRecoveryBackButtonActive,
    isUnitLimitedQuestBackButtonActive,
    tapEnergyRecoveryBackButton, tapBottomLeftHomeButton, isRaidEnergyRecoveryBackButtonActive, tapRaidEnergyRecoveryBackButton,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName, selectNoCompanion,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    isBattleUnitReady, tapBraveShift, executeEvent,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs,
    closeHomeScreenAd
} = require(`${at.rootDir()}/banme/banme-common`);
const {
    // basic gestures
    swipe, sleep, tap, tapMiddle, doubleTap,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);

// top left part of the yellow Y
const you_won_colors = [
    { color: 13794838, x: 0, y: 0 },
    { color: 14527014, x: 4, y: 4 },
    { color: 16378726, x: 9, y: 8 }
];

// top left part of the blue Y
const you_lost_colors = [
    { color: 8693691, x: 0, y: 0 },
    { color: 11852265, x: -13, y: -5 },
    { color: 16777215, x: -18, y: -8 }
]

function isArenaDone() {
    return areColorsPresentInRegion(you_won_colors) || areColorsPresentInRegion(you_lost_colors);
}

// some blue-green pixel in the orb
const ARENA_ORB_COLORS = [{ color: 712639, x: 0, y: 0 }];
// first arena orb
const ARENA_ORB_CHECK_REGION = {x: 432, y: 1795, width: 64, height: 60};

function arenaOrbsLeft() {
    return areColorsPresentInRegion(ARENA_ORB_COLORS, ARENA_ORB_CHECK_REGION);
}

const OK_BUTTON = {x: 750, y: 1810};
const REWARD_OK_BUTTON = {x:780, y:1340};

const COLOSSEUM_BUTTON_COLORS = [
    { color: 3484193, x: 0, y: 0 },
    { color: 5319173, x: 0, y: -37 },
    { color: 15939590, x: 71, y: -19 }
];

const COLOSSEUM_BUTTON_REGION = { x:1285, y: 248, width: 237, height: 190 };

function atArenaScreen() {
    return areColorsPresentInRegion(COLOSSEUM_BUTTON_COLORS, COLOSSEUM_BUTTON_REGION);
}

// white and dark pixels from O and K
const OK_BUTTON_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 4931, x: 14, y: 0 },
    { color: 16777215, x: 28, y: 0 },
    { color: 6242, x: 58, y: -2 }
];

// sigh. the two OK buttons are slightly different at the pixel level
const OK_BUTTON_2_COLORS = [
    { color: 6992, x: 0, y: 0 },
    { color: 16777215, x: 20, y: 1 },
    { color: 16777215, x: 48, y: 1 },
    { color: 5726, x: 76, y: 0 }
]

// OK button shifts, increase height by 60 pixels to accommodate both
const OK_BUTTON_REGION = {x: 542, y: 1747, width: 451, height: 210}

const REWARD_OK_BUTTON_REGION = {x: 601, y: 1288, width: 332, height: 97 };

function isOkButtonActive() {
    //return areColorsPresentInRegion(OK_BUTTON_COLORS, OK_BUTTON_REGION) || areColorsPresentInRegion(OK_BUTTON_2_COLORS, OK_BUTTON_REGION);
    return isImagePresentInRegion(`${at.rootDir()}/banme/Images/arena-ok.png`, OK_BUTTON_REGION);
}

function isRewardOkButtonActive() {
    return isImagePresentInRegion(`${at.rootDir()}/banme/Images/arena-reward-ok.png`, REWARD_OK_BUTTON_REGION);
}

function multicastSR(orbsUsed, firstTurn) {
    var resetSkills = orbsUsed == 0 && firstTurn;    

    let unit1Acted = false;
    // check if someone died
    var dead5 = !isBattleUnitReady(4);
    var dead4 = !isBattleUnitReady(4);

    if(dead4 || dead5) {
        if(dead4) {
            selectAbilities(1, [{x: 1, y: 0}, {x: 5, y: 1, target: 4}, {x: 5, y: 1, target: 4}]);
        } else {
            selectAbilities(1, [{x: 1, y: 0}, {x: 5, y: 1, target: 5}, {x: 5, y: 1, target: 5}]);
        }
        activateUnit(1); unit1Acted = true;
    }

    if(isBattleUnitReady(3) && (resetSkills || isAutoAttackSelected(3))) {
        selectAbilities(3, [{x:5, y:1}]) // Bonus - Bushido
    }
    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x:4, y:1}, {x:11, y: 0}, {x:11, y: 0}]); // lucas
        // selectAbilities(2, [{x:1, y:1}, {x:8, y: 1}, {x:8, y: 1}]); // lilith
        //selectAbilities(2, [{x:1, y:1}, {x: 4, y: 0}, {x: 4, y: 0}, {x: 4, y: 0}]); // edel
    }    
    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x:2, y:0}, {x: 7, y: 1}, {x: 7, y: 1}]); // edel
    }
    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x:3, y:0}, {x: 8, y: 1}, {x: 8, y: 1}]) // edel
    }
    
    activateUnit(3); // Bushido first to dispel cover/mirage
    sleep(0.5);
    activateUnit(2);

    sleep(1.5);
    activateUnit(4);
    activateUnit(5);
    sleep(0.5);
    if(!unit1Acted) {    
        poll(isEsperGaugeFull, 10, 0.2);
        if(isAutoAttackSelected(1) && isEsperGaugeFull() && isBattleUnitReady(1)) {
            selectAbilities(1, [{x: 0, y: 1}]); // bonus unit summoning Odin
        }
        activateUnit(1);
    }
}

function singleCastSR(orbsUsed, firstTurn) {
    var resetSkills = orbsUsed == 0 && firstTurn;

    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x: 3, y: 0}]); // Locke
    }    
    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x: 6, y: 1}]); // King Rain
    }
    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x: 5, y: 1}]) // Tyro
    }
    if(isBattleUnitReady(1) && (resetSkills || isAutoAttackSelected(1))) {
        selectAbilities(1, [{x: 6, y: 1}]) // Faisy
    }
    
    activateUnit(1);
    activateUnit(2);
    activateUnit(4);
    activateUnit(5);
    sleep(0.2);
    poll(isEsperGaugeFull, 10, 0.2);
    if(isAutoAttackSelected(3) && isEsperGaugeFull() && isBattleUnitReady(3)) {
        selectAbilities(3, [{x: 0, y: 1}]); // bonus unit summoning Odin
    }
    activateUnit(3);
}

function multicastCWA(orbsUsed, firstTurn) {
    var resetSkills = orbsUsed == 0 && firstTurn;    

    let unit1Acted = false;
    // // check if the non-death immune Lucas died
    // if(!isBattleUnitReady(4)) {
    //     // yep, he died. better check the other one.
    //     if(!isBattleUnitReady(3)) {
    //         // ah crap the other one died too. Raise them both!
    //         selectAbilities(1, [{x: 1, y: 0}, {x: 5, y: 1, target: 4}, {x: 5, y: 1, target: 3}]);
    //     } else {
    //         // only the first Lucas died, so raise him and heal everyone else
    //         selectAbilities(1, [{x: 1, y: 0}, {x: 5, y: 1, target: 4}, {x: 2, y: 0, target: 1}]);
    //     }
    //     activateUnit(1); unit1Acted = true;
    // }

    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x:9, y:1}]) // Bonus - Bushido
    }
    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x: 6, y: 0}, {x: 11, y: 0}, {x: 11, y: 0}, {x: 11, y: 0}]); // White Lily
    }    
    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x: 2, y: 1}, {x: 4, y: 0}, {x: 4, y: 0}, {x: 4, y: 0}]); // Lucas
    }
    if(isBattleUnitReady(3) && (resetSkills || isAutoAttackSelected(3))) {
        selectAbilities(3, [{x:8, y:0}, {x: 11, y: 0}, {x: 11, y: 0}, {x: 11, y: 0}]) // MW Terra
    }
    
    activateUnit(5); // Bushido first to dispel cover/mirage
    sleep(1);
    activateUnit(2);
    activateUnit(4);
    activateUnit(3);
    sleep(0.5);
    if(!unit1Acted) {    
        poll(isEsperGaugeFull, 10, 0.2);
        if(isAutoAttackSelected(1) && isEsperGaugeFull() && isBattleUnitReady(1)) {
            selectAbilities(1, [{x: 0, y: 1}]); // bonus unit summoning Odin
        }
        activateUnit(1);
    }
}

function tornado(orbsUsed, firstTurn) {
    // healer should recover if anyone is incapacitated. ideally this would handle both death and ailments
    var resetSkills = orbsUsed == 0 && firstTurn;
    var deadUnit = -1;
    for(let i = 2; i < 5; i++) {
        if(!isBattleUnitReady(i)) {
            deadUnit = i;
            break;
        }
    }    
    if(deadUnit > 0) {
        selectAbilities(1, [{x: 6, y: 1, target: deadUnit}]); // Raise Dead+
        activateUnit(1);
    }

    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x: 7, y: 1}, {x: 5, y: 0}, {x: 7, y: 0}, {x: 7, y: 0}]); // Rem triple cast firaja, tornadox2 
    }
    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x:7, y:0}, {x:4, y:1}, {x:4, y:1}]) // Terra dualcast ultima
    }
    if(isBattleUnitReady(3) && (resetSkills || isAutoAttackSelected(3))) {
        selectAbilities(3, [{x: 6, y:0}, {x: 2, y: 1}, {x: 2, y: 1}]) // Minwu dualcast ultima
    }
    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x: 4, y:0}, {x:2, y: 1}, {x:2, y: 1}]); // Tyro dualcast tornado
    }    

    activateUnit(3); // 2xUltima
    activateUnit(4); // 2xUltima

    sleep(2.633);
    activateUnit(2); // firaja, tornadox2
    sleep(.9);
    activateUnit(5); // tornadox2

    poll(isEsperGaugeFull, 10, 0.2);
    if((resetSkills || isAutoAttackSelected(1)) && isEsperGaugeFull() && isBattleUnitReady(1)) {
        selectAbilities(1, [{x: 0, y: 1}]); // healer summons Odin
    }
    activateUnit(1);
}

// 1 - Faisy, 2 - Dark Veritas, 3 - Bonus, 4 & 5 - Lucas
function counters(orbsUsed, firstTurn) {
    var resetSkills = orbsUsed == 0 && firstTurn;    

    let unit1Acted = false;
    // check if the non-death immune Lucas died
    if(!isBattleUnitReady(4)) {
        // yep, he died. better check the other one.
        if(!isBattleUnitReady(3)) {
            // ah crap the other one died too. Raise them both!
            selectAbilities(1, [{x: 1, y: 0}, {x: 5, y: 1, target: 4}, {x: 5, y: 1, target: 3}]);
        } else {
            // only the first Lucas died, so raise him and heal everyone else
            selectAbilities(1, [{x: 1, y: 0}, {x: 5, y: 1, target: 4}, {x: 2, y: 0, target: 1}]);
        }
        activateUnit(1); unit1Acted = true;
    }

    if(isBattleUnitReady(3) && (resetSkills || isAutoAttackSelected(3))) {
        selectAbilities(3, [{x:8, y:0}]) // Bonus - Bushido
    }
    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x: 9, y:1}]); // Dark Veritas
    }    
    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x: 5, y: 1}, {x: 12, y: 0}, {x: 12, y: 0}]); // Lucas
    }
    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x:6, y:0}, {x: 12, y: 1}, {x: 12, y: 1}]) // Lucas
    }
    
    activateUnit(3); // Bushido first to dispel cover/mirage
    sleep(1);
    activateUnit(2);
    activateUnit(4);
    activateUnit(5);
    sleep(0.5);
    if(!unit1Acted) {    
        poll(isEsperGaugeFull, 10, 0.2);
        if(isAutoAttackSelected(1) && isEsperGaugeFull() && isBattleUnitReady(1)) {
            selectAbilities(1, [{x: 0, y: 1}]); // bonus unit summoning Odin
        }
        activateUnit(1);
    }
}

function executeArena(orbsUsed, battleFunction) {
    // setup button
    tap(800, 1900);
    sleep(1);

    // ok button
    tap(800, 1900);
    sleep(1.5);

    // select first opponent
    tap(1000, 1000);
    sleep(1.5);

    // confirm
    tap(1000, 1150);
    sleep(2);
    poll(function(){ return isBeginButtonActive() }, 20, 1);
    sleep(1);

    // start battle
    doubleTap(800, 1800);

    let firstTurn = true;
    while(true) {
        poll(function(){ return isArenaDone() || isTurnReady() }, 60, 1);
        if(isTurnReady()) {
            // try to save time doing a reload but if previous MP drain disabled our attacks we need to reset the attacks
            pressReload();
            sleep(1);

            battleFunction(orbsUsed, firstTurn);
            firstTurn = false;

            sleep(6); // give time for the reload/repeat button to be disabled
            // BUG: if a unit is dead at turn start, reload/repeat takes a long time to disable. try sleeping 6
        } else {
            // arena is done
            break;
        }
    }

    // results screen
    let okPressedTimes = 0;
    while(!atArenaScreen()) {
        if(isOkButtonActive()) {
            tapMiddle(OK_BUTTON_REGION);
            okPressedTimes++;
            if(okPressedTimes == 2) {
                sleep(2.5); // give time to get back to the arena screen
            } else {
                sleep(1);
            }
        } else if(isRewardOkButtonActive()) {
            tapMiddle(REWARD_OK_BUTTON_REGION);
            sleep(2.5);
        } else {
            tap(800, 1000); // tap away from the buttons to move things along
            sleep(0.25);
        }
    }
}

var BATTLE_FUNCTION = multicastSR;

function executeArenaLoop() {
    var orbsUsed = 0;
    while(arenaOrbsLeft()) {
        executeArena(orbsUsed, BATTLE_FUNCTION);
        orbsUsed++;
    }
    return orbsUsed;
}

const BEGIN_BUTTON_REGION = {x: 618, y: 1694, width: 73, height: 96}

function isBeginButtonActive() {
    return isImagePresentInRegion(`${at.rootDir()}/banme/Images/arena-begin.png`, BEGIN_BUTTON_REGION);
}

if(module === undefined) { var module = {}; executeArenaLoop(); }
module.exports = {
    executeArenaLoop
}