var dev;
var isCountdown;
var coundown;
var targetDate;
var setting_selected_countdown;
LoadWallpaper();
LoadDate();
AddEventListener();
LoadSetting();
if (isCountdown) {
    SetCountdown();
} else {
    SetClock();
}
LoadShortCut();

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

function LoadWallpaper() {
    var wallpaper = JSON.parse(localStorage.getItem('wallpaper'));
    var url = wallpaper?.url;
    var updatedAt = new Date(wallpaper?.updatedAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!wallpaper || !url || !updatedAt || updatedAt < today) {
        var api =
            "https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-US";

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                console.log(response);
                var updateTime = new Date();
                document.getElementById("body").style.backgroundImage =
                    "url(" + response.url + ")";
                localStorage.setItem('wallpaper', JSON.stringify({ url: response.url, updatedAt: updateTime }));
                document.getElementById("update-time").innerText = updateTime.toLocaleString();
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

function LoadSetting() {
    dev = JSON.parse(localStorage.getItem('dev'));
    isCountdown = JSON.parse(localStorage.getItem('isCountdown'));
    setting_selected_countdown = isCountdown;
    const timer = localStorage.getItem('timer');
    var wallpaper = JSON.parse(localStorage.getItem('wallpaper'));
    if (wallpaper != null && wallpaper.updatedAt != null) {
        document.getElementById("update-time").innerText = (new Date(wallpaper.updatedAt).toLocaleString());
    }
    document.getElementById('time-picker').value = timer;
    if (isCountdown) {
        document.getElementById('time-picker').disabled = false;
        document.getElementById('clock_type:countdown').classList.add("selected");
        document.getElementById('clock_type:time').classList.remove("selected");
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
    } else {
        document.getElementById('time-picker').disabled = true;
        document.getElementById('clock_type:countdown').classList.remove("selected");
        document.getElementById('clock_type:time').classList.add("selected");
    }
}

function LoadShortCut() {
    var listShortCut = `<a href="https://tulavideo.web.app" class="web-item" target="_blank">
            <div class="web-item-bg">
                <img src="./assets/tulavideo.png" />
            </div>
            <span>TulaVideo</span>
        </a>
        <a href="https://tulamusic.web.app" class="web-item" target="_blank">
            <div class="web-item-bg">
                <img src="./assets/tulamusic.png" />
            </div>
            <span>TulaMusic</span>
        </a>
        <a href="https://tulavideo.web.app/toptop" class="web-item" target="_blank">
            <div class="web-item-bg">
                <img src="./assets/tik-tok.png" />
            </div>
            <span>TopTop</span>
        </a>`;

    var shortCut = JSON.parse(localStorage.getItem('shortcut'));
    shortCut?.map(item => {
        listShortCut += `<a href="${item.url}" class="web-item" target="_blank">
                <div class="web-item-bg">
                    <img src="${item.icon}" />
                </div>
                <span>${item.name}</span>
            </a>`;
    });

    listShortCut += `<div class="web-item" data-bs-toggle="modal" data-bs-target="#popup-add">
        <div class="web-item-bg">
            <img src="./assets/add.png" style="height: 24px;width: 24px;" />
        </div>
    </div>`;
    document.getElementById('web-grid').innerHTML = listShortCut;

    document.getElementById('btn-add').addEventListener('click', function () {
        var name = document.getElementById('shortcut-name').value;
        var url = document.getElementById('shortcut-url').value;
        if (name != null && name != "" && url != null && url != "") {
            var newShortCut = {
                url: "https://" + url,
                name: name,
                icon: `https://www.google.com/s2/favicons?domain=${url}&sz=48`
            }
            var listShortCut = JSON.parse(localStorage.getItem('shortcut'));
            if (listShortCut != null) {
                if (listShortCut.findIndex(item => item.url == newShortCut.url) == -1) {
                    listShortCut.push(newShortCut);
                } else {
                    alert("This website already added!");
                    return;
                }
            } else {
                listShortCut = [newShortCut];
            }
            localStorage.setItem('shortcut', JSON.stringify(listShortCut));
            LoadShortCut();
            document.getElementById('shortcut-name').value = "";
            document.getElementById('shortcut-url').value = "";
        }
    });
}

function AddEventListener() {
    const modalSetting = document.getElementById('popup-setting');
    modalSetting.addEventListener('show.bs.modal', LoadSetting);

    document.getElementById('clock_type:time').addEventListener('click', function () {
        setting_selected_countdown = false;
        document.getElementById('time-picker').disabled = true;
        document.getElementById('clock_type:countdown').classList.remove("selected");
        document.getElementById('clock_type:time').classList.add("selected");
    });

    document.getElementById('clock_type:countdown').addEventListener('click', function () {
        setting_selected_countdown = true;
        document.getElementById('time-picker').disabled = false;
        document.getElementById('clock_type:countdown').classList.add("selected");
        document.getElementById('clock_type:time').classList.remove("selected");
    });

    document.getElementById('btn-new-wallpaper').addEventListener('click', function () {
        localStorage.setItem('wallpaper', null);
        LoadWallpaper();
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
            LoadSetting();
            SetCountdown();
        } else {
            localStorage.setItem('isCountdown', false);
            clearInterval(countdown);
            LoadSetting();
            SetClock();
        }
    });
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