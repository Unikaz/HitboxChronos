var Chrono = function () {

    var _this = this;

    _this.startTime = 0;
    _this.start = 0;
    _this.end = 0;
    _this.diff = 0;
    _this.timerID = 0;
    _this.text = "";
    _this.targetText = null;
    _this.isRunning = false;

    //events
    _this.updateValue = new CustomEvent("update-value");

    _this.chrono = function () {
        _this.end = new Date();
        _this.diff = _this.end - _this.start;
        _this.diff = new Date(_this.diff);
        var msec = _this.diff.getMilliseconds();
        var sec = _this.diff.getSeconds()
        var min = _this.diff.getMinutes()
        var hr = _this.diff.getHours() - 1
        if (min < 10) {
            min = "0" + min
        }
        if (sec < 10) {
            sec = "0" + sec
        }
        if (msec < 10) {
            msec = "00" + msec
        }
        else if (msec < 100) {
            msec = "0" + msec
        }
        _this.text =  min + ":" + sec + "," + msec;
        _this.updateValue.value = _this.text;
        dispatchEvent(_this.updateValue);
        _this.timerID = setTimeout(function () {
            _this.chrono()
        }, 10)
        if (_this.targetText !== undefined)
            _this.targetText.innerHTML = _this.text;
    }
    _this.setTargetText = function (target) {
        _this.targetText = target;
    };

    _this.StartPause = function () {
        if (_this.isRunning) {
            _this.isRunning = false;
            clearTimeout(_this.timerID)
        }
        else {
            if (_this.diff !== undefined) {
                _this.start = new Date() - _this.diff
                _this.start = new Date(_this.start)
            } else {
                _this.start = new Date()
            }
            _this.isRunning = true;
            _this.chrono()
        }
    }
    _this.Stop = function () {
        if (_this.isRunning) {
            _this.isRunning = false;
            clearTimeout(_this.timerID)
        }
    }

    _this.Continue = function () {
        _this.start = new Date() - diff
        _this.start = new Date(start)
        _this.chrono()
    }

    _this.Reset = function () {
        _this.text = "00:00,000";
        _this.updateValue.value = _this.text;
        dispatchEvent(_this.updateValue);
        if (_this.targetText !== undefined)
            _this.targetText.innerHTML = _this.text;
        _this.start = new Date()
        _this.diff = undefined;
    }

    return _this;
}