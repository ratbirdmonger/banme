const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, stop } = at
const { 
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, selectMainMenu, getMainMenuLabel,
    tapActiveMainMenuButton, tapMainMenuAdButton, isBackButtonActive, readEventText,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    isBattleUnitReady,
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
// two white pixels from the OK and one light blue pixel from the border
const REWARD_OK_BUTTON_COLORS =  [
    { color: 16777215, x: 0, y: 0 },
    { color: 16777215, x: -26, y: 1 },
    { color: 12574975, x: 0, y: -51 }
];

function isOkButtonActive() {
    return areColorsPresentInRegion(OK_BUTTON_COLORS, OK_BUTTON_REGION) || areColorsPresentInRegion(OK_BUTTON_2_COLORS, OK_BUTTON_REGION);
}

function isRewardOkButtonActive() {
    return areColorsPresentInRegion(REWARD_OK_BUTTON_COLORS, REWARD_OK_BUTTON_REGION);
}

function multicastSR(orbsUsed, firstTurn) {
    var resetSkills = orbsUsed == 0 && firstTurn;
    var deadUnit = -1;
    var usedCD = false;

    // if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
    //     selectAbilities(2, [{x:1, y:1}, {x:5, y:0}, {x:5, y:0}, {x:5, y:0}], true) // Cloud
    // }
    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x: 1, y:0}, {x:3, y: 0}, {x:3, y: 0}]); // Locke
    }    
    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x: 3, y: 0}, {x: 6, y: 1}, {x: 6, y: 1}, {x: 6, y: 1}]); // King Rain
    }
    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x:4, y:0}, {x: 5, y: 1}, {x: 5, y: 1}, {x: 5, y: 1}]) // Tyro
    }
    
    activateUnit(1);
    activateUnit(2);
    // activateUnit(3);
    activateUnit(4);
    activateUnit(5);
    sleep(1);
    poll(isEsperGaugeFull, 10, 0.2);
    if(isAutoAttackSelected(3) && isEsperGaugeFull() && isBattleUnitReady(3)) {
        selectAbilities(3, [{x: 0, y: 1}]); // bonus unit summoning Odin
    }
    activateUnit(3);
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
    selectAbilities(1, [{x: 2, y: 0, target: 1}], true) // Faisy always brave shifts, heals
    
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
    // healer should recover if anyone is incapacitated. ideally this would handle both death and ailments
    var resetSkills = orbsUsed == 0 && firstTurn;
    var deadUnit = -1;
    var usedCD = false;

    // temporarily disabled - doesn't work if someone has an ailment
    // for(let i = 2; i < 5; i++) {
    //     if(!isBattleUnitReady(i)) {
    //         deadUnit = i;
    //         break;
    //     }
    // }

    // if(deadUnit > 0) {
    //     //selectAbilities(1, [{x: 6, y: 1, target: deadUnit}]); // Raise Dead+
    //     // Heal, Raise Dead+
    //     selectAbilities(1, [{x: 1, y: 0}, {x: 1, y: 1, target: 1}, {x: 6, y: 1, target: deadUnit}]); 
    //     activateUnit(1);
    //     sleep(1);
    //     if(isBattleUnitReady(2)) {
    //         // Rem heals & reraises
    //         selectAbilities(2, [{x: 8, y: 1}, {x: 10, y: 1, target: 1}, {x: 16, y: 0, target: 1}]);
    //         activateUnit(2);
    //         sleep(1);
    //     }
    // }

    if(isBattleUnitReady(4) && (resetSkills || isAutoAttackSelected(4))) {
        selectAbilities(4, [{x: 3, y: 1}, {x: 7, y: 0}, {x: 7, y: 0}, {x: 7, y: 0}]); // DS Sol CWAx3
    }
    if(isBattleUnitReady(2) && (resetSkills || isAutoAttackSelected(2))) {
        selectAbilities(2, [{x:9, y:0}, {x:13, y:0}, {x:13, y:0}, {x:13, y:0}]) // Rem CWA daggersx3
    }
    if(isBattleUnitReady(5) && (resetSkills || isAutoAttackSelected(5))) {
        selectAbilities(5, [{x:2, y:0}, {x: 5, y: 0}, {x: 5, y: 0}, {x: 5, y: 0}]) // DS Sol CWAx3
    }
    if(isBattleUnitReady(3) && (resetSkills || isAutoAttackSelected(3))) {
        selectAbilities(3, [{x: 6, y:0}, {x:9, y: 0}, {x:9, y: 0}, {x:9, y: 0}]); // Terra CWAx3
    }
    
    activateUnit(4);
    activateUnit(2);
    activateUnit(3);
    activateUnit(5);
    sleep(1);
    poll(isEsperGaugeFull, 10, 0.2);
    if((resetSkills || isAutoAttackSelected(1)) && isEsperGaugeFull() && isBattleUnitReady(1)) {
        selectAbilities(1, [{x: 0, y: 1}]); // Someone summoning Odin
    }
    activateUnit(1);
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

function executeArena(orbsUsed) {
    // setup button
    tap(800, 1900);
    sleep(1);

    // ok button
    tap(800, 1900);
    sleep(1.5);

    // select first opponent
    tap(1000, 1000);
    sleep(1);

    // confirm
    tap(1000, 1150);
    sleep(4); // TODO this should be a poll rather than a hard-coded sleep. also, could handle the "party changed"

    // start battle
    tap(800, 1800);

    let keepGoing = true;
    let firstTurn = true;
    while(keepGoing) {
        let turnReady = poll(isTurnReady, 60, 1);
        if(!turnReady) {
            // some assholes will put barrage on a dual wielding unit with a long animation
            alert("Tried to wait for turn ready but it never happened")
            at.stop();
        }

        // try to save time doing a reload but if previous MP drain disabled our attacks we need to reset the attacks
        pressReload();
        sleep(1);

        singleCastSR(orbsUsed, firstTurn);
        firstTurn = false;

        sleep(1); // give time for the reload/repeat button to go blank
        poll(function(){ return isArenaDone() || isTurnReady() }, 30, 1);
        keepGoing = isTurnReady();
    }

    // results screen
    while(!atArenaScreen()) {
        let okPressedTimes = 0;
        if(isOkButtonActive()) {
            tapMiddle(OK_BUTTON_REGION);
            okPressedTimes++;
            if(okPressedTimes == 2) {
                sleep(4); // give time to get back to the arena screen
            } else {
                sleep(1);
            }
        } else if(isRewardOkButtonActive()) {
            tapMiddle(REWARD_OK_BUTTON_REGION);
            sleep(2.5);
        } else {
            tapMiddle(OK_BUTTON_REGION);
            sleep(0.5);
        }
    }
}

function executeArenaLoop() {
    var orbsUsed = 0;
    while(arenaOrbsLeft()) {
        executeArena(orbsUsed);
        orbsUsed++;
    }
    return orbsUsed;
}

if(module === undefined) { var module = {}; executeArenaLoop(); }
module.exports = {
    executeArenaLoop
}