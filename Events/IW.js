const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, findImage } = at

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

usleep(500000);

const IW_TOP_ABILITY_CAPTION_REGION = {x: 636, y: 907, width: 460, height: 40};
const IW_LEFT_ABILITY_CAPTION_REGION = {x: 259, y: 1612, width: 460, height: 40};
const IW_RIGHT_ABILITY_CAPTION_REGION = {x: 1022, y: 1612, width: 460, height: 40};

const IW_ABILITIES_OBTAINED_REGION = {x: 22, y: 348, width: 536, height: 57};

// slots for abilities that have already been obtained in one of the previous stages of this run
const IW_OBTAINED_SLOT_1 = {x: 344, y: 458, width: 914, height: 33};
const IW_OBTAINED_SLOT_2 = {x: 344, y: 559, width: 914, height: 33};
const IW_OBTAINED_SLOT_3 = {x: 344, y: 662, width: 914, height: 33};

function atIWAbilitiesObtainedScreen() {
    return readText(IW_ABILITIES_OBTAINED_REGION, 0.6, 1) == "Abilities Obtained";
}

// drew a bounding box surrounding the "Challenge" button
const IW_CHALLENGE_BUTTON_REGION = { x: 912, y: 1852, width: 250, height: 58 };

// bounding box surrounding the "Steel Castle Melfikya" caption to start the first battle
const IW_FIRST_CHALLENGE_BUTTON_REGION = {x: 194, y: 1238, width: 548, height: 71};

// the leftmost orb in the first round
const IW_FIRST_ORB_FIRST_REGION = {x: 528, y: 1005, width: 36, height: 34};
// the leftmost orb in the subsequent rounds
const IW_FIRST_ORB_LATER_REGION = {x: 799, y: 1943, width: 36, height: 35};
// bright red color that is repeated a bunch of times. empty orb doesn't have it.
const IW_FIRST_ORB_FULL_COLORS = [{ color: 15277843, x: 0, y: 0 }]

function iwOrbLeftLater() {
    return areColorsPresentInRegion(IW_FIRST_ORB_FULL_COLORS, IW_FIRST_ORB_LATER_REGION);
}

function iwOrbLeftFirst() {
    return areColorsPresentInRegion(IW_FIRST_ORB_FULL_COLORS, IW_FIRST_ORB_FIRST_REGION);
}

const SCROLL_BUTTON_INITIAL_LOCATION = {x: 1515, y: 775};
const SCROLL_BUTTON_END_LOCATION = {x: 1515, y: 2023};

// alert/toast/console.log does some kind of printf so we have to escape some stuff
function escapeForAlert(str) {
    return str.replace(/%/g, '%%%');
}

// normalizes text into an object with "type": 
//   HP, MP, ATK, DEF, MAG, SPR, Regen, Refresh, DEF Auto-Boost, SPR Auto-Boost, Rare
// and an optional integer "amount"
// if the rare is a ATK/MP/HP type ability then return Rare
// if it "No abilities obtained" return None
function correctAbilityText(text) {
    if(text.includes("No additional")) {
        return {type: "None"};
    } else if(text.includes("High") || text.includes("Seal")) {
        return {type: "Rare"};
    } else if(text.includes("Regen")) {
        return {type: "Regen"};
    } else if(text.includes("Refresh")) {
        return {type: "Refresh"};
    } else if(text.includes("DEF Auto")) {
        return {type: "DEF Auto-Boost"};
    } else if(text.includes("SPR Auto")) {
        return {type: "SPR Auto-Boost"};
    } else if(text.includes("ATK")) {
        var amount = extractNumber(text);
        if(amount == 40) {
            return {type: "Rare"};
        } else {
            return {type: "ATK", amount: amount};
        }
    } else if(text.includes("MAG")) {
        return {type: "MAG", amount: extractNumber(text)};
    } else if(text.includes("DEF")) {
        return {type: "DEF", amount: extractNumber(text)};
    } else if(text.includes("SPR")) {
        return {type: "SPR", amount: extractNumber(text)};
    } else if(text.includes("HP")) {
        var amount = extractNumber(text);
        if(amount == 40) {
            return {type: "Rare"};
        } else {
            return {type: "HP", amount: amount};
        }
    } else if(text.includes("MP")) {
        var amount = extractNumber(text);
        if(amount == 40) {
            return {type: "Rare"};
        } else {
            return {type: "MP", amount: amount};
        }
    } else {
        alert(`Unable to parse ability text ${text}`);
        at.stop();
    }
}

function extractNumber(text) {
    if(text.includes("40")) {
        return 40;
    } else if(text.includes("15")) {
        return 15;
    } else if(text.includes("12")) {
        return 12;
    } else if(text.includes("10")) {
        return 10;
    } else if(text.includes("7")) {
        return 7;
    } else if(text.includes("5")) {
        return 5;
    } else if(text.includes("3")) {
        return 3;
    } else if(text.includes("1")) {
        return 1;
    } else {
        alert(`Unable to determine bonus number in ${text}`);
        at.stop();
    }
}

