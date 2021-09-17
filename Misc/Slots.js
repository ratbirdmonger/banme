// --------------------------------------
// Information of recording
// Time: 2021-07-14 19:43:05
// Resolution: 1536, 2048
// Front most app: FF EXVIUS
// Orientation of front most app: Portrait
// --------------------------------------

const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at

appActivate("com.square-enix.ffbeww");

while(true) {
    touchDown(8, 834.35, 1584.47);
    usleep(1000);
    touchUp(8, 834.35, 1584.47);
    usleep(10000);
    
    touchDown(7, 1161.96, 1243.59);
    usleep(1000);
    touchUp(7, 1161.96, 1243.59);
    usleep(10000);
    
    touchDown(1, 811.12, 1667.44);
    usleep(1000);
    touchUp(1, 811.12, 1667.44);
    usleep(10000);
    
    touchDown(6, 226.41, 84.12);
    usleep(1000);
    touchUp(6, 226.41, 84.12);
    usleep(10000);
}
