const { touchDown, touchMove, touchUp, usleep, toast, findImage } = at
const {
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll
} = require(`${at.rootDir()}/bot-common/bot-common`);

// all coordinates gathered by hand on an iPad 6th generation
// resolution: 1536 x 2048 pixels
// it's almost certainly all wrong for any other resolution / aspect ratio
const BATTLE_UNIT_REGIONS = {
    1: {x: 6, y: 1132, width: 751, height: 237},
    2: {x: 6, y: 1377, width: 751, height: 237},
    3: {x: 6, y: 1623, width: 751, height: 237},
    4: {x: 762, y: 1132, width: 751, height: 237},
    5: {x: 762, y: 1377, width: 751, height: 237},
    6: {x: 762, y: 1623, width: 751, height: 237}   
};

// relative to top left, the unit action icon is at:
//   x + 0, y - 50, width: 108, height: 96
const UNIT_ACTION_ICON_OFFSET = {x: 0, y: -50};
const UNIT_ACTION_ICON_REGION = {width: 108, height: 96};
// sliver of the border. we will use this to determine if the unit is ready or not
const UNIT_BORDER_OFFSET = {x: 115, y: 18};
const UNIT_BORDER_REGION = {width: 184, height: 8};
const UNIT_BORDER_READY_COLORS = [{ color: 5008543, x: 0, y: 0 }];

// the tail part of the action "speech bubble". if the unit has already acted,
//  or is incapacitated, then there is no speech bubble.
const UNIT_ACTION_BOX_TAIL_OFFSET = {x: 27, y: 45};
const UNIT_ACTION_BOX_TAIL_REGION = {width: 22, height: 15};
const UNIT_ACTION_BOX_TAIL_COLORS = [{ color: 0x505050, x: 0, y: 0 }];

function isBattleUnitReady(unitPosition) {
    var region = {
        x: BATTLE_UNIT_REGIONS[unitPosition].x + UNIT_ACTION_BOX_TAIL_OFFSET.x,
        y: BATTLE_UNIT_REGIONS[unitPosition].y + UNIT_ACTION_BOX_TAIL_OFFSET.y,
        width: UNIT_ACTION_BOX_TAIL_REGION.width,
        height: UNIT_ACTION_BOX_TAIL_REGION.height
    }
    return areColorsPresentInRegion(UNIT_ACTION_BOX_TAIL_COLORS, region);
}

function isAutoAttackSelected(unitPosition) {
    let actionIconRegion = {
        x: BATTLE_UNIT_REGIONS[unitPosition].x + UNIT_ACTION_ICON_OFFSET.x,
        y: BATTLE_UNIT_REGIONS[unitPosition].y + UNIT_ACTION_ICON_OFFSET.y,
        width: UNIT_ACTION_ICON_REGION.width, height: UNIT_ACTION_ICON_REGION.height
     }

     const [result, error] = findImage({
         targetImagePath: 'Images/battle-action-sword.png',
         threshold: 0.95,
         region: actionIconRegion,
         method: 1 // 2 is more sophisticated
     })

     return result.length == 1;
}

const repeatButton = {x: 473, y: 1951};
const reloadButton = {x: 885, y: 1938};

// in the ability menu during a battle, we can see 3 rows of 2 abilities each
const battleAbilityTopLeft = [
    [/* 0,0 */ {x: 22, y: 1129}, /* 0,1 */ {x: 768, y: 1129}],
    [/* 1,0 */ {x: 22, y: 1361}, /* 1,1 */ {x: 768, y: 1361}],
    [/* 2,0 */ {x: 22, y: 1592}, /* 2,1 */ {x: 768, y: 1592}]    
];
const BATTLE_ABILITY_DIMENSIONS = {width: 700, height: 200};


// used to check if the esper gauge is full
const esperGaugeRegion = { x: 1114, y: 1070, width: 386, height: 783 };
const esperGaugeFullColors = [
    { color: 16777057, x: 0, y: 2 }
];

// used to check if the reload button is active, which means it's our turn to act
const reloadButtonCheckRegion = {x: 794, y: 1925, width: 48, height: 32};
const reloadButtonActiveColors = [
    { color: 16777215, x: 0, y: 0 },
    { color: 30889, x: 0, y: -21 }
];

// used to check if we are outside of battle
const titleBarGoldCoinCheckRegion = {x: 0, y: 0, width: 96, height: 96};
const titleBarGoldCoinColors = [
    { color: 11433246, x: 0, y: 0 },
    { color: 15523195, x: 2, y: -27 },
    { color: 16308859, x: -21, y: -1 }];

