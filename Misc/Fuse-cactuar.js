// --------------------------------------
// Information of recording
// Time: 2020-09-15 10:45:55
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

appActivate("com.square-enix.ffbeww");

usleep(500000);

// select 2nd cactaur
touchDown(6, 460.29, 877.84);
usleep(49958.50);
touchUp(6, 460.29, 877.84);
usleep(1100206.71);

// tap empty slot
touchDown(12, 178.31, 1326.53);
usleep(57779.71);
touchUp(12, 178.31, 1326.53);
usleep(1292142.67);

// select 1st cactaur
touchDown(8, 150.94, 938.38);
usleep(66528.79);
touchUp(8, 150.94, 938.38);
usleep(483622.67);

// press ok
touchDown(3, 845.13, 1647.53);
usleep(41669.33);
touchUp(3, 845.13, 1647.53);
usleep(1534019.38);

// press fuse, wait a few seconds, tap a few times to speed things along
touchDown(3, 791.23, 1642.53);
usleep(58013.50);
touchUp(3, 791.23, 1642.53);
usleep(3500000);

touchDown(10, 833.53, 1557.12);
usleep(50260.58);
touchUp(10, 833.53, 1557.12);
usleep(841860.50);

touchDown(10, 853.43, 1541.34);
usleep(49451.12);
touchUp(10, 853.43, 1541.34);
usleep(850282.58);

touchDown(10, 870.02, 1547.16);
usleep(41360.08);
touchUp(10, 870.02, 1547.16);
usleep(991953.88);

touchDown(7, 961.24, 1502.38);
usleep(58838.38);
touchUp(7, 961.24, 1502.38);
usleep(1941279.46);

// press change base, taking care to not press filtered button
touchDown(11, 1380.91, 388.50);
usleep(108800.92);
touchUp(11, 1380.91, 388.50);
usleep(50000);