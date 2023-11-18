var dev;
var isCountdown;
var coundown;
var targetDate;
var setting_selected_countdown;
GetWallpaper();
LoadDate();
AddEventListener();
LoadSetting();
if (isCountdown) {
    SetCountdown();
} else {
    SetClock();
}

function NotifyMe() {
    document.getElementById("notify").classList.remove('hide');
    document.getElementById("countdown").classList.add('hide');

    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        const notification = new Notification("Go home!");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const notification = new Notification("Go home!");
            }
        });
    }
}

function GetWallpaper() {
    var wallpaper = JSON.parse(localStorage.getItem('wallpaper'));
    var url = wallpaper?.url;
    var updatedAt = new Date(wallpaper?.updatedAt);
    const today = new Date();
    today.setHours(7, 0, 0, 0);
    if (!wallpaper || !url || !updatedAt || updatedAt < today) {
        var api =
            "https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-US";

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                console.log(response);
                document.getElementById("body").style.backgroundImage =
                    "url(" + response.url + ")";
                localStorage.setItem('wallpaper', JSON.stringify({ url: response.url, updatedAt: new Date() }));
            }
        };
        xhttp.open("GET", api);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    } else {
        document.getElementById("body").style.backgroundImage =
            "url(" + url + ")";
    }
}

function openSetting() {
    var overlay = document.getElementById('overlay');
    overlay.classList.toggle('hide');
}

function AddEventListener() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('popup');
    overlay.addEventListener('click', function () {
        if (!overlay.classList.contains('hide'))
            overlay.classList.add('hide');
    });
    document.getElementById('btn-setting').addEventListener('click', function () {
        overlay.classList.toggle('hide');
    });
    popup.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    var clock_type_time = document.getElementById('clock_type:time');
    clock_type_time.addEventListener('click', function () {
        setting_selected_countdown = false;
        document.getElementById('time-picker').disabled = true;
        document.getElementById('clock_type:countdown').classList.remove("selected");
        document.getElementById('clock_type:time').classList.add("selected");
    });
    var clock_type_countdown = document.getElementById('clock_type:countdown');
    clock_type_countdown.addEventListener('click', function () {
        setting_selected_countdown = true;
        document.getElementById('time-picker').disabled = false;
        document.getElementById('clock_type:countdown').classList.add("selected");
        document.getElementById('clock_type:time').classList.remove("selected");
    });

    document.getElementById('btn-save').addEventListener('click', function () {
        if (setting_selected_countdown == true) {
            var value = document.getElementById('time-picker').value;
            if (value == null || value == "") {
                alert("You must set time for timer!");
                return;
            }

            localStorage.setItem('timer', value);
            localStorage.setItem('isCountdown', true);
            clearInterval(countdown);
            LoadSetting()
            SetCountdown();
        } else {
            localStorage.setItem('isCountdown', false);
            clearInterval(countdown);
            LoadSetting();
            SetClock();
        }
        overlay.classList.add('hide');
    });

    document.getElementById('btn-cancel').addEventListener('click', function () {
        LoadSetting();
        overlay.classList.add('hide');
    });
}

function LoadSetting() {
    dev = JSON.parse(localStorage.getItem('dev'));
    isCountdown = JSON.parse(localStorage.getItem('isCountdown'));
    setting_selected_countdown = isCountdown;
    if (isCountdown) {
        document.getElementById('time-picker').disabled = false;
        document.getElementById('clock_type:countdown').classList.add("selected");
        document.getElementById('clock_type:time').classList.remove("selected");
        const timer = localStorage.getItem('timer');
        targetDate = new Date()
        if (dev == true) {
            targetDate.setHours(24);
            targetDate.setMinutes(0);
            targetDate.setSeconds(0);
            targetDate.setMilliseconds(0);
        } else {
            if (timer != null) {
                targetDate = new Date();
                var timeArray = timer.split(":");
                targetDate.setHours(timeArray[0]);
                targetDate.setMinutes(timeArray[1]);
            } else {
                targetDate.setHours(17);
                targetDate.setMinutes(15);
                targetDate.setSeconds(0);
                targetDate.setMilliseconds(0);
            }
        }
        document.getElementById('time-picker').value = timer;
    } else {
        document.getElementById('time-picker').disabled = true;
        document.getElementById('clock_type:countdown').classList.remove("selected");
        document.getElementById('clock_type:time').classList.add("selected");
    }
}

