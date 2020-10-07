// --------------------------------------
// Information of recording
// Time: 2020-09-17 14:14:20
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

// Transcendent Heroes: VS Itachi
// Requirements: No friend
// Start point: Turn 1
// End point: Battle complete

const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

appActivate("com.square-enix.ffbeww");

const { pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, sleep, selectAbilities } = require("../ffbe")

usleep(100000);

selectAbilities(1, [{x: 2, y: 1}, {x: 10, y: 0}, {x: 10, y: 0}, {x: 10, y: 0}]);
selectAbilities(4, [{x: 2, y: 1}, {x: 9, y: 0}, {x: 9, y: 0}, {x: 9, y: 0}]);
selectAbilities(2, [{x: 3, y: 1}, {x: 7, y: 0}, {x: 7, y: 0}, {x: 7, y: 0}]);
selectAbilities(5, [{x: 6, y: 0}, {x: 8, y: 1}, {x: 8, y: 1}, {x: 8, y: 1}]);
selectAbilities(3, [{x: 3, y: 0}, {x: 5, y: 0}, {x: 7, y: 0}, {x: 7, y: 0}]);
activateUnit(1);
activateUnit(2);
activateUnit(3);
activateUnit(4);
activateUnit(5);
activateUnit(6);
sleep(42);

pressReload();
activateUnit(1);
activateUnit(4);
activateUnit(2);
activateUnit(5);
sleep(32);
activateUnit(3);
activateUnit(6);
sleep(13);

pressReload();
openUnitAbility(1);
selectAbilities(1, [{x: 2, y: 1}, {x: 9, y: 0}, {x: 9, y: 0}, {x: 9, y: 0}]);
activateUnit(2);
activateUnit(5);
sleep(6);
activateUnit(1);
activateUnit(4);