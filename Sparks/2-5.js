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

activateUnit(2);
activateUnit(5);