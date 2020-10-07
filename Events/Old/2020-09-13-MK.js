// --------------------------------------
// Information of recording
// Time: 2020-09-13 10:53:12
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at
const { pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, selectAbilities, isEsperGaugeFull, isTurnReady, poll, sleep } = require("../ffbe")

appActivate("com.square-enix.ffbeww");

usleep(500000);

selectAbilities(1, [{x: 1, y: 0}]);
selectAbilities(4, [{x: 11, y: 1}]);
selectAbilities(3, [{x: 2, y: 0}, {x: 9, y: 0}, {x: 9, y: 0}, {x: 9, y: 0}]);
activateUnit(4);
sleep(1);
activateUnit(1);
sleep(1);
activateUnit(3);
sleep(17);

pressReload();
activateUnit(4);
sleep(1);
activateUnit(1);
sleep(1);
activateUnit(3);
sleep(17);

pressReload();
activateUnit(4);
sleep(1);
activateUnit(1);
sleep(1);
activateUnit(3);