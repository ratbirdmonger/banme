// burn all orbs in IW. if we reach the end, stop and let the user decide what to do
// assumes unit in position 1 can LB every turn
// user needs to set PRIORITY_LIST

const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, findImage } = at
const {
    safeRequire,
    // basic gestures
    swipe, sleep, tap, tapMiddle, doubleTap, doubleTapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll, findColorsInRegion,
    // debug
    debug
} = require(`${at.rootDir()}/bot-common/bot-common`);
const { 
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
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs    
} = safeRequire(`${at.rootDir()}/banme/banme-common`);

global.debugEnabled = true;

const IW_TOP_ABILITY_CAPTION_REGION = {x: 636, y: 907, width: 460, height: 40};
const IW_LEFT_ABILITY_CAPTION_REGION = {x: 259, y: 1612, width: 460, height: 40};
const IW_RIGHT_ABILITY_CAPTION_REGION = {x: 1022, y: 1612, width: 460, height: 40};

// go from caption region to the Unique/Rare text
const IW_SPECIAL_OFFSET_REGION = {x:-254, y: -35, width: 247, height: 69};

// Top part of the 'U' in Unique
const IW_UNIQUE_IMAGE_PATH = `${at.rootDir()}/banme/Images/iw-unique.png`;

const IW_ABILITY_CHOICE_REGIONS = [
    IW_TOP_ABILITY_CAPTION_REGION, IW_LEFT_ABILITY_CAPTION_REGION, IW_RIGHT_ABILITY_CAPTION_REGION
];
const IW_OBTAIN_ABILITY_CONFIRM_REGION = {x: 874, y: 1238, width: 386, height: 113};
const IW_ABILITIES_OBTAINED_REGION = {x: 22, y: 348, width: 536, height: 57};

// slots for abilities that have already been obtained in one of the previous stages of this run
const IW_OBTAINED_SLOT_1 = {x: 344, y: 458, width: 914, height: 33};
const IW_OBTAINED_SLOT_2 = {x: 344, y: 559, width: 914, height: 33};
const IW_OBTAINED_SLOT_3 = {x: 344, y: 662, width: 914, height: 33};
const IW_OBTAINED_SLOTS = [
    IW_OBTAINED_SLOT_1, IW_OBTAINED_SLOT_2, IW_OBTAINED_SLOT_3
];

function atIWAbilitiesObtainedScreen() {
    return readText(IW_ABILITIES_OBTAINED_REGION, 0.6, 1) == "Abilities Obtained";
}

// drew a bounding box surrounding the "Challenge" button
const IW_CHALLENGE_BUTTON_REGION = { x: 912, y: 1852, width: 250, height: 58 };

// bounding box surrounding the "Steel Castle Melfikya" caption to start the first battle
const IW_FIRST_CHALLENGE_BUTTON_REGION = {x: 194, y: 1238, width: 548, height: 71};

// the leftmost orb in the first round
const IW_FIRST_ORB_FIRST_REGION = {x: 528, y: 1005, width: 36, height: 34};
// the leftmost orb in the subsequent rounds - not the Battle screen but the next one
const IW_FIRST_ORB_LATER_REGION = {x: 799, y: 1943, width: 36, height: 35};
// bright red color that is repeated a bunch of times. empty orb doesn't have it.
const IW_FIRST_ORB_FULL_COLORS = [{ color: 15277843, x: 0, y: 0 }]

function iwOrbLeftLater() {
    return areColorsPresentInRegion(IW_FIRST_ORB_FULL_COLORS, IW_FIRST_ORB_LATER_REGION);
}

function iwOrbLeftFirst() {
    return areColorsPresentInRegion(IW_FIRST_ORB_FULL_COLORS, IW_FIRST_ORB_FIRST_REGION);
}

// alert/toast/console.log does some kind of printf so we have to escape some stuff
function escapeForAlert(str) {
    return str.replace(/%/g, '%%%');
}

function extractAbility(abilityTextRegion) {
    let specialRegion = {
        x: abilityTextRegion.x + IW_SPECIAL_OFFSET_REGION.x,
        y: abilityTextRegion.y + IW_SPECIAL_OFFSET_REGION.y,
        width: IW_SPECIAL_OFFSET_REGION.width, height: IW_SPECIAL_OFFSET_REGION.height
    };

    if(isImagePresentInRegion(IW_UNIQUE_IMAGE_PATH, specialRegion)) {
        return {type: "Unique"};
    } 
    // TODO handle the rare here as well

    var rawText = readText(abilityTextRegion, 0.5, 0);
    return parseAbilityText(rawText);
}

