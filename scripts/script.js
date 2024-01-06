const wallpaperAPI = "https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-US";
let dev, coundown, targetDate;

let loadedSetting = {
    isCountdown: JSON.parse(localStorage.getItem('isCountdown')) || false,
    isOpenLinkInNewTab: JSON.parse(localStorage.getItem('isOpenLinkInNewTab')) || true,
    isRefreshWallpaper: JSON.parse(localStorage.getItem('isRefreshWallpaper')) || true
};

let selectedSetting = {
    isCountdown: loadedSetting.isCountdown,
    isOpenLinkInNewTab: loadedSetting.isOpenLinkInNewTab,
    isRefreshWallpaper: loadedSetting.isRefreshWallpaper
};

const elements = {
    body: document.getElementById("body"),
    updateTime: document.getElementById("update-time"),
    timePicker: document.getElementById("setting:time-picker"),
    setting: {
        countdown: document.getElementById("setting:clock_type-countdown"),
        time: document.getElementById("setting:clock_type-time"),
        refreshWallpaper: document.getElementById("setting:refresh-wallpaper"),
        openInNewTab: document.getElementById("setting:open-in-newtab"),
    },
    webGrid: document.getElementById("web-grid"),
    shortcutName: document.getElementById("shortcut-name"),
    shortcutUrl: document.getElementById("shortcut-url"),
}
const defaultShortcut = [
    {
        icon: "./assets/tulavideo.png",
        name: "TulaVideo",
        url: "https://tulavideo.web.app",
    },
    {
        icon: "./assets/tulamusic.png",
        name: "TulaMusic",
        url: "https://tulamusic.web.app",
    },
    {
        icon: "./assets/tik-tok.png",
        name: "TopTop",
        url: "https://tulavideo.web.app/toptop"
    }
]
initialize();

function initialize() {
    loadWallpaper();
    loadDate();
    addEventListener();
    loadSetting();
    loadedSetting.isCountdown ? setCountdown() : setClock();
    loadShortcut();
}

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

async function loadWallpaper() {
    let wallpaper = JSON.parse(localStorage.getItem('wallpaper')) || {};
    let { url, updatedAt } = wallpaper;
    if (loadedSetting.isRefreshWallpaper) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!url || !updatedAt || new Date(updatedAt) < today) {
            try {
                const response = await fetch(wallpaperAPI);
                const data = await response.json();

                elements.body.style.backgroundImage = `url(${data.url})`;

                let updateTime = new Date();
                localStorage.setItem('wallpaper', JSON.stringify({ url: data.url, updatedAt: updateTime }));
                elements.updateTime.innerText = updateTime.toLocaleString();
            } catch (error) {
                console.error(error);
                return;
            }
        } else {
            elements.body.style.backgroundImage = `url(${url})`;
        }
    } else if (url) {
        elements.body.style.backgroundImage = `url(${url})`;
    }
}

function loadSetting() {
    //load time update wallpaper
    const wallpaper = JSON.parse(localStorage.getItem('wallpaper')) || {};
    const { updatedAt } = wallpaper;
    if (updatedAt) {
        elements.updateTime.innerText = (new Date(wallpaper.updatedAt).toLocaleString());
    }
    //load timer
    const timer = localStorage.getItem('timer');
    elements.timePicker.value = timer;
    //load clock type
    loadedSetting.isCountdown = JSON.parse(localStorage.getItem('isCountdown')) || false;
    loadedSetting.isOpenLinkInNewTab = JSON.parse(localStorage.getItem('isOpenLinkInNewTab')) || true;
    loadedSetting.isRefreshWallpaper = JSON.parse(localStorage.getItem('isRefreshWallpaper')) || true;

    if (loadedSetting.isCountdown) {
        elements.timePicker.disabled = false;
        elements.setting.countdown.classList.add("selected");
        elements.setting.time.classList.remove("selected");

        targetDate = calculateTargetDate(timer);
    } else {
        elements.timePicker.disabled = true;
        elements.setting.countdown.classList.remove("selected");
        elements.setting.time.classList.add("selected");
    }

    elements.setting.openInNewTab.checked = loadedSetting.isOpenLinkInNewTab;
    elements.setting.refreshWallpaper.checked = loadedSetting.isRefreshWallpaper;

    selectedSetting.isCountdown = loadedSetting.isCountdown;
    selectedSetting.isOpenLinkInNewTab = loadedSetting.isOpenLinkInNewTab;
    selectedSetting.isRefreshWallpaper = loadedSetting.isRefreshWallpaper;
}

function calculateTargetDate(timer) {
    const targetDate = new Date()
    dev = JSON.parse(localStorage.getItem('dev'));
    if (dev == true) {
        targetDate.setHours(24, 0, 0, 0);
    } else if (timer) {
        let timeArray = timer.split(":");
        targetDate.setHours(timeArray[0], timeArray[1], 0, 0);
    } else {
        targetDate.setHours(17, 15, 0, 0);
    }
    return targetDate;
}

