// Set the target date and time
const targetDate = new Date();
targetDate.setHours(17);
targetDate.setMinutes(15);
targetDate.setSeconds(0);
targetDate.setMilliseconds(0);
// Update the countdown every 1 second
const countdown = setInterval(() => {
    // Get the current date and time
    const now = new Date().getTime();

    // Calculate the time remaining
    const timeRemaining = targetDate - now;

    // Calculate the days, hours, minutes, and seconds
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

    // If the countdown is finished, clear the interval
    if (timeRemaining < 0) {
        clearInterval(countdown);
        document.getElementById("countdown").innerHTML = "Go home!";
        notifyMe();
    }
}, 1000);

function notifyMe() {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification("Go home!");
        // …
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification("Go home!");
                // …
            }
        });
    }
}
