const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

const { pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, selectAbilities, 
 isEsperGaugeFull, isTurnReady, poll, sleep, tap, tapBonusFriendOrDefault, isMainMenuTopBarVisible, atEventScreen, tapDailyQuestCloseButton,
 selectParty, dismissVictoryScreenDialogs } = require(`${at.rootDir()}/ffbe/ffbe`);

function executeEXTDaily() {
    sleep(1);

    // select difficulty (there's only one)
    tap(770, 670);
    sleep(1.5);

    // next
    tap(780, 1970);
    sleep(1)

    // "Unit Limited Quest" back button here 
    tap(715, 1525);
    sleep(1);

    // select party
    if(!selectParty("Raid")) {
        alert("Could not find Raid party");
        at.stop();
    }

    // tap depart
    tap(820, 1880);

    poll(isTurnReady, 30, 1);

    // vaan steals
    selectAbilities(1, [{x: 4, y: 0}, {x: 5, y: 0}, {x: 5, y: 0}, {x: 5, y: 0}]);
    // basch covers
    selectAbilities(4, [{x: 2, y: 0}]);
    // ashe DPS
    selectAbilities(2, [{x: 3, y: 1}, {x: 8, y: 1}, {x: 10, y: 0}, {x: 10, y: 0}])
    // fran DPS
    selectAbilities(5, [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 1}, {x: 2, y: 1}])
    // balthier BREAK
    selectAbilities(3, [{x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 1}]);

    activateUnit(1);
    activateUnit(3);
    activateUnit(4);
    // wait for boss to BREAK
    sleep(10);

    activateUnit(2);
    activateUnit(5);
    sleep(1.5);

    poll(function() {return isTurnReady() || isMainMenuTopBarVisible()}, 30, 1);
    if(isTurnReady) {
        pressReload();
        activateUnit(1);
        activateUnit(3);
        activateUnit(4);
        sleep(3);
        
        activateUnit(2);
        activateUnit(5);
        sleep(1.5);
        poll(isMainMenuTopBarVisible, 30, 1);
    }

    dismissVictoryScreenDialogs();
}

module.exports = {
    executeEXTDaily
}