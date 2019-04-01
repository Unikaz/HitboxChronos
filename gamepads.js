var Gamepad = function () {
    var _this = this;

    _this.haveEvents = 'GamepadEvent' in window;
    _this.controllers = {};
    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame;


    _this.updateStatus = function () {
        _this.scangamepads();

        for (j in _this.controllers) {
            let controller = _this.controllers[j];
            for (let i = 0; i < controller.buttons.length; i++) {
                let val = controller.buttons[i];
                let pressed = val === 1.0;
                if (typeof(val) === "object") {
                    pressed = val.pressed === true;
                    val = val.value;
                }
                _this.setInput(controller, i, pressed);
            }
            let str ='';
            for (let i = 0; i < controller.axes.length; i++) {
                str += " " + controller.axes[i].toFixed(4);
            }
        }
        rAF(_this.updateStatus);
    };

    _this.connecthandler = function (e) {
        _this.addgamepad(e.gamepad);
    };

    _this.addgamepad = function (gamepad) {
        _this.controllers[gamepad.index] = gamepad;
        rAF(_this.updateStatus);
    };

    _this.disconnecthandler = function (e) {
        _this.removegamepad(e.gamepad);
    }

    _this.removegamepad = function (gamepad) {
        delete _this.controllers[gamepad.index];
    }

    _this.scangamepads = function () {
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in _this.controllers)) {
                    _this.addgamepad(gamepads[i]);
                } else {
                    _this.controllers[gamepads[i].index] = gamepads[i];
                }
            }
        }
    };

    _this.setInput = function (gamepad, key, status) {
        //get keys[] from gamepad
        let keys;
        let tempKeys;
        if ((gamepad.index in _this.gamepads)) {
            keys = _this.gamepads[gamepad.index]['keys'];
            tempKeys = _this.gamepads[gamepad.index]['tempKeys'];
        } else {
            keys = {};
            tempKeys = {};
            _this.gamepads[gamepad.index] = {};
            _this.gamepads[gamepad.index]['keys'] = keys;
            _this.gamepads[gamepad.index]['tempKeys'] = tempKeys;
        }
        // check key previous state
        if (key in keys) {
            if (keys[key] !== status) {
                keys[key] = (status === true);
                if (status) {
                    let buttonDown = new CustomEvent("buttonDown");
                    buttonDown.key = key;
                    buttonDown.gamepad = gamepad;
                    dispatchEvent(buttonDown);
                    _this.checkTempKey(gamepad, key);
                }
                else {
                    let buttonUp = new CustomEvent("buttonUp");
                    buttonUp.key = key;
                    buttonUp.gamepad = gamepad;
                    dispatchEvent(buttonUp);
                    tempKeys[key] = false;
                }
            }
            else if (status === true) {
                let buttonPress = new CustomEvent("buttonPress");
                buttonPress.key = key;
                buttonPress.gamepad = gamepad;
                dispatchEvent(buttonPress);
                _this.checkTempKey(gamepad, key);
            }
        } else {
            keys[key] = (status === true);
            tempKeys[key] = false;
        }
    };

    _this.checkTempKey = function (gamepad, key) {
        if (!_this.gamepads[gamepad.index]['tempKeys'][key]) {
            _this.gamepads[gamepad.index]['tempKeys'][key] = true;
            let buttonTemp = new CustomEvent("buttonTemp");
            buttonTemp.key = key;
            buttonTemp.gamepad = gamepad;
            dispatchEvent(buttonTemp);
            setTimeout(function () {
                _this.gamepads[gamepad.index].tempKeys[key] = false;
            }, _this.btnTempMs);
        }
    };

// change input to event ButtonPressDown, ButtonPressUp
    _this.gamepads = {};
    _this.btnTempMs = 500;


    _this.scangamepads();
    window.addEventListener("gamepadconnected", _this.connecthandler);
    window.addEventListener("gamepaddisconnected", _this.disconnecthandler);
    if (!_this.haveEvents) {
        setInterval(_this.scangamepads, 500);
    }

    return _this;
}

new Gamepad();