function loadShortcut() {
    let listShortCut = "";
    let localShortCut = JSON.parse(localStorage.getItem('shortcut')) || [];
    let shortCut = [...defaultShortcut, ...localShortCut];
    loadedSetting.isOpenLinkInNewTab = JSON.parse(localStorage.getItem('isOpenLinkInNewTab')) || true;

    shortCut.forEach(item => {
        listShortCut += `<div class="web-item"><a href="${item.url}"${loadedSetting.isOpenLinkInNewTab ? 'target="_blank"' : ''}>
                <div class="web-item-bg">
                    <img src="${item.icon}" />
                </div>
                <span>${item.name}</span>          
            </a>
            <div class="btn-edit" data-bs-toggle="modal" data-bs-target="#popup-edit" data-bs-name="${item.name}" data-bs-url="${item.url}">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 24 24">
                    <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
                </svg>
            </div></div>`;
    });

    listShortCut += `<div class="web-item" data-bs-toggle="modal" data-bs-target="#popup-add">
        <div class="web-item-bg">
            <img src="./assets/add.png" style="height: 24px;width: 24px;" />
        </div>
    </div>`;

    elements.webGrid.innerHTML = listShortCut;

    document.getElementById('btn-add').addEventListener('click', function () {
        const name = elements.shortcutName.value;
        const url = elements.shortcutUrl.value;
        if (name && url) {
            const newShortCut = {
                url: `https://${url}`,
                name: name,
                icon: `https://www.google.com/s2/favicons?domain=${url}&sz=48`
            };

            let localShortCut = JSON.parse(localStorage.getItem('shortcut')) || [];
            let listShortCut = [...defaultShortcut, ...localShortCut];

            if (!listShortCut.some(item => item.url == newShortCut.url)) {
                localShortCut.push(newShortCut);
                localStorage.setItem('shortcut', JSON.stringify(localShortCut));
                loadShortcut();
            } else {
                alert("This website already added!");
            }
            elements.shortcutName.value = "";
            elements.shortcutUrl.value = "";
        }
    });
}

