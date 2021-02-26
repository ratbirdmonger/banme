const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp, getColor, getColors, stop } = at
const { intToRgb } = utils
const {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText, tapBottomLeftHomeButton,
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
    swipe, sleep, tap, tapMiddle, doubleTap, doubleTapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);
const {
    getBaseMapForRegion, findXButton
} = require(`${at.rootDir()}/bot-common/x-detector`);

// prize wheel
const prize_wheel = [
    { color: 4866072, x: 0, y: 0 },
    { color: 16447725, x: -11, y: -37 },
    { color: 131076, x: -51, y: -68 }
];

// upper right region where the close ad button could be
const ad_upper_right_region = { x: 1374, y: 1, width: 160, height: 160 };

// upper left region where the close ad button could be
const ad_upper_left_region = { x: 1, y: 1, width: 160, height: 160 };

const AD_PRIZE_REGION = {x: 1287, y: 1439, width: 235, height: 262};

function isPrizeWheelShowing() {
    var options = { colors: prize_wheel }
    var [result, error] = at.findColors(options); 
    if(result.length > 0) {
        return true;
    }
    return false;
}

const AD_SPIN_BUTTON_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 8603392, x: 0, y: -49 },
    { color: 1902592, x: 16, y: -7 }
];

const AD_SPIN_BUTTON_REGION = { x:537, y: 1307, width: 463, height: 141 };

function isSpinButtonActive() {
    return areColorsPresentInRegion(AD_SPIN_BUTTON_COLORS, AD_SPIN_BUTTON_REGION);
}

function findAndClickXButton(message) {
    var regions = [ad_upper_left_region, ad_upper_right_region];
    var regionBaseMaps = [getBaseMapForRegion(regions[0]), getBaseMapForRegion(regions[1])];
    var result = findXButton(regionBaseMaps);
    if(result.score <= 0) {
        alert(`Unable to find ${message}, stopping script`);
        at.stop();
    }
    tap(regions[result.n].x + result.x, regions[result.n].y + result.y);
}

const REWARD_NEXT_COUNTER_REGION = {x: 1006, y: 1691, width: 206, height: 50};
const REWARD_NEXT_COUNTER_0_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 16777215, x: -21, y: 1 },
    { color: 198677, x: -37, y: 3 },
    { color: 198676, x: -47, y: 3 },
    { color: 198676, x: -59, y: 3 },
    { color: 67086, x: -70, y: 3 }
];

function isRewardCounterZero() {
    return areColorsPresentInRegion(REWARD_NEXT_COUNTER_0_COLORS, REWARD_NEXT_COUNTER_REGION);
}

function executeAd() {
    sleep(0.5);

    // spin 1
    doubleTapMiddle(AD_SPIN_BUTTON_REGION);
    sleep(1);
    
    // spin 2 & wait
    doubleTap(890, 1240);
    sleep(46); // stupid X-Hero ads
    
    findAndClickXButton("1st ad");
    
    // sometimes we have to click through two screens with X's
    // sometimes we click the X and we don't get a reward wheel

    var done = poll(function() { return isPrizeWheelShowing() || isBackButtonActive(); }, 5, 0.5);
    sleep(0.5); // throw in some extra time to make sure the wheel is responding
    if(isBackButtonActive()) {
        // well, looks like we got screwed and they didn't give us a spin
        return;
    }
    if(!isPrizeWheelShowing()) {
        findAndClickXButton("2nd ad");
    
        poll(isPrizeWheelShowing, 5, 0.5, "Wait for prize wheel after 2nd X");
    }

    // tap on the screen where the next button is until we're back to the UI
    poll(function() {
        if(isBackButtonActive()) {
            return true;
        } else {
            tap(740, 1880);
            return false; // keep polling
        }
    }, 5, 0.75, "back button after prize wheel");
    
    sleep(2);
}

// precondition: at home screen
// postcondition: at home screen, all available ads have been watched
function executeAdLoop() {
    let triesLeft = 2;
    while(triesLeft > 0) {
        tapMainMenuAdButton();
        poll(isBackButtonActive, 10, 0.5, "Back button available");

        while(isSpinButtonActive()) {
            if(triesLeft == 1) {
                // there's an ad available, so reset the counter
                triesLeft = 2;
            }
            // claim the reward if it's claimable
            if(isRewardCounterZero()) {
                sleep(3); // give time for the stupid moogle to make its way
                tapMiddle(AD_PRIZE_REGION);
                sleep(3); // takes a long time for the window to come up
                tap(774, 1234, 150000); // claim button
                sleep(0.5);
            }

            executeAd();
        }
        // ran out of ads but maybe we just need to reset. if this happens twice then there really aren't any ads
        triesLeft--;
        tapBottomLeftHomeButton();
    }
}

if(module === undefined) { var module = {}; executeAdLoop(); }
module.exports = {
    executeAdLoop, findAndClickXButton
}