const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, findImage } = at

const { 
    // basic gestures
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, readEventText, areColorsPresentInRegion, poll, 
    // menu navigation 
    enterVortex, selectVortex, tapBackButton, exitVortex, selectMainMenu, getMainMenuLabel,
    tapActiveMainMenuButton, tapMainMenuAdButton, isBackButtonActive,
    // pre-battle dialogs
    selectParty, tapBonusFriendOrDefault, selectCompanionTab, 
    // battle commands
    pressRepeat, pressReload, openUnitAbility, selectAbilities, activateUnit, isEsperGaugeFull, isTurnReady, isAutoAttackSelected,
    // post-battle dialogs and checks
    isMainMenuTopBarVisible, isDailyQuestCloseButtonActive, atEventScreen,   
    isDontRequestButtonActive, isNextButtonActive, tapNextButton, tapDontRequestButton, tapDailyQuestCloseButton, dismissVictoryScreenDialogs    
} = require(`${at.rootDir()}/ffbe/ffbe`);

usleep(500000);

// the OCR built into autotouch doesn't detect % symbols

const IW_TOP_ABILITY_CAPTION_REGION = {x: 631, y: 901, width: 470, height: 46};
const IW_LEFT_ABILITY_CAPTION_REGION = {x: 258, y: 1607, width: 470, height: 46};
const IW_RIGHT_ABILITY_CAPTION_REGION = {x: 1016, y: 1607, width: 470, height: 46};

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

// the leftmost orb
const IW_FIRST_ORB_REGION = {x: 799, y: 1943, width: 36, height: 35};
// bright red color that is repeated a bunch of times. empty orb doesn't have it.
const IW_FIRST_ORB_FULL_COLORS = [{ color: 15277843, x: 0, y: 0 }]

function iwOrbLeft() {
    return areColorsPresentInRegion(IW_FIRST_ORB_FULL_COLORS, IW_FIRST_ORB_REGION);
}

const SCROLL_BUTTON_INITIAL_LOCATION = {x: 1515, y: 775};
const SCROLL_BUTTON_END_LOCATION = {x: 1515, y: 2023};

if(iwOrbLeft()) {
    tapMiddle(IW_CHALLENGE_BUTTON_REGION);
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
}