// normalizes text into an object with "type": 
//   HP, MP, ATK, DEF, MAG, SPR, Regen, Refresh, DEF Auto-Boost, SPR Auto-Boost, Rare, Unique
// and an optional integer "amount"
// if the rare is a ATK/MP/HP type ability then return Rare
// if it "No abilities obtained" return None
function parseAbilityText(text) {
    var returnValue = null;

    if(text.includes("No additional")) {
        returnValue = {type: "None"};
    } else if(text.includes("High") || text.includes("Seal")) {
        returnValue = {type: "Rare"};
    } else if(text.includes("Regen")) {
        returnValue = {type: "Regen"};
    } else if(text.includes("Refresh")) {
        returnValue = {type: "Refresh"};
    } else if(text.includes("DEF Auto")) {
        returnValue = {type: "DEF Auto-Boost"};
    } else if(text.includes("SPR Auto")) {
        returnValue = {type: "SPR Auto-Boost"};
    } else if(text.includes("ATK")) {
        var amount = extractNumber(text);
        if(amount == 40) {
            returnValue = {type: "Rare"};
        } else {
            returnValue = {type: "ATK", amount: amount};
        }
    } else if(text.includes("MAG")) {
        returnValue = {type: "MAG", amount: extractNumber(text)};
    } else if(text.includes("DEF")) {
        returnValue = {type: "DEF", amount: extractNumber(text)};
    } else if(text.includes("SPR")) {
        returnValue = {type: "SPR", amount: extractNumber(text)};
    } else if(text.includes("HP")) {
        var amount = extractNumber(text);
        if(amount == 40) {
            returnValue = {type: "Rare"};
        } else {
            returnValue = {type: "HP", amount: amount};
        }
    } else if(text.includes("MP")) {
        var amount = extractNumber(text);
        if(amount == 40) {
            returnValue = {type: "Rare"};
        } else {
            returnValue = {type: "MP", amount: amount};
        }
    } else {
        // assume it's the Unique
        returnValue = {type: "Unique"};
    }

    debug(`raw text = ${text}, return = ${JSON.stringify(returnValue)}`);
    return returnValue;
}

