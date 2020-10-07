const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, stop } = at
const { pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, selectAbilities, 
    isEsperGaugeFull, isTurnReady, poll, sleep, tap, areColorsPresentInRegion, tapMiddle, isAutoAttackSelected } 
    = require(`${at.rootDir()}/ffbe/ffbe`);

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
const REWARD_OK_BUTTON_COLORS =  [
    { color: 2350, x: 0, y: 0 },
    { color: 16777215, x: 15, y: -1 },
    { color: 16777215, x: 42, y: -1 },
    { color: 2623, x: 72, y: -1 }
];

function isOkButtonActive() {
    return areColorsPresentInRegion(OK_BUTTON_COLORS, OK_BUTTON_REGION) || areColorsPresentInRegion(OK_BUTTON_2_COLORS, OK_BUTTON_REGION);
}

function isRewardOkButtonActive() {
    return areColorsPresentInRegion(REWARD_OK_BUTTON_COLORS, REWARD_OK_BUTTON_REGION);
}

function executeArena() {
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
    let fullEsperStartOfTurn = false;
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
        if(isAutoAttackSelected(4)) {
            selectAbilities(4, [{x: 5, y: 1}]); // SElena using frozen hurricane
        }
        if(isAutoAttackSelected(2)) {
            selectAbilities(2, [{x:9, y:0}, {x:13, y:0}, {x:13, y:0}, {x:13, y:0}]) // Rem CWA daggersx3
        }
        if(isAutoAttackSelected(5)) {
            selectAbilities(5, [{x: 2, y:1}, {x: 6, y: 0}, {x: 6, y: 0}, {x: 6, y: 0}]) // Kuja CWA firex3
        }
        if(isAutoAttackSelected(3)) {
            selectAbilities(3, [{x: 1, y:1}, {x:2, y: 1}, {x:3, y: 0}, {x:3, y:1}]); // Hein CWA fire/ice/lightning
        }
        if(!isAutoAttackSelected(1)) {
            // if we got here then that means we already had the esper gauge full, so let's remember this and
            // not redo the esper command. because it won't work - can't reselect esper if you already have it selected.
            // warning: if you manually take over and change the action, it will keep executing that action instead
            fullEsperStartOfTurn = true;
        }

        activateUnit(4);
        sleep(1);
        activateUnit(2);
        activateUnit(3);
        activateUnit(5);
        poll(isEsperGaugeFull, 10, 0.2);
        if(!fullEsperStartOfTurn) {
            selectAbilities(1, [{x: 0, y: 1}]); // Someone summoning Odin
        }
        activateUnit(1);
        fullEsperStartOfTurn = false;
        
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
    while(arenaOrbsLeft()) {
        executeArena();
    }
}

module.exports = {
    executeArenaLoop
}