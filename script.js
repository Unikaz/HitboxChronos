function CustomChrono(index) {
    var _this = this;
    _this.index = index;
    _this.listValues = [];
    let numPlayer = 0;
    let div = document.getElementById("chrono_model").cloneNode(true);
    let list = div.getElementsByTagName("ul")[0];
    let total = div.getElementsByClassName("total")[0];
    // chrono 1
    let chrono = new Chrono();
    chrono.setTargetText(div.getElementsByClassName("chronotime")[0]);
    div.getElementsByClassName("startstop")[0].addEventListener("click", function () {
        _this.btn1(0)
    });
    div.getElementsByClassName("reset")[0].addEventListener("click", function () {
        _this.btn2(0);
    });
    div.getElementsByClassName("cancel")[0].addEventListener("click", function () {
        _this.btn3(0);
    });
    // chrono 2
    let chrono2 = new Chrono();
    chrono2.setTargetText(div.getElementsByClassName("chronotime")[1]);
    div.getElementsByClassName("startstop")[1].addEventListener("click", function () {
        _this.btn1(1);
    });
    div.getElementsByClassName("reset")[1].addEventListener("click", function () {
        _this.btn2(1)
    });
    div.getElementsByClassName("cancel")[1].addEventListener("click", function () {
        _this.btn3(1);
    });

    // general
    _this.chronos = {};
    _this.chronos[0] = chrono;
    _this.chronos[1] = chrono2;
    div.hidden = false;
    div.id = "";
    document.getElementById("all-chronos-container").appendChild(div);

    _this.btn1 = function (targetChrono) {
        _this.chronos[targetChrono].StartPause()
    };

    _this.btn2 = function (targetChrono) {
        let diff = _this.chronos[targetChrono].diff.getTime();
        _this.addScore(diff);
        _this.chronos[targetChrono].Stop();
        _this.chronos[targetChrono].Reset();
    };

    _this.btn3 = function (targetChrono) {
        _this.chronos[targetChrono].Stop();
        _this.chronos[targetChrono].Reset();
    }

    _this.addScore = function (diff, saveToStorage = true) {
        _this.listValues.push(diff);
        let li = document.createElement("li");
        let input = document.createElement("input");
        input.value = diff / 1000;
        li.innerHTML = "Joueur " + ++numPlayer + " : ";
        input.addEventListener("change", function () {
            _this.listValues = [];
            let lis = div.getElementsByTagName("li");
            for (let i = 0; i < lis.length; i++) {
                _this.listValues.push(parseFloat(lis[i].getElementsByTagName("input")[0].value) * 1000);
            }
            recalculateTotal()
        });
        li.appendChild(input);
        list.appendChild(li);
        list.scrollBy(0, 1000);
        recalculateTotal(saveToStorage);
    };

    function recalculateTotal(saveToStorage = true) {
        let totalValue = 0;
        let lis = div.getElementsByClassName("values")[0].children;
        let bests = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
        let bestsPlayer = ["","",""];
        for (let i = 0; i < lis.length; i++) {
            let val = parseFloat(lis[i].getElementsByTagName("input")[0].value) * 1000;
            totalValue += val;
            if(val <= bests[0]){
                bests[2] = bests[1];
                bestsPlayer[2] = bestsPlayer[1];
                bests[1] = bests[0];
                bestsPlayer[1] = bestsPlayer[0];
                bests[0] = val;
                bestsPlayer[0] = "Joueur " + (i+1) + " : " + val/1000;
            }else if(val <= bests[1]){
                bests[2] = bests[1];
                bestsPlayer[2] = bestsPlayer[1];
                bests[1] = val;
                bestsPlayer[1] = "Joueur " + (i+1) + " : " + val/1000;
            }else if(val <= bests[2]){
                bests[2] = val;
                bestsPlayer[2] = "Joueur " + (i+1) + " : " + val/1000;
            }
        }
        let bestDisplay = div.getElementsByClassName("best-scores")[0].children[0];
        bestDisplay.children[0].innerHTML = bestsPlayer[0];
        bestDisplay.children[1].innerHTML = bestsPlayer[1];
        bestDisplay.children[2].innerHTML = bestsPlayer[2];
        let date = new Date(totalValue);
        total.innerHTML = (date.getHours() > 1 ? (date.getHours() - 1) + "h " : "") + date.getMinutes() + "m " + date.getSeconds() + "s " + date.getMilliseconds();
        if (saveToStorage) {
            _this.saveToStorage(_this.listValues, _this.index);
        }
    }

    _this.saveToStorage = function (listValues, index) {
        localStorage.setItem("list" + index, JSON.stringify(listValues));
    };

    return _this;
}

var doubleChrono1 = new CustomChrono(0);
var doubleChrono2 = new CustomChrono(1);


// Gamepad handling
addEventListener("buttonTemp", function (e) {
    let doubleChrono;
    if (e.gamepad.index === 0)
        doubleChrono = doubleChrono1;
    else
        doubleChrono = doubleChrono2;

    switch (e.key) {
        case 4:
            doubleChrono.btn1(0);
            break;
        case 5:
            doubleChrono.btn1(1);
            break;
        case 6:
            doubleChrono.btn2(0);
            // saveToStorage(doubleChrono.listValues, e.gamepad.index);
            break;
        case 7:
            doubleChrono.btn2(1);
            // saveToStorage(doubleChrono.listValues, e.gamepad.index);
            break;
    }
});

// load/save data

window.onload = function () {
    // chronos 0
    let values = JSON.parse(localStorage.getItem("list0"));
    for (let i = 0; i < values.length; i++) {
        doubleChrono1.addScore(values[i], false);
    }
    // chronos 1
    values = JSON.parse(localStorage.getItem("list1"));
    for (let i = 0; i < values.length; i++) {
        doubleChrono2.addScore(values[i], false);
    }
}
//