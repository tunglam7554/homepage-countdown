const dev = false;
getWallpaper();
// Set the target date and time
const targetDate = new Date();
if (dev == true) {
    targetDate.setHours(24);
    targetDate.setMinutes(0);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);
} else {
    targetDate.setHours(17);
    targetDate.setMinutes(15);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);
}

var day = targetDate.getDay();
day = day < 10 ? "0" + day : day;
const year = targetDate.getFullYear();

document.getElementById("month").innerHTML =
    day + " " + targetDate.toLocaleString("default", { month: "long" });
document.getElementById("year").innerHTML = year;

// Update the countdown every 1 second
const countdown = setInterval(() => {
    const now = new Date().getTime();

    const timeRemaining = targetDate - now;
    const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

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

    if (timeRemaining < 0) {
        notifyMe();
        clearInterval(countdown);
    }
}, 1000);

function notifyMe() {
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

function getWallpaper() {
    var api =
        "https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-US";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            console.log(response);
            document.getElementById("body").style.backgroundImage =
                "url(" + response.url + ")";
        }
    };
    xhttp.open("GET", api);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
}