function pressRepeat() {
    tap(repeatButton.x, repeatButton.y, 1000, 7);
    sleep(0.4);
}

function pressReload() {
    tap(reloadButton.x, reloadButton.y, 1000, 7);
    sleep(0.2);
}

// opens the ability list for the unit. position between 1 and 6.
function openUnitAbility(unitPosition) {
    swipe(BATTLE_UNIT_REGIONS[unitPosition].x + 10, 
        BATTLE_UNIT_REGIONS[unitPosition].y + BATTLE_UNIT_REGIONS[unitPosition].height/2, 
        BATTLE_UNIT_REGIONS[unitPosition].x + 10 + BATTLE_UNIT_REGIONS[unitPosition].width/2, 
        BATTLE_UNIT_REGIONS[unitPosition].y + BATTLE_UNIT_REGIONS[unitPosition].height/2, 
        unitPosition);
    sleep(0.4);
}

// activate (press) the unit. position between 1 and 6.
function activateUnit(unitPosition) {
    tapMiddle(
        {x: BATTLE_UNIT_REGIONS[unitPosition].x, y: BATTLE_UNIT_REGIONS[unitPosition].y,
         width: BATTLE_UNIT_REGIONS[unitPosition].width, height: BATTLE_UNIT_REGIONS[unitPosition].height }, 0, unitPosition);
}

// unitPosition is as number from 1 to 6
// abilities is a list of x and y pairs, and optional target
function selectAbilities(unitPosition, abilities, braveShift = false) {
    openUnitAbility(unitPosition);

    if(braveShift == true) {
        tapBraveShift();
    }

    // we start at row 0. we can reach row, row+1, and row+2
    let row = 0;
    for(let i = 0; i < abilities.length; i++) {
        if(abilities[i].x < row) {
            // need to seek upwards (decreasing the row) by row - abilities.x
            let rowsToSeek = row - abilities[i].x;
            for(let j = 0; j < rowsToSeek; j++) {
                swipe(battleAbilityTopLeft[0][0].x + BATTLE_ABILITY_DIMENSIONS.width/2, 
                    battleAbilityTopLeft[0][0].y + BATTLE_ABILITY_DIMENSIONS.height/2, 
                    battleAbilityTopLeft[1][0].x + BATTLE_ABILITY_DIMENSIONS.width/2, 
                    battleAbilityTopLeft[1][0].y + BATTLE_ABILITY_DIMENSIONS.height/2, 2);                
                row--;
                sleep(0.05);
            }            
        } else if (abilities[i].x > row + 2) {
            // need to seek downwards (increasing the row) by abilities.x - (row + 2)
            let rowsToSeek = abilities[i].x - (row + 2);
            for(let j = 0; j < rowsToSeek; j++) {
                swipe(battleAbilityTopLeft[2][0].x + BATTLE_ABILITY_DIMENSIONS.width/2, 
                    battleAbilityTopLeft[2][0].y + BATTLE_ABILITY_DIMENSIONS.height/2, 
                    battleAbilityTopLeft[1][0].x + BATTLE_ABILITY_DIMENSIONS.width/2, 
                    battleAbilityTopLeft[1][0].y + BATTLE_ABILITY_DIMENSIONS.height/2, 2);                
                row++;
                sleep(0.05);
            }
        }
        pressAbilityButton(abilities[i].x - row, abilities[i].y);
        if(abilities[i].target !== undefined) {
            sleep(0.1);
            activateUnit(abilities[i].target);
            sleep(0.3);
        }
    }

    // pause long enough for the "unit finished selection" animation
    sleep(0.5);
}

// x is the row on the ability list, 0 indexed, y = 0 or 1 (left or right ability in the row)
function pressAbilityButton(x, y) {
    tapMiddle({x: battleAbilityTopLeft[x][y].x, y: battleAbilityTopLeft[x][y].y,
               width: BATTLE_ABILITY_DIMENSIONS.width, height: BATTLE_ABILITY_DIMENSIONS.height}, 10000)
    sleep(0.4);
}

function isEsperGaugeFull() {
    return areColorsPresentInRegion(esperGaugeFullColors, esperGaugeRegion);
}

function isTurnReady() {
    return areColorsPresentInRegion(reloadButtonActiveColors, reloadButtonCheckRegion);
}

