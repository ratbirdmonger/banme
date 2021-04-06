const _ = require('lodash');
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

const { executeAdLoop } = require(`${at.rootDir()}/banme/Ad`);

function sendGiftsAndPressShare() {
    // friends
    tap (1400, 1920);
    sleep(2);

    // gifts
    tap(1130, 920);
    sleep(1.5);

    // receive all
    tap(860, 390);
    sleep(0.5);

    // send
    tap(1270, 400);
    sleep(3); // TODO: network access, should poll

    // send all
    tap(880, 400);
    sleep(0.5);

    // back
    doubleTap(180, 320);
    sleep(2.5);

    if(isDailyQuestCloseButtonActive()) {
        tapDailyQuestCloseButton();
        sleep(1);
    }

    // back
    tap(180, 320);
    sleep(2.5);

    // share
    tap(1250, 1200);
    sleep(1.5);

    // close the share screen
    doubleTap(1220, 350);
    sleep(2);

    // back to home (double tap again)
    tap(150, 1900);
    sleep(0.1);
    doubleTap(180, 320);    
    sleep(2);

    if(isDailyQuestCloseButtonActive()) {
        tapDailyQuestCloseButton();
        sleep(1);
    }
    sleep(1);
}

const BUNDLE_SLOT_REGIONS = [
    {x: 97, y: 546, width: 402, height: 533},
    {x: 567, y: 546, width: 402, height: 533},
    {x: 1038, y: 546, width: 402, height: 533},
    {x: 97, y: 1145, width: 402, height: 533},
    {x: 567, y: 1145, width: 402, height: 533},
    {x: 1038, y: 1145, width: 402, height: 533},
]

const GOLD_BUNDLE_COLORS = [
    { color: 10578445, x: 0, y: 0 },
    { color: 10578445, x: 10, y: 0 }
];

const MAIN_MENU_BUNDLE_BUTTON_LOCATION = {x: 800, y: 310};

function isBundleGold(region) {
    return areColorsPresentInRegion(GOLD_BUNDLE_COLORS, region);
}

function findAndTapGoldBundle() {
    let found = false;
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 6 && !found; j++) {
            if(isBundleGold(BUNDLE_SLOT_REGIONS[j])) {
                tapMiddle(BUNDLE_SLOT_REGIONS[j])
                sleep(0.5);
                found = true;
            }
            if(i > 0 && j < 3) {
                // after the first swipe, we've already checked the first row so skip it
                continue;
            }
        }
        if(!found) {
            swipe(BUNDLE_SLOT_REGIONS[3].x, BUNDLE_SLOT_REGIONS[3].y, BUNDLE_SLOT_REGIONS[0].x, BUNDLE_SLOT_REGIONS[0].y)
            sleep(0.2);
        }
    }
    if(!found) {
        alert("Couldn't find gold bundle!");
        at.stop();
    }
}

const BUNDLE_BUY_BUTTON_REGION = {x: 548, y: 1553, width: 429, height: 138};
const BUNDLE_BUY_BUTTON_GOLD_COLORS = [
    { color: 15261005, x: 0, y: 0 },
    { color: 11166215, x: 0, y: -8 },
    { color: 16710292, x: 23, y: -6 }
];

// from the main menu, enter the bundle purchase screen and buy a gold bundle
// end back at the main menu
function buyGoldBundle() {
    tap(MAIN_MENU_BUNDLE_BUTTON_LOCATION.x, MAIN_MENU_BUNDLE_BUTTON_LOCATION.y);
    poll(isBackButtonActive, 5, 0.2, true);
    findAndTapGoldBundle();
    if(!areColorsPresentInRegion(BUNDLE_BUY_BUTTON_GOLD_COLORS, BUNDLE_BUY_BUTTON_REGION)) {
        alert("Something went wrong, the bundle doesn't match gold colors.");
        at.stop();
    }
    tapMiddle(BUNDLE_BUY_BUTTON_REGION);
    sleep(0.5);
    tap(1060, 1100); // Yes
    sleep(2); // TODO poll for the purchase to complete
    tap(750, 1100); // OK
    sleep(0.5);
    tapBackButton();
    if(isDailyQuestCloseButtonActive()) {
        tapDailyQuestCloseButton(); sleep(1);
    }
}

function trivialEvent(hasChallenges = true) {
    sleep(0.5);
    doubleTap(720, 670); // first slot when there's no event info banner
    sleep(1.5);
    if(hasChallenges) {
        tap(780, 1960);
        sleep(1);
    }
    selectNoCompanion();
    tap(820, 1880); // tap depart

    // This isn't a good way to do it, if there's a delay starting then we would skip straight to assuming victory
    sleep(3);
    while(true) {
        poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
        if(isTurnReady()) {
            activateUnit(1); activateUnit(2); activateUnit(3); activateUnit(4); activateUnit(5); activateUnit(6);
            sleep(1);
        } else {
            break;
        }
    }
    
    dismissVictoryScreenDialogs();
    sleep(1);
}

const DAILY_GIL_HUNT_BANNER_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 16443204, x: -3, y: 30 }
];
const BANNER_REGION = {x: 37, y: 472, width: 1461, height: 1493};
function dailyGilHunt() {
    enterVortex();
    selectVortex(1,null);
    var result = findColorsInRegion(DAILY_GIL_HUNT_BANNER_COLORS, BANNER_REGION);
    if(result != null) {
        tap(result.x, result.y);
    } else {
        alert("Couldn't find daily gil hunt");
        at.stop();
    }
    sleep(1);
    trivialEvent(false);
}

function enhancementQuest() {
    let arguments = {
        vortexX: 0, vortexY: 0,
        eventText: "Bad",
        selectLocation: "middle",
        partyName: "Wave",
        executeTurnFunction: function(turn) {
            _.forEach(_.range(1,7), function(i) {activateUnit(i)});
        }
    };

    executeEvent(arguments);
}

// function executeFF5Daily() {
//     let arguments = {
//         vortexX: 0, vortexY: 8,
//         eventText: "Elite",
//         selectLocation: "top",
//         partyName: "Five",
//         companionTabPriority: false, // friends not allowed
//         executeTurnFunction: function(turn) {
//             if(turn == 1) {
//                 // DPS
//                 selectAbilities(1, [{x: 2, y: 1}, {x: 7, y: 0}, {x: 7, y: 0}, {x: 7, y: 0}])
        
//                 _.forEach(_.range(1,7), function(i) {activateUnit(i)});
//             } else {
//                 // no cooldowns were used previously so reload & repeat
//                 pressReload();
//                 _.forEach(_.range(1,7), function(i) {activateUnit(i)});
//             }
//         }
//     };

//     executeEvent(arguments);
// }

sleep(0.5);

// executeFF5Daily();
// tapBackButton();
// exitVortex();

enhancementQuest();
tapBackButton();
exitVortex();

dailyGilHunt();
tapBackButton();
exitVortex();

sendGiftsAndPressShare();
//buyGoldBundle();

executeAdLoop();