// returns object with two optional fields: discard and take
// discard and take can be numbers 1, 2, 3
function determineSelection(options, priorityList) {
    // assumption: we'll never get an ability choice that we already have obtained
    // "None" is worse than everything else
    // sort the incoming choices, sort the obtained abilities.
    // is the top incoming choice better than the bottom obtained?
    //   if so, is bottom obtained = "None"? then return {take: 0/1/2}.
    //      otherwise return {discard: 0/1/2, take: 0/1/2}
    //   return null (do nothing)

    var lowestOld = 0;
    for(let i = 1; i <= 2; i++) {
        if(getAbilityScore(options.old[i], priorityList) < getAbilityScore(options.old[lowestOld], priorityList)) {
            lowestOld = i;
        }
    }
    var highestNew = 0;
    for(let i = 1; i <= 2; i++) {
        if(getAbilityScore(options.new[i], priorityList) > getAbilityScore(options.new[highestNew], priorityList)) {
            highestNew = i;
        }
    }

    if(getAbilityScore(options.new[highestNew], priorityList) > getAbilityScore(options.old[lowestOld], priorityList)) {
        if(options.old[lowestOld].type == "None") {
            return {take: highestNew};
        } else {
            return {discard: lowestOld, take: highestNew};
        }
    } else {
        return null;
    }
}

function getAbilityScore(ability, priorityList) {
    if(ability.type == "None") return -1;
    let currentScore = priorityList.length;
    for(let i = 0; i < priorityList.length; i++) {
        if(Array.isArray(priorityList[i])) {
            if(priorityList[i].includes(ability.type))
                break;
        } else {
            if(ability.type == priorityList[i]) {
                break;
            }
        }
        currentScore--;
    }
    if(typeof ability.amount === 'undefined') {
        return currentScore;
    } else {
        return currentScore + (ability.amount / 100);
    }
}

const MAG_PRIORITY_LIST = ["Rare", ["MAG", "HP"], ["DEF", "SPR"], "MP"];
const PRIORITY_LIST = MAG_PRIORITY_LIST;

// need to handle first IW round and later rounds
var canContinue = true;
if(iwOrbLeftFirst()) {
    tapMiddle(IW_FIRST_CHALLENGE_BUTTON_REGION);
} else if(iwOrbLeftLater()) {
    tapMiddle(IW_CHALLENGE_BUTTON_REGION);
} else {
    // no orbs
    canContinue = false;
}

if(canContinue) {
    sleep(0.5);
    poll(isBackButtonActive, 5, 1, "Wait for active back button");

    // scroll all the way to the bottom, then select no companion
    swipe(SCROLL_BUTTON_INITIAL_LOCATION.x, SCROLL_BUTTON_INITIAL_LOCATION.y, 
        SCROLL_BUTTON_END_LOCATION.x, SCROLL_BUTTON_END_LOCATION.y);
    sleep(0.5);
    tap(800, 1920);
    sleep(1);

    // hit depart
    tap(800, 1920);

    poll(isTurnReady, 30, 1, "Wait for turn ready");

    // unit 1 (vaan) LB
    selectAbilities(1, [{x: 0, y: 0}]);
    activateUnit(1);
    activateUnit(5);
    activateUnit(3);
    activateUnit(4);
    activateUnit(2);
    activateUnit(6);
    sleep(1);

    while(true) {
        poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
        if(isTurnReady()) {
            pressReload();
            activateUnit(1);
            activateUnit(5);
            activateUnit(3);
            activateUnit(4);
            activateUnit(2);
            activateUnit(6);
            sleep(1);
        } else {
            break;
        }
    }

    dismissVictoryScreenDialogs(atIWAbilitiesObtainedScreen);
    // at the selection screen now

    var obtainedAbility1 = correctAbilityText(readText(IW_OBTAINED_SLOT_1, 0.5, 0));
    var obtainedAbility2 = correctAbilityText(readText(IW_OBTAINED_SLOT_2, 0.5, 0));
    var obtainedAbility3 = correctAbilityText(readText(IW_OBTAINED_SLOT_3, 0.5, 0));

    var topChoice = correctAbilityText(readText(IW_TOP_ABILITY_CAPTION_REGION, 0.5, 0));
    var leftChoice = correctAbilityText(readText(IW_LEFT_ABILITY_CAPTION_REGION, 0.5, 0));
    var rightChoice = correctAbilityText(readText(IW_RIGHT_ABILITY_CAPTION_REGION, 0.5, 0));

    var options = {
        old: [obtainedAbility1, obtainedAbility2, obtainedAbility3],
        new: [topChoice, leftChoice, rightChoice]
    };

    alert(JSON.stringify(determineSelection(options, PRIORITY_LIST)));
}