function isMainMenuTopBarVisible() {
    return areColorsPresentInRegion(titleBarGoldCoinColors, titleBarGoldCoinCheckRegion);
}

// region size: 1450 x 300
// top left pixels of each friend unit in the "pick a companion" dialog before a battle
const FRIEND_TOP_LEFT = [
    {x: 44, y: 643},
    {x: 44, y: 1001},
    {x: 44, y: 1359},
    {x: 44, y: 1717}
];

// region from the top left pixel of a friend unit that could have the status/drop bonus overlay
const FRIEND_REGION_WITH_BONUS = { height: 285, width: 285 };

// pixels from bonus green arrow for status/drop bonus
const bonusColors = [
    { color: 50688, x: 0, y: 0 },
    { color: 50688, x: 0, y: -1 },
    { color: 50688, x: 0, y: -2 },
    { color: 50688, x: 0, y: -3 }
];

// a few white/black pixels to match the "Depart without companion" option in the "pick a companion" dialog
const departWithoutCompanionColors = [
    { color: 2575, x: 0, y: 0 },
    { color: 15658991, x: 278, y: 1 },
    { color: 4633, x: 283, y: 1 }
];

// vertical distance between adjacent friends in the "pick a companion" dialog
const friendDistance = FRIEND_TOP_LEFT[1].y - FRIEND_TOP_LEFT[0].y;

function reachedEndOfFriendList() {
    return areColorsPresentInRegion(departWithoutCompanionColors);
}

// return the index of the friend unit with a bonus (from 0 to 3) or -1 if none found
function findBonusUnit() {
    for(let j = 0; j < 10; j++) {
        // look for the bonus every 200ms 5 times, since it fades in and out
        let found = false;
        for(let i = 0; i <= 3; i++) {
            var region = { x: FRIEND_TOP_LEFT[i].x, y: FRIEND_TOP_LEFT[i].y, 
                height: FRIEND_REGION_WITH_BONUS.height, width: FRIEND_REGION_WITH_BONUS.width };

            if(areColorsPresentInRegion(bonusColors,region)) {
                found = true;
                return i;
            }
        }
        sleep(0.2);
    }

    return -1;
}

// swipes through the current companion list. returns the row index of a bonus unit or -1 if none found
function searchFriendListForBonus() {
    let bonusFriend = -1;
    while(!reachedEndOfFriendList()) {
        bonusFriend = findBonusUnit();
        if(bonusFriend >= 0) {
            break;
        }
        swipe(FRIEND_TOP_LEFT[3].x, FRIEND_TOP_LEFT[3].y, FRIEND_TOP_LEFT[3].x, FRIEND_TOP_LEFT[3].y - friendDistance*4, 1);
    }
    if(bonusFriend == -1) {
        // one last try in case we just swiped a bonus unit into view
        bonusFriend = findBonusUnit();
    }
    return bonusFriend;
}

// scroll through the friend list, tapping any bonus units. if a bonus unit does not exist, pick the first row
function tapBonusFriendOrDefault(companionTabs = null) {
    let bonusFriend = -1;

    if(companionTabs == null || companionTabs.length == 0) {
        // look for units in the current tab only
        bonusFriend = searchFriendListForBonus();
    } else {
        for(let i = 0; i < companionTabs.length; i++) {
            selectCompanionTab(companionTabs[i]);
            bonusFriend = searchFriendListForBonus();
            if(bonusFriend != -1) {
                break;
            }
        }
    }

    if(bonusFriend == -1) {
        // searched all the tabs and still couldn't find one, so just pick whatever is here
        bonusFriend = 0;
    }

    tap(FRIEND_TOP_LEFT[bonusFriend].x + 50, FRIEND_TOP_LEFT[bonusFriend].y + 50);
    sleep(1.5);
}

const HOME_BUTTON_TEXT_REGION = { x: 1324, y: 346, width: 173, height: 78 };

// if we're at a raid, MK, etc., screen then there's a Home button
// was using findColors for this but there's a slight difference depending on which screen
function atEventScreen() {
    return readText(HOME_BUTTON_TEXT_REGION) == "Home";
}

const PARTY_NAME_REGION = {x: 1034, y: 486, width: 452, height: 59};



// get the name of our currently selected party
function getPartyName() {
    return readText(PARTY_NAME_REGION);
}

const SHIFT_PARTY_LEFT_BUTTON = {x: 20, y: 732};
const SHIFT_PARTY_RIGHT_BUTTON = {x: 1510, y: 732};