function LoadDate() {
    var date = new Date();
    var day = date.getDate();
    day = day < 10 ? "0" + day : day;
    const year = date.getFullYear();

    document.getElementById("month").innerHTML =
        day + " " + date.toLocaleString("default", { month: "long" });
    document.getElementById("year").innerHTML = year;
}

function SetCountdown() {
    document.getElementById("notify").classList.add('hide');
    document.getElementById("countdown").classList.remove('hide');
    countdown = setInterval(() => {
        const now = new Date();
        const timeRemaining = targetDate - now;
        const hours = Math.floor(
            (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        var hoursElements = document.getElementsByClassName("hours");
        var hoursOldValue = hours;
        for (let index = 0; index < hoursElements.length; index++) {
            hoursOldValue = hoursElements[index].innerText;
            hoursElements[index].innerText =
                hours < 10 ? "0" + hours.toString() : hours.toString();
        }
        if (hoursOldValue != hours) {
            const flipContainers = document.getElementById("hoursFlip");
            flipContainers.classList.toggle("flipped");
        }

        var minutesElements = document.getElementsByClassName("minutes");
        var minutesOldValue = minutes;
        for (let index = 0; index < minutesElements.length; index++) {
            minutesOldValue = minutesElements[index].innerText;
            minutesElements[index].innerText =
                minutes < 10 ? "0" + minutes.toString() : minutes.toString();
        }
        if (minutesOldValue != minutes) {
            const flipContainers = document.getElementById("minutesFlip");
            flipContainers.classList.toggle("flipped");
        }

        var secondsElements = document.getElementsByClassName("seconds");
        var secondsOldValue = seconds;
        for (let index = 0; index < secondsElements.length; index++) {
            secondsOldValue = secondsElements[index].innerText;
            secondsElements[index].innerText =
                seconds < 10 ? "0" + seconds.toString() : seconds.toString();
        }
        if (secondsOldValue != seconds) {
            const flipContainers = document.getElementById("secondsFlip");
            flipContainers.classList.toggle("flipped");
        }

        if (timeRemaining < 0) {
            NotifyMe();
            clearInterval(countdown);
        }
    }, 1000);
}

function SetClock() {
    document.getElementById("notify").classList.add('hide');
    document.getElementById("countdown").classList.remove('hide');
    countdown = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Display the time remaining
        var hoursElements = document.getElementsByClassName("hours");
        var hoursOldValue = hours;
        for (let index = 0; index < hoursElements.length; index++) {
            hoursOldValue = hoursElements[index].innerText;
            hoursElements[index].innerText =
                hours < 10 ? "0" + hours.toString() : hours.toString();
        }
        if (hoursOldValue != hours) {
            const flipContainers = document.getElementById("hoursFlip");
            flipContainers.classList.toggle("flipped");
        }

        var minutesElements = document.getElementsByClassName("minutes");
        var minutesOldValue = minutes;
        for (let index = 0; index < minutesElements.length; index++) {
            minutesOldValue = minutesElements[index].innerText;
            minutesElements[index].innerText =
                minutes < 10 ? "0" + minutes.toString() : minutes.toString();
        }
        if (minutesOldValue != minutes) {
            const flipContainers = document.getElementById("minutesFlip");
            flipContainers.classList.toggle("flipped");
        }

        var secondsElements = document.getElementsByClassName("seconds");
        var secondsOldValue = seconds;
        for (let index = 0; index < secondsElements.length; index++) {
            secondsOldValue = secondsElements[index].innerText;
            secondsElements[index].innerText =
                seconds < 10 ? "0" + seconds.toString() : seconds.toString();
        }
        if (secondsOldValue != seconds) {
            const flipContainers = document.getElementById("secondsFlip");
            flipContainers.classList.toggle("flipped");
        }
    }, 1000);
}