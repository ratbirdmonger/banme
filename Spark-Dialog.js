const { touchDown, touchMove, touchUp, usleep, appActivate, keyDown, keyUp } = at
const { pressRepeat, pressReload, swipe, openUnitAbility, activateUnit, selectAbilities, isEsperGaugeFull, isTurnReady, poll, sleep } = require("./ffbe")

appActivate("com.square-enix.ffbeww");

const unit1Switch = { type: CONTROLLER_TYPE.SWITCH, title: "Unit 1:", key: "Unit1", value: 0 }
const unit2Switch = { type: CONTROLLER_TYPE.SWITCH, title: "Unit 2:", key: "Unit2", value: 1 }
const unit3Switch = { type: CONTROLLER_TYPE.SWITCH, title: "Unit 3:", key: "Unit3", value: 0 }
const unit4Switch = { type: CONTROLLER_TYPE.SWITCH, title: "Unit 4:", key: "Unit4", value: 0 }
const unit5Switch = { type: CONTROLLER_TYPE.SWITCH, title: "Unit 5:", key: "Unit5", value: 1 }
const unit6Switch = { type: CONTROLLER_TYPE.SWITCH, title: "Unit 6:", key: "Unit6", value: 0 }

/*
Define buttons:
type = CONTROLLER_TYPE.BUTTON
title = Button text
color = Button background color, it's optional, the default value is 0x428BCA
width = Button width upon percentage of the dialog width, it's optional, the default value is 0.5, max value is 1.0.
flag = Integer type of button flag for identifying which button is tapped.
collectInputs = Boolean type specifying wheather the dialog should collect the inputs while this button is tapped.
*/
const btn1 = { type: CONTROLLER_TYPE.BUTTON, title: "Chain", color: 0x71C69E, flag: 1, collectInputs: true }
const btn2 = { type: CONTROLLER_TYPE.BUTTON, title: "Cancel", color: 0xFF5733, flag: 2, collectInputs: true }

// const controls = [unit1Switch, unit2Switch, unit3Switch, unit4Switch, unit5Switch, unit6Switch, btn1, btn2]
const controls = [unit2Switch, unit3Switch, unit5Switch, unit6Switch, btn1, btn2]

// Pop up the dialog. After popping, the script will suspend waiting for user input until any button is tapped, then returns the flag of tapped button.

const result = at.dialog({ controls });

usleep(500000);

if (result == 1) {
    if(unit1Switch.value == 1) {
        activateUnit(1);
    }
    if(unit2Switch.value == 1) {
        activateUnit(2);
    }
    if(unit3Switch.value == 1) {
        activateUnit(3);
    }
    if(unit4Switch.value == 1) {
        activateUnit(4);
    }
    if(unit5Switch.value == 1) {
        activateUnit(5);
    }
    if(unit6Switch.value == 1) {
        activateUnit(6);
    }
}