function addEventListener() {
    //Popup setting
    const modalSetting = document.getElementById('popup-setting');
    modalSetting.addEventListener('show.bs.modal', loadSetting);
    //Add event select clock setting
    elements.setting.time.addEventListener('click', function () {
        selectedSetting.isCountdown = false;
        elements.timePicker.disabled = true;
        elements.setting.countdown.classList.remove("selected");
        elements.setting.time.classList.add("selected");
    });
    //Add event select countdown setting
    elements.setting.countdown.addEventListener('click', function () {
        selectedSetting.isCountdown = true;
        elements.timePicker.disabled = false;
        elements.setting.countdown.classList.add("selected");
        elements.setting.time.classList.remove("selected");
    });
    //Add event get new wallpaper
    document.getElementById('btn-new-wallpaper').addEventListener('click', function () {
        localStorage.removeItem('wallpaper');
        loadWallpaper();
    });
    //Add event select refresh wallpaper setting
    elements.setting.refreshWallpaper.addEventListener('change', function () {
        selectedSetting.isRefreshWallpaper = elements.setting.refreshWallpaper.checked;
    });
    //Add event select open link in new tab setting
    elements.setting.openInNewTab.addEventListener('change', function () {
        selectedSetting.isOpenLinkInNewTab = elements.setting.openInNewTab.checked;
    });
    //Add event save setting
    document.getElementById('btn-save').addEventListener('click', function () {
        if (selectedSetting.isRefreshWallpaper != loadedSetting.isRefreshWallpaper) {
            localStorage.setItem('isRefreshWallpaper', selectedSetting.isRefreshWallpaper);
            if (selectedSetting.isRefreshWallpaper) {
                localStorage.removeItem('wallpaper');
                loadWallpaper();
            }
        }

        if (selectedSetting.isOpenLinkInNewTab != loadedSetting.isOpenLinkInNewTab) {
            localStorage.setItem('isOpenLinkInNewTab', selectedSetting.isOpenLinkInNewTab);
            loadShortcut();
        }

        if (selectedSetting.isCountdown != loadedSetting.isCountdown) {
            if (selectedSetting.isCountdown) {
                const timer = elements.timePicker.value;
                if (!timer) {
                    alert("You must set time for timer!");
                    return;
                }

                localStorage.setItem('timer', timer);
                localStorage.setItem('isCountdown', true);
                cancelAnimationFrame(coundown);
                loadSetting();
                setCountdown();
            } else {
                localStorage.setItem('isCountdown', false);
                cancelAnimationFrame(coundown);
                loadSetting();
                setClock();
            }
        }
    });
    //Load edit shortcut
    const popupEdit = document.getElementById('popup-edit');
    if (popupEdit) {
        popupEdit.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const name = button.getAttribute('data-bs-name');
            const url = button.getAttribute('data-bs-url');
            popupEdit.querySelector('#edit-shortcut-name').value = name;
            popupEdit.querySelector('#edit-shortcut-url').value = url.replace('https://', '');
            popupEdit.querySelector('#edit-shortcut-oldurl').value = url;

            let index = defaultShortcut.findIndex(item => item.url.includes(url));
            if (index == -1) {
                document.getElementById('btn-edit').classList.add('d-flex');
                document.getElementById('btn-edit').classList.remove('d-none');
                document.getElementById('btn-remove').classList.add('d-flex');
                document.getElementById('btn-remove').classList.remove('d-none');
                popupEdit.querySelector('#edit-shortcut-name').disabled = false;
                popupEdit.querySelector('#edit-shortcut-url').disabled = false;
            } else {
                document.getElementById('btn-edit').classList.remove('d-flex');
                document.getElementById('btn-edit').classList.add('d-none');
                document.getElementById('btn-remove').classList.remove('d-flex');
                document.getElementById('btn-remove').classList.add('d-none');
                popupEdit.querySelector('#edit-shortcut-name').disabled = true;
                popupEdit.querySelector('#edit-shortcut-url').disabled = true;
            }
        });
    }

    document.getElementById("btn-edit").addEventListener('click', function () {
        const oldUrl = document.getElementById('edit-shortcut-oldurl').value;
        const url = document.getElementById('edit-shortcut-url').value;
        const name = document.getElementById('edit-shortcut-name').value;
        if (oldUrl && url && name) {
            let isEditDefaultShortcut = defaultShortcut.some(item => item.url === oldUrl);
            if (isEditDefaultShortcut) return;

            let localShortCut = JSON.parse(localStorage.getItem('shortcut')) || [];
            let index = localShortCut.findIndex(item => item.url === oldUrl);
            if (index != -1) {
                localShortCut[index].name = name;
                localShortCut[index].url = `https://${url}`;
                localShortCut[index].icon = `https://www.google.com/s2/favicons?domain=${url}&sz=48`;

                localStorage.setItem('shortcut', JSON.stringify(localShortCut));
                document.getElementById('edit-shortcut-oldurl').value = "";
                document.getElementById('edit-shortcut-url').value = "";
                document.getElementById('edit-shortcut-name').value = "";
                loadShortcut();
            }
        }
    });

    document.getElementById("btn-remove").addEventListener('click', function () {
        const oldUrl = document.getElementById('edit-shortcut-oldurl').value;
        if (oldUrl) {
            let isEditDefaultShortcut = defaultShortcut.some(item => item.url === oldUrl);
            if (isEditDefaultShortcut) return;

            let localShortCut = JSON.parse(localStorage.getItem('shortcut')) || [];
            localShortCut = localShortCut.filter(item => item.url !== oldUrl);
            localStorage.setItem('shortcut', JSON.stringify(localShortCut));

            document.getElementById('edit-shortcut-oldurl').value = "";
            document.getElementById('edit-shortcut-url').value = "";
            document.getElementById('edit-shortcut-name').value = "";
            loadShortcut();
        }
    });
}

function loadDate() {
    const date = new Date();
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    const year = date.getFullYear();

    document.getElementById("month").innerHTML = `${day} ${date.toLocaleString("default", { month: "long" })}`;
    document.getElementById("year").innerHTML = year;
}

function flipContainers(className, value) {
    const elements = document.getElementsByClassName(className);
    let oldValue = value;
    for (let index = 0; index < elements.length; index++) {
        oldValue = elements[index].innerText;
        elements[index].innerText =
            value < 10 ? "0" + value.toString() : value.toString();
    }
    if (oldValue != value) {
        document.getElementById(className + "Flip").classList.toggle("flipped");
    }
}

function setCountdown() {
    document.getElementById("notify").classList.add('hide');
    document.getElementById("countdown").classList.remove('hide');
    function updateFlip() {
        const now = new Date();
        const timeRemaining = targetDate - now;
        const hours = Math.floor(
            (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        flipContainers("hours", hours);
        flipContainers("minutes", minutes);
        flipContainers("seconds", seconds);

        if (timeRemaining > 0) {
            coundown = requestAnimationFrame(updateFlip);
        } else {
            notifyMe();
        }
    }
    coundown = requestAnimationFrame(updateFlip);
}

function setClock() {
    document.getElementById("notify").classList.add('hide');
    document.getElementById("countdown").classList.remove('hide');
    function updateFlip() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        flipContainers("hours", hours);
        flipContainers("minutes", minutes);
        flipContainers("seconds", seconds);
        coundown = requestAnimationFrame(updateFlip);
    }
    coundown = requestAnimationFrame(updateFlip);
}