// try to select the party with the specified name
function selectParty(partyName) {
    for(let i = 0; i < 5; i++) {
        if(getPartyName() == partyName) {
            return true;
        } 
        tap(SHIFT_PARTY_RIGHT_BUTTON.x, SHIFT_PARTY_RIGHT_BUTTON.y);
        sleep(0.5);
    }
    return false;
}

const DAILY_QUEST_CLOSE_REGION = {x: 236, y:1441, width:324, height:90}
const DAILY_QUEST_CLOSE_BUTTON_COLORS = [
    { color: 4182, x: 0, y: 0 },
    { color: 15856116, x: 0, y: -11 },
    { color: 2358, x: 0, y: -22 }
];

// white pixels from e and x in Next and a dark pixel above x
const NEXT_BUTTON_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 3646, x: 1, y: -16 },
    { color: 16777215, x: -22, y: -1 }
];

// a mission that has 5 rewards uses this Next button
const NEXT_BUTTON_2_COLORS = [
    { color: 16645630, x: 0, y: 0 },
    { color: 16777215, x: 20, y: 0 },
    { color: 201808, x: 21, y: -8 }
];

// Next button shifts slightly across screens, make the height a bit bigger to accommodate both
const NEXT_BUTTON_REGION = {x: 594, y: 1785, width: 350, height: 200}

// post-battle next button
function isNextButtonActive() {
    return areColorsPresentInRegion(NEXT_BUTTON_COLORS, NEXT_BUTTON_REGION) 
    || areColorsPresentInRegion(NEXT_BUTTON_2_COLORS, NEXT_BUTTON_REGION);
}

// light and dark pixels from R and e
const DONT_REQUEST_BUTTON_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 16777215, x: 25, y: 6 },
    { color: 75365, x: -3, y: -11 },
    { color: 140136, x: 37, y: 0 }
]

const DONT_REQUEST_BUTTON_REGION = {x: 40, y: 1395, width: 700, height: 205};

// friend request dialog
function isDontRequestButtonActive() {
    return areColorsPresentInRegion(DONT_REQUEST_BUTTON_COLORS, DONT_REQUEST_BUTTON_REGION);
}

// daily quest complete dialog
function isDailyQuestCloseButtonActive() {
    return areColorsPresentInRegion(DAILY_QUEST_CLOSE_BUTTON_COLORS, DAILY_QUEST_CLOSE_REGION);
}

// taps the post-battle next button 
function tapNextButton() {
    tapMiddle(NEXT_BUTTON_REGION);
}

// tap the Don't Request button in the friend request dialog
function tapDontRequestButton() {
    tapMiddle(DONT_REQUEST_BUTTON_REGION);
}

// click the close button in the daily quest complete dialog
function tapDailyQuestCloseButton() {
    tapMiddle(DAILY_QUEST_CLOSE_REGION);
}

// after completing a battle we need to click through a bunch of screens
// stops once it sees the "Home" button
function dismissVictoryScreenDialogs(endFunction = atEventScreen) {
    while(!endFunction()) {
        if(isDailyQuestCloseButtonActive()) {
            tapDailyQuestCloseButton(); sleep(1);
        } else if(isNextButtonActive()) {
            tapNextButton(); sleep(1);
        } else if(isDontRequestButtonActive()) {
            tapDontRequestButton(); sleep(1);
        } else {
            // tap center of screen to hurry things along
            // if the event screen doesn't load up fast enough and we click here, nothing bad happens
            tap(760, 1250);
            sleep(0.25);
        }
    }
    sleep(1);
}

const EVENT_1_REGION = {x: 43, y: 476, width: 1445, height: 434 }
const EVENT_2_REGION = {x: 43, y: 1081, width: 1445, height: 434 }
const EVENT_3_REGION = {x: 43, y: 1685, width: 1445, height: 269 }

const VORTEX_TAB_REGIONS = [
    {x: 20, y: 304, width: 297, height: 101 },   // Event
    {x: 320, y: 304, width: 297, height: 101 },  // Enhance
    {x: 620, y: 304, width: 297, height: 101 },  // Special
    {x: 920, y: 304, width: 297, height: 101 },  // Nemeses
    {x: 1220, y: 304, width: 297, height: 101 }  // Challenges
]

