// --------------------------------------
// Information of recording
// Time: 2020-08-10 21:39:03
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at
const { pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, selectAbilities, isEsperGaugeFull, isTurnReady, poll, sleep } = require("../ffbe")

appActivate("com.square-enix.ffbeww");

// AR chainers
activateUnit(6);
activateUnit(3);
sleep(0.367)
// Cloud & Elena
activateUnit(4);
activateUnit(5);
sleep(1.7)
// Tifa
activateUnit(2);