function extractNumber(text) {
    // hard-coding it to try to catch OCR errors
    if(text.includes("80")) {
        return 80;
    } else if(text.includes("60")) {
        return 60;
    } else if(text.includes("40")) {
        return 40;
    } else if(text.includes("20")) {
        return 20;
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

const MAG_PRIORITY_LIST = ["Unique", "Rare", ["MAG", "HP"], ["DEF", "SPR"], "MP"];
const MAG_NO_RARE_PRIORITY_LIST = [["MAG", "HP"], ["DEF", "SPR"], "MP"];
const HYBRID_PRIORITY_LIST = ["Rare", ["ATK", "MAG", "HP"], ["DEF", "SPR"], "MP"];
const ATK_PRIORITY_LIST = ["Unique", "Rare", ["ATK", "HP"], ["DEF", "SPR"], "MP"];
const HP_PRIORITY_LIST = ["Unique", "Rare", "HP", ["DEF", "SPR"], "MP"];
const HP_SPR_PRIORITY_LIST = ["Unique", "Rare", ["HP", "SPR"], "DEF", "MP"];
const HP_MAG_SPR_PRIORITY_LIST = ["Unique", "Rare", ["HP", "MAG", "SPR"], "DEF", "MP"];
// TODO: DEF, SPR, HP priorities

// set this depending on what weapon is being run
const PRIORITY_LIST = HP_PRIORITY_LIST;

const DISMISS_ABILITIES_BUTTON_REGION = {x: 45, y: 1393, width: 674, height: 73};
const SWITCH_ABILITY_OBTAINED = {x: 816, y: 1393, width: 674, height: 73};
// dismiss all
const CONFIRM_DISMISS_ALL_BUTTON_REGION = {x: 874, y: 1378, width: 520, height: 88}
// dismiss one
const CONFIRM_DISMISS_OBTAINED_BUTTON_REGION = {x: 870, y: 1244, width: 398, height: 107};

function doOneIWBattle() {
    sleep(0.5);
    poll(isBackButtonActive, 5, 1, "Wait for active back button");

    selectNoCompanion();
    sleep(0.5);

    // hit depart
    doubleTap(800, 1920);

    poll(isTurnReady, 30, 1, "Wait for turn ready");

    // unit 1 vaan, or someone with a damaging LB
    selectAbilities(1, [{x: 0, y: 0}]);
    // unit 2 always summons esper
    selectAbilities(2, [{x: 0, y: 1}]);
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

    var obtainedAbility1 = parseAbilityText(readText(IW_OBTAINED_SLOT_1, 0.5, 0));
    var obtainedAbility2 = parseAbilityText(readText(IW_OBTAINED_SLOT_2, 0.5, 0));
    var obtainedAbility3 = parseAbilityText(readText(IW_OBTAINED_SLOT_3, 0.5, 0));

    var topChoice = extractAbility(IW_TOP_ABILITY_CAPTION_REGION);
    var leftChoice = extractAbility(IW_LEFT_ABILITY_CAPTION_REGION);
    var rightChoice = extractAbility(IW_RIGHT_ABILITY_CAPTION_REGION);

    var options = {
        old: [obtainedAbility1, obtainedAbility2, obtainedAbility3],
        new: [topChoice, leftChoice, rightChoice]
    };

    var selection = determineSelection(options, PRIORITY_LIST);

    console.log(JSON.stringify(options));
    console.log(JSON.stringify(selection));

    if(selection == null) {
        // dismiss new abilities
        tapMiddle(DISMISS_ABILITIES_BUTTON_REGION);
        sleep(0.5);
        tapMiddle(CONFIRM_DISMISS_ALL_BUTTON_REGION);
        sleep(2);
    } else {
        if(selection.discard !== undefined) {
            tapMiddle(SWITCH_ABILITY_OBTAINED);
            sleep(0.5);
            var abilityToDismissRegion = IW_OBTAINED_SLOTS[selection.discard];
            tapMiddle(abilityToDismissRegion);
            sleep(0.5);        
            tapMiddle(CONFIRM_DISMISS_OBTAINED_BUTTON_REGION);
            sleep(0.5);
        }
        var regionToTap = IW_ABILITY_CHOICE_REGIONS[selection.take];
        tapMiddle(regionToTap);
        sleep(0.5);
        doubleTap(IW_OBTAIN_ABILITY_CONFIRM_REGION.x, IW_OBTAIN_ABILITY_CONFIRM_REGION.y);
        sleep(4);
        // tap somewhere to force the screen to move along
        doubleTap(IW_OBTAIN_ABILITY_CONFIRM_REGION.x, IW_OBTAIN_ABILITY_CONFIRM_REGION.y);
        sleep(2);
    }
}

sleep(0.5);

function executeLoop() {
    var canContinue = true;
    while(canContinue) {
        if(iwOrbLeftFirst()) {
            // battle 1 of IW
            tapMiddle(IW_FIRST_CHALLENGE_BUTTON_REGION);
        } else if(iwOrbLeftLater()) {
            // battle 2-10 of IW
            tapMiddle(IW_CHALLENGE_BUTTON_REGION);
        } else {
            // no orbs
            canContinue = false;
        }
        
        if(canContinue) {
            doOneIWBattle();
        }
    }
}

function test() {
    var obtainedAbility1 = parseAbilityText(readText(IW_OBTAINED_SLOT_1, 0.5, 0));
    var obtainedAbility2 = parseAbilityText(readText(IW_OBTAINED_SLOT_2, 0.5, 0));
    var obtainedAbility3 = parseAbilityText(readText(IW_OBTAINED_SLOT_3, 0.5, 0));

    var topChoice = extractAbility(IW_TOP_ABILITY_CAPTION_REGION);
    var leftChoice = extractAbility(IW_LEFT_ABILITY_CAPTION_REGION);
    var rightChoice = extractAbility(IW_RIGHT_ABILITY_CAPTION_REGION);

    var options = {
        old: [obtainedAbility1, obtainedAbility2, obtainedAbility3],
        new: [topChoice, leftChoice, rightChoice]
    };

    var selection = determineSelection(options, PRIORITY_LIST);

    debug(JSON.stringify(leftChoice));

    alert(JSON.stringify(selection));
}

executeLoop();