// when in the Vortex, x is the tab and y is the row within the tab
// example: Special -> Training the Soul: (2, 1)
function selectVortex(x, y) {
    tapMiddle(VORTEX_TAB_REGIONS[x]);
    sleep(0.7);
    let row = 0;
    // if we're at row 0 then we can also see row 1 and row 2
    for(; row < y - 2; row++) {
        swipe(EVENT_2_REGION.x, EVENT_2_REGION.y, EVENT_1_REGION.x, EVENT_1_REGION.y);
        sleep(0.1);
    }
    if(row == y) {
        tapMiddle(EVENT_1_REGION);
    } else if(row == y-1) {
        tapMiddle(EVENT_2_REGION);
    } else {
        tapMiddle(EVENT_3_REGION);
    }
    poll(isBackButtonActive, 5, 0.5);
    sleep(0.5);
}

// from Home, enter the Vortex
function enterVortex() {
    tap(450, 1120); // Vortex swirl
    sleep(2);
}

// from Vortex, go back to Home
function exitVortex() {
    tap(100, 70); // Back button
    sleep(0.25);
    tap(100, 70); // double tap because it has been getting stuck
    sleep(2);
}

// top-left back button that applies to almost all situations
function tapBackButton() {
    tap(140, 320); // Back button
    sleep(2);
}

const MAIN_MENU_LABEL_REGION = {x: 591, y: 1634, width: 357, height: 55 }
// read the label of the currently active main menu action (World, Arena, Expedition, etc.)
function getMainMenuLabel() {
    return readText(MAIN_MENU_LABEL_REGION, 0.5);
}

const SHIFT_MAIN_MENU_RIGHT_BUTTON = {x: 1480, y: 1520};
// try to select the main menu action with the specified name
function selectMainMenu(label) {
    for(let i = 0; i < 5; i++) {
        if(getMainMenuLabel() == label) {
            return true;
        } 
        tap(SHIFT_MAIN_MENU_RIGHT_BUTTON.x, SHIFT_MAIN_MENU_RIGHT_BUTTON.y);
        sleep(0.5);
    }
    return false;
}

// tap the main menu action to enter it (World, Arena, Expedition, etc.)
function tapActiveMainMenuButton() {
    tapMiddle(MAIN_MENU_LABEL_REGION);
    sleep(3);
}

const COMPANION_TAB_REGIONS = [
    {x: 10, y: 530, width: 302, height: 101 },   // Favorite
    {x: 315, y: 530, width: 297, height: 101 },  // Event 1
    {x: 619, y: 530, width: 297, height: 101 },  // Event 2
    {x: 924, y: 530, width: 297, height: 101 },  // Nemesis 1
    {x: 1229, y: 530, width: 297, height: 101 }  // Nemesis 2
]
// choose which companion tab to activate
function selectCompanionTab(x) {
    tapMiddle(COMPANION_TAB_REGIONS[x]);
     // TODO poll for the "Connecting..." to go away and sanity check that we're still at the Companion screen
    sleep(2);
}

// at the home screen, clicks the FREE!! button for viewing ads
const MAIN_MENU_AD_BUTTON = {x: 175, y: 274};
function tapMainMenuAdButton() {
    tap(MAIN_MENU_AD_BUTTON.x, MAIN_MENU_AD_BUTTON.y);
    sleep(2);
}

// inside an event's difficulty selection, there is an event title
const EVENT_TEXT_REGION = { x: 288, y: 343, width: 543, height: 55};
function readEventText() {
    return readText(EVENT_TEXT_REGION);
}

const BACK_BUTTON_ACTIVE_COLORS = [
    { color: 16777215, x: 0, y: 0 },
    { color: 16523, x: 0, y: -25 },
    { color: 5963, x: 37, y: -1 }
];

const BACK_BUTTON_REGION = {x: 50, y: 280, width: 207, height: 115};

// the back button that displays under the title bar. applies to raids, events, etc. except for the top level vortex. 
function isBackButtonActive() {
    return areColorsPresentInRegion(BACK_BUTTON_ACTIVE_COLORS, BACK_BUTTON_REGION);
}

const BRAVE_SHIFT_REGION = {x: 80, y: 1908, width: 970, height: 113};
function tapBraveShift() {
    tapMiddle(BRAVE_SHIFT_REGION);
    sleep(3);
}


module.exports = {
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, getMainMenuLabel, selectMainMenu, tapActiveMainMenuButton, 
    tapMainMenuAdButton, isBackButtonActive, readEventText,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, getPartyName,
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    isBattleUnitReady, tapBraveShift,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs    
}