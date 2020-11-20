const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast } = at

const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText, isImagePresentInRegion,
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
    swipe, sleep, tap, tapMiddle, doubleTap,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);

usleep(500000);

const EXPEDITION_NEW_BUTTON_REGION = {x: 162, y: 505, width: 250, height: 103};
const EXPEDITION_ONGOING_BUTTON_REGION = {x: 690, y: 505, width: 250, height: 103};
const EXPEDITION_SLOTS = [
    {x: 99, y: 721, width: 1349, height: 268},
    {x: 99, y: 1064, width: 1349, height: 268},
    {x: 99, y: 1408, width: 1349, height: 268},
    {x: 99, y: 1753, width: 1349, height: 216},
]
const EXPEDITION_COMPLETE_COLORS = [
    { color: 16776976, x: 0, y: 0 },
    { color: 16777135, x: -30, y: 24 },
];
const EXPEDITION_BUTTON_ENABLED_COLORS = [
    { color: 30652, x: 0, y: 0 }
];

const EXPEDITION_IN_PROGRESS_X_REGION = {x: 1333, y: 540, width: 65, height: 59};
const EXPEDITION_IN_PROGRESS_X_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 0, x: 14, y: 0 },
    { color: 0, x: 0, y: -13 }
];

const EXPEDITION_NEXT_BUTTON_REGION = {x: 622, y: 1885, width: 296, height: 122};
const EXPEDITION_NEXT_BUTTON_COLORS = [
    { color: 14869993, x: 0, y: 0 },
    { color: 16009, x: 0, y: -24 },
    { color: 15066857, x: 23, y: -1 }
];

// the "Moogle" word in the "Exploring the Moogle Cave" caption at the top
const EXPEDITION_MOOGLE_REGION = { x: 545, y: 329, width: 147, height: 65};

// depart button for moogle cave
const EXPEDITION_MOOGLE_DEPART_REGION = {x: 500, y: 1800, width: 540, height: 140};

function isInMoogleExpedition() {
    return isImagePresentInRegion(`${at.rootDir()}/banme/Images/moogle-expedition.png`, EXPEDITION_MOOGLE_REGION);
}

function isExpeditionNextButtonActive() {
    return areColorsPresentInRegion(EXPEDITION_NEXT_BUTTON_COLORS, EXPEDITION_NEXT_BUTTON_REGION);
}

function isExpeditionNewButtonSelected() {
    return areColorsPresentInRegion(EXPEDITION_BUTTON_ENABLED_COLORS, EXPEDITION_NEW_BUTTON_REGION);
}
function isExpeditionOngoingButtonSelected() {
    return areColorsPresentInRegion(EXPEDITION_BUTTON_ENABLED_COLORS, EXPEDITION_ONGOING_BUTTON_REGION);
}

const EXPEDITION_CANCEL_ONGOING_NO_BUTTON_REGION = {x: 269, y: 1064, width: 393, height: 109};

function isCancelOngoingNoButtonActive() {
    return isImagePresentInRegion('Images/no-button-expedition.png', EXPEDITION_CANCEL_ONGOING_NO_BUTTON_REGION);
}

// assumes we are at the expedition screen. leaves us in the same place
function executeExpeditionLoop() {
    tapMiddle(EXPEDITION_ONGOING_BUTTON_REGION);
    sleep(0.5);
    let rowToTap = 0;
    for(let i = 0; i < 5; i++) {
        rowToTap = i;
        if(i == 4) {
            // special case the last expedition. swipe up and put expedition #4 where #3 usually is
            swipe(EXPEDITION_SLOTS[1].x, EXPEDITION_SLOTS[1].y, EXPEDITION_SLOTS[0].x, EXPEDITION_SLOTS[0].y);
            rowToTap = 3
        }
        tapMiddle(EXPEDITION_SLOTS[rowToTap]);
        sleep(0.3); // wait for the expedition dialog to open
        if(areColorsPresentInRegion(EXPEDITION_IN_PROGRESS_X_COLORS, EXPEDITION_IN_PROGRESS_X_REGION)) {
            // expedition isn't done yet
            tapMiddle(EXPEDITION_IN_PROGRESS_X_REGION);
        } else if (!isMainMenuTopBarVisible()) {
            // expedition is done
            // Moogle Cave is a special case, it skips the next button, so check for Main Menu AND next button
            while(!isMainMenuTopBarVisible() && !isExpeditionNextButtonActive()) {
                tap(1000, 1000);
                sleep(1);
            }
            // now that we've taken care of the moogle cave, check for the next button
            while(!isMainMenuTopBarVisible()) {
                tapMiddle(EXPEDITION_NEXT_BUTTON_REGION);
                sleep(1);
            }
            // the game "helpfully" takes us to the New expedition if all completed expeditions have been claimed
            // but I'm too lazy to handle this (vs there are more to be claimed), so just restart the loop
            i = -1;
            tapMiddle(EXPEDITION_ONGOING_BUTTON_REGION);
            if(!isExpeditionNewButtonSelected()) {
                // new button selected means we tried to go to ongoing but were kept on New because there are no ongoing
                // therefore we're done with processing ongoing expeditions
                break;
            }
        } else {
            // there was no expedition in that slot
        }
        sleep(0.2);
    }
    
    sleep(0.3);
    tapMiddle(EXPEDITION_NEW_BUTTON_REGION);
    sleep(0.3);
    
    // tap the topmost New expedition, regardless if we actually have a slot
    tapMiddle(EXPEDITION_SLOTS[0]);
    sleep(1); // wait for new expedition screen to fade in    
    // if there are no more expeditions to fill then we'll get the "Cancel ongoing" dialog. 
    while(!isCancelOngoingNoButtonActive()) {
        //   check for active depart button, if so it's Moogle Cave, so send it along
        //   else press the empty unit slot and select the first 5 (handle party dialog)
        if(isInMoogleExpedition()) {
            tapMiddle(EXPEDITION_MOOGLE_DEPART_REGION);
        } else {
            // tap the middle empty unit slot
            tap(750, 1360);
            sleep(2);
            // now at the Select party screen, so tap the top 5 units. may not use them all
            tap(150, 868);
            sleep(0.2);
            tap(450, 868);
            sleep(0.2);
            tap(750, 868);
            sleep(0.2);
            tap(1050, 868);
            sleep(0.2);
            tap(1350, 868);
            sleep(0.2);
            // click OK
            tap(1243, 1919);
            sleep(1.2);
            // tap Depart
            tap(1063, 1929);
            sleep(0.6);
            // tap the check mark for consumables
            tap(1260, 995);
            sleep(0.6);
            // tap Depart
            doubleTap(740, 1540);
        }
        // the back button flashes briefly after hitting depart, so wait for it to go away, then start polling
        sleep(1); 
        poll(isBackButtonActive, 10, 0.5);
        // sometimes the new button takes some time to pop in
        sleep(1);
        tapMiddle(EXPEDITION_NEW_BUTTON_REGION);
        sleep(0.3);
        // now tap the first available expedition and set up the loop
        tapMiddle(EXPEDITION_SLOTS[0]);
        sleep(1); // wait for dialog to pop in
    }
    tapMiddle(EXPEDITION_CANCEL_ONGOING_NO_BUTTON_REGION);
    sleep(0.5); // wait for dialog to fade out
}

if(module === undefined) { var module = {}; executeExpeditionLoop(); }
module.exports = {
    executeExpeditionLoop
}