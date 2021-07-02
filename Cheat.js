// WIP - automatically modify esper stats for cheating purposes
// TODO - more espers, act on a list of espers, some sanity checks
const { touchDown, touchMove, touchUp, usleep, getColor, appActivate, keyDown, keyUp, toast, inputText } = at

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
    swipe, sleep, tap, tapMiddle,
    // color & text recognition, polling
    readText, areColorsPresentInRegion, poll,
} = require(`${at.rootDir()}/bot-common/bot-common`);

const esperStats = {
    "odin": "5674,4385,6619,4729,2595,2795",
    "kokuryu": "8456,6818,7113,4389,4989,3789",

}

const newEsperStats = {
    "odin": ["5674000" /* hp */, "4385000" /*mp*/, "6619000" /*atk*/, "4729000" /*def*/, "2595000" /*mag*/, "2795000" /*spr*/ ],
    "kokuryu": ["8456000" /* hp */, "6818000" /*mp*/, "7113000" /*atk*/, "4389000" /*def*/, "4989000" /*mag*/, "3789000" /*spr*/ ]
}

const memoryLocation = [{x: 1289, y: 280}, {x: 1289, y: 415}, {x: 1289, y: 550}, {x: 1289, y: 695}, {x: 1289, y: 830}, {x: 1289, y: 970}]
const espersToModify = ["odin"];

const NEW_SEARCH_REGION = {x: 614, y: 1881, width: 309, height: 130}


sleep(0.5);

// launch memory editor
tap(65, 1985);
sleep(1);

function modifyStats(esperName) {
    if(isImagePresentInRegion(`${at.rootDir()}/banme/Images/igamegod-new.png`, NEW_SEARCH_REGION)) {
        // new search if first search
        tap(800, 1930);
    } else {
        // new search if continuing a search
        tap(1440, 1952);
    }
    sleep(1);
    
    // nearby search
    tap(985, 1750);
    sleep(1);
    
    // switch to uint32
    tap(1180, 930);
    sleep(1);
    tap(850, 1315);
    sleep(1);
    
    // tap text box
    tap(900, 910);
    sleep(1);
    tap(1122, 616); // tap x to clear text box
    sleep(0.5);
    
    inputText(esperStats[esperName]);
    sleep(0.5);
    
    // tap search
    tap(740, 870);
    sleep(5);
    
    for(let i = 0; i <= 5; i++) {
        tap(memoryLocation[i].x, memoryLocation[i].y);
        sleep(0.5);
        tap(540, 980); // tap text box
        sleep(1);
        tap(1113, 675); // tap x to clear text box
        sleep(0.5);
        inputText(newEsperStats[esperName][i]);
        sleep(0.5);
        tap(753, 819); // tap confirm
        sleep(0.5);
    }
}

modifyStats("odin");
modifyStats("kokuryu");