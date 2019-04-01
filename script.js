function CustomChrono() {
    var _this = this;
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
    // chrono 2
    let chrono2 = new Chrono();
    chrono2.setTargetText(div.getElementsByClassName("chronotime")[1]);
    div.getElementsByClassName("startstop")[1].addEventListener("click", function () {
        _this.btn1(1);
    });
    div.getElementsByClassName("reset")[1].addEventListener("click", function () {
        _this.btn2(1)
    });

    // general
    _this.chronos = {};
    _this.chronos[0] = chrono;
    _this.chronos[1] = chrono2;
    div.hidden = false;
    div.id = "";
    document.getElementById("all-chronos-container").appendChild(div);

    _this.btn1 = function(targetChrono) {
        _this.chronos[targetChrono].StartPause()
    };

    _this.btn2 = function(targetChrono) {
        let diff = _this.chronos[targetChrono].diff.getTime() / 1000;
        _this.addScore(diff);
        _this.chronos[targetChrono].Stop();
        _this.chronos[targetChrono].Reset();
    };

    _this.addScore = function(diff) {
        let li = document.createElement("li");
        let input = document.createElement("input");
        input.value = diff;
        li.innerHTML = "Joueur " + ++numPlayer + " : ";
        input.addEventListener("change", function () {
            recalculateTotal()
        });
        li.appendChild(input);
        list.appendChild(li);
        list.scrollBy(0, 1000);
        recalculateTotal();
    }

    function recalculateTotal() {
        let totalValue = 0;
        let lis = div.getElementsByTagName("li");
        for (let i = 0; i < lis.length; i++) {
            totalValue += parseFloat(lis[i].getElementsByTagName("input")[0].value);
        }
        total.innerHTML = totalValue.toFixed(3);
    }

    return _this;
}

var doubleChrono1 = new CustomChrono();
var doubleChrono2 = new CustomChrono();


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
            break;
        case 7:
            doubleChrono.btn2(1);
            break;
    }
});
