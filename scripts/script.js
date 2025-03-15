const wallpaperAPI = "https://bing.biturl.top/?resolution=1920&format=json&mkt=en-US";
let dev, countdown, targetDate;

function copyObj(original) {
    return JSON.parse(JSON.stringify(original));
}

let loadedSettings = {
    isCountdown: JSON.parse(localStorage.getItem('isCountdown')) ?? null,
    isOpenLinkInNewTab: JSON.parse(localStorage.getItem('isOpenLinkInNewTab')) ?? null,
    isRefreshWallpaper: JSON.parse(localStorage.getItem('isRefreshWallpaper')) ?? null,
    listWallpaper: JSON.parse(localStorage.getItem('listWallpaper')) ?? null,
    isOpenSearchInNewTab: JSON.parse(localStorage.getItem('isOpenSearchInNewTab')) ?? null,
    currentWallpaper: JSON.parse(localStorage.getItem('currentWallpaper')) ?? null,
};

let selectedSetting = copyObj(loadedSettings);

const elements = {
    body: document.getElementById("body"),
    updateTime: document.getElementById("update-time"),
    timePicker: document.getElementById("setting_time-picker"),
    setting: {
        countdown: document.getElementById("setting:clock_type-countdown"),
        time: document.getElementById("setting:clock_type-time"),
        refreshWallpaper: document.getElementById("setting:refresh-wallpaper"),
        openInNewTab: document.getElementById("setting:open-in-newtab"),
        openSearchInNewTab: document.getElementById("setting:open-search-in-newtab"),
    },
    webGrid: document.getElementById("web-grid"),
    shortcutName: document.getElementById("shortcut-name"),
    shortcutUrl: document.getElementById("shortcut-url"),
};

// const defaultShortcut = [
//     { icon: "./assets/tulavideo.png", name: "TulaVideo", url: "https://tulavideo.web.app" },
//     { icon: "./assets/tulamusic.png", name: "TulaMusic", url: "https://tulamusic.web.app" },
//     { icon: "./assets/tik-tok.png", name: "TopTop", url: "https://tulavideo.web.app/toptop" }
// ];
const defaultShortcut = [];

var topSites = [
    { icon: "", name: "Google", url: "https://google.com" },
    { icon: "", name: "Youtube", url: "https://youtube.com" },
    { icon: "", name: "Facebook", url: "https://facebook.com" },
    { icon: "", name: "Instagram", url: "https://instagram.com" }

];

function initialize() {
    initialSettings();
    loadWallpaper();
    loadDate();
    addEventListeners();
    loadSettings();
    applyClockSetting();
    loadSearchSetting();
    loadShortcuts();
    fetchListWallpaper();
}

function initialSettings() {
    if (loadedSettings.isCountdown == null) {
        localStorage.setItem('isCountdown', false);
        loadedSettings.isCountdown = false;
    }
    if (loadedSettings.isOpenLinkInNewTab == null) {
        localStorage.setItem('isOpenLinkInNewTab', false);
        loadedSettings.isOpenLinkInNewTab = false;
    }
    if (loadedSettings.isRefreshWallpaper == null) {
        localStorage.setItem('isRefreshWallpaper', true);
        loadedSettings.isRefreshWallpaper = true;
    }
    if (loadedSettings.listWallpaper == null) {
        localStorage.setItem('listWallpaper', []);
        loadedSettings.listWallpaper = [];
    }
    if (loadedSettings.isOpenSearchInNewTab == null) {
        localStorage.setItem('isOpenSearchInNewTab', false);
        loadedSettings.isOpenSearchInNewTab = false;
    }
    if (loadedSettings.currentWallpaper == null) {
        let currentWallpaper =  {
            url:"",
            updatedAt: null
        };
        localStorage.setItem('currentWallpaper', JSON.stringify(currentWallpaper));
        loadedSettings.currentWallpaper = currentWallpaper;
    }
    selectedSetting = copyObj(loadedSettings);
}

function addEventListeners() {
    //Popup setting
    const modalSetting = document.getElementById('popup-setting');
    modalSetting.addEventListener('show.bs.modal', loadSettings);

    elements.setting.time.addEventListener('click', setClockMode);
    elements.setting.countdown.addEventListener('click', setCountdownMode);
    document.getElementById('btn-new-wallpaper').addEventListener('click', refreshWallpaper);
    elements.setting.refreshWallpaper.addEventListener('change', updateRefreshWallpaperSetting);
    elements.setting.openInNewTab.addEventListener('change', updateOpenLinkInNewTabSetting);
    elements.setting.openSearchInNewTab.addEventListener('change', updateOpenSearchInNewTabSetting);
    document.getElementById('btn-save').addEventListener('click', saveSettings);
    document.getElementById('btn-cancel-setting').addEventListener('click', cancelSetting);

    const popupAdd = document.getElementById('popup-add');
    if (popupAdd) {
        popupAdd.addEventListener('show.bs.modal', loadTopSite);
    }

    const popupEdit = document.getElementById('popup-edit');
    if (popupEdit) {
        popupEdit.addEventListener('show.bs.modal', loadEditShortcut);
    }

    document.getElementById("btn-edit").addEventListener('click', editShortcut);
    document.getElementById("btn-remove").addEventListener('click', removeShortcut);

    document.getElementById('btn-add').addEventListener('click', addShortCut);

    document.getElementById("ns-custom-site-tab").addEventListener('click', function () {
        elements.shortcutName.value = "";
        elements.shortcutUrl.value = "";
    });

    document.getElementById("ns-top-sites-tab").addEventListener('click', loadTopSite);

}

function setClockMode() {
    selectedSetting.isCountdown = false;
    elements.timePicker.disabled = true;
    elements.setting.countdown.classList.remove("selected");
    elements.setting.time.classList.add("selected");
}

function setCountdownMode() {
    selectedSetting.isCountdown = true;
    elements.timePicker.disabled = false;
    elements.setting.countdown.classList.add("selected");
    elements.setting.time.classList.remove("selected");
}

function loadSettings() {
    const wallpaper = JSON.parse(localStorage.getItem('currentWallpaper')) || {};
    elements.updateTime.innerText = wallpaper.updatedAt ? new Date(wallpaper.updatedAt).toLocaleString() : '';

    const timer = localStorage.getItem('timer');
    elements.timePicker.value = timer;

    if (loadedSettings.isCountdown) {
        elements.timePicker.disabled = false;
        elements.setting.countdown.classList.add("selected");
        elements.setting.time.classList.remove("selected");
        targetDate = calculateTargetDate(timer);
    } else {
        elements.timePicker.disabled = true;
        elements.setting.countdown.classList.remove("selected");
        elements.setting.time.classList.add("selected");
    }

    elements.setting.openInNewTab.checked = loadedSettings.isOpenLinkInNewTab;
    elements.setting.openSearchInNewTab.checked = loadedSettings.isOpenSearchInNewTab;
    elements.setting.refreshWallpaper.checked = loadedSettings.isRefreshWallpaper;
}

function calculateTargetDate(timer) {
    const targetDate = new Date();
    dev = JSON.parse(localStorage.getItem('dev'));
    if (dev) {
        targetDate.setHours(24, 0, 0, 0);
    } else if (timer) {
        const [hours, minutes] = timer.split(":").map(Number);
        targetDate.setHours(hours, minutes, 0, 0);
    } else {
        targetDate.setHours(17, 15, 0, 0);
    }
    return targetDate;
}

async function loadWallpaper() {
    const wallpaper = JSON.parse(localStorage.getItem('currentWallpaper')) || {};
    const { url, updatedAt } = wallpaper;

    if (loadedSettings.isRefreshWallpaper) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!url || !updatedAt || new Date(updatedAt) < today) {
            fetch(wallpaperAPI)
                .then(response => response.json())
                .then(data => {
                    setWallpaper(data.url);
                })
                .catch(error => console.error(error));
        } else {
            elements.body.style.backgroundImage = `url(${url})`;
        }
    } else if (url) {
        elements.body.style.backgroundImage = `url(${url})`;
    }
}

function setWallpaper(url) {
    elements.body.style.backgroundImage = `url(${url})`;
    const updateTime = new Date();
    loadedSettings.currentWallpaper = { url, updatedAt: updateTime };
    localStorage.setItem('currentWallpaper', JSON.stringify({ url, updatedAt: updateTime }));
    elements.updateTime.innerText = updateTime.toLocaleString();
}

function cancelSetting() {
    if (selectedSetting.currentWallpaper.url !== loadedSettings.currentWallpaper.url) {
        setWallpaper(loadedSettings.currentWallpaper.url);
    }
    selectedSetting = copyObj(loadedSettings);
}

async function fetchListWallpaper() {
    if (loadedSettings.listWallpaper.length === 0) {
        for (let index = 0; index < 6; index++) {
            await fetch(`${wallpaperAPI}&index=${index}`)
                .then(response => response.json())
                .then(data => {
                    let index = loadedSettings.listWallpaper.findIndex(item => item.url === data.url);
                    if (index === -1) {
                        const updateTime = new Date();
                        loadedSettings.listWallpaper.unshift({ url: data.url, updatedAt: updateTime });
                        localStorage.setItem('listWallpaper', JSON.stringify(loadedSettings.listWallpaper));
                    }
                })
                .catch(error => console.error(error));
        }
    }

    let elements = "";
    loadedSettings.listWallpaper.forEach(el => {
        elements = elements + `<div class="col p-0 wallpaper-item">
            <img class="img-fluid" src="${el.url}" onClick="testWallpaper('${el.url}')"/>
        </div>`;
    });
    document.getElementById("list-wallpaper").innerHTML = elements;
}

function testWallpaper(url) {
    elements.body.style.backgroundImage = `url(${url})`;
    selectedSetting.currentWallpaper.url = url;
}

function refreshWallpaper() {
    document.getElementById("refresh-icon").classList.toggle("rotate");

    loadedSettings.listWallpaper = [];
    localStorage.setItem('listWallpaper', JSON.stringify(loadedSettings.listWallpaper));
    fetchListWallpaper();
    localStorage.removeItem('currentWallpaper');
    loadWallpaper();
}

function updateRefreshWallpaperSetting() {
    selectedSetting.isRefreshWallpaper = elements.setting.refreshWallpaper.checked;
}

function updateOpenLinkInNewTabSetting() {
    selectedSetting.isOpenLinkInNewTab = elements.setting.openInNewTab.checked;
}

function updateOpenSearchInNewTabSetting() {
    selectedSetting.isOpenSearchInNewTab = elements.setting.openSearchInNewTab.checked;
}

function saveSettings() {
    if (selectedSetting.isRefreshWallpaper !== loadedSettings.isRefreshWallpaper) {
        loadedSettings.isRefreshWallpaper = selectedSetting.isRefreshWallpaper;

        localStorage.setItem('isRefreshWallpaper', selectedSetting.isRefreshWallpaper);
        if (selectedSetting.isRefreshWallpaper) {
            localStorage.removeItem('currentWallpaper');
            loadWallpaper();
        }
    }

    if (selectedSetting.isOpenLinkInNewTab !== loadedSettings.isOpenLinkInNewTab) {
        loadedSettings.isOpenLinkInNewTab = selectedSetting.isOpenLinkInNewTab;
        localStorage.setItem('isOpenLinkInNewTab', selectedSetting.isOpenLinkInNewTab);
        loadShortcuts();
    }

    if (selectedSetting.isOpenSearchInNewTab !== loadedSettings.isOpenSearchInNewTab) {
        loadedSettings.isOpenSearchInNewTab = selectedSetting.isOpenSearchInNewTab;
        localStorage.setItem('isOpenSearchInNewTab', selectedSetting.isOpenSearchInNewTab);
        loadSearchSetting();
    }

    if (selectedSetting.currentWallpaper.url != loadedSettings.currentWallpaper.url) {
        loadedSettings.currentWallpaper.url = selectedSetting.currentWallpaper.url;
        loadedSettings.currentWallpaper.updatedAt = new Date();
        setWallpaper(selectedSetting.currentWallpaper.url);
    }

    if (selectedSetting.isCountdown !== loadedSettings.isCountdown) {
        loadedSettings.isCountdown = selectedSetting.isCountdown;
        if (selectedSetting.isCountdown) {
            const timer = elements.timePicker.value;
            if (!timer) {
                alert("You must set time for the timer!");
                return;
            }
            localStorage.setItem('timer', timer);
            localStorage.setItem('isCountdown', true);
            cancelAnimationFrame(countdown);
            loadSettings();
            setCountdown();
        } else {
            localStorage.setItem('isCountdown', false);
            cancelAnimationFrame(countdown);
            loadSettings();
            setClock();
        }
    }
}

function applyClockSetting() {
    if (loadedSettings.isCountdown) {
        setCountdown();
    } else {
        setClock();
    }
}

function loadSearchSetting() {
    if (loadedSettings.isOpenSearchInNewTab) {
        document.getElementById('search-form').setAttribute('target', "_blank");
    } else {
        document.getElementById('search-form').setAttribute('target', "_self");
    }
}

function loadDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    document.getElementById("month").innerHTML = `${day} ${date.toLocaleString("default", { month: "long" })}`;
    document.getElementById("year").innerHTML = year;
}

function loadShortcuts() {
    const localShortcuts = JSON.parse(localStorage.getItem('shortcut')) ?? [];
    const shortcuts = [...defaultShortcut, ...localShortcuts];
    let listShortcuts = "";

    shortcuts.forEach(item => {
        listShortcuts += `<div class="web-item"><a href="${item.url}"${loadedSettings.isOpenLinkInNewTab ? ' target="_blank"' : ''}>
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

    listShortcuts += `<div class="web-item" data-bs-toggle="modal" data-bs-target="#popup-add">
        <div class="web-item-bg">
            <img src="./assets/add.png" style="height: 24px; width: 24px;" />
        </div>
    </div>`;

    elements.webGrid.innerHTML = listShortcuts;


}

function loadTopSite() {
    let localShortcuts = JSON.parse(localStorage.getItem('shortcut')) ?? [];
    let filteredTopSites = topSites.filter(site => !localShortcuts.some(i => i.url === site.url));

    filteredTopSites.forEach(site => {
        site.icon = `https://www.google.com/s2/favicons?domain=${site.url}&sz=48`;
    })

    let listTopSite = "";
    filteredTopSites.forEach(item => {
        listTopSite += `<div class="web-item${elements.shortcutUrl.value == item.url ? ' active' : ''}" onClick="addTopSite('${item.name}','${item.url}')">
                <div class="web-item-bg">
                    <img src="${item.icon}" />
                </div>
                <span>${item.name}</span>
            </div>`;
    });

    document.getElementById('top-sites-list').innerHTML = listTopSite;
}


function loadEditShortcut(event) {
    const button = event.relatedTarget;
    const name = button.getAttribute('data-bs-name');
    const url = button.getAttribute('data-bs-url');
    const popupEdit = document.getElementById('popup-edit');

    popupEdit.querySelector('#edit-shortcut-name').value = name;
    popupEdit.querySelector('#edit-shortcut-url').value = url.replace('https://', '');
    popupEdit.querySelector('#edit-shortcut-oldurl').value = url;

    const isDefaultShortcut = defaultShortcut.some(item => item.url === url);
    toggleEditButtons(!isDefaultShortcut);
}

function toggleEditButtons(show) {
    document.getElementById('btn-edit').classList.toggle('d-flex', show);
    document.getElementById('btn-edit').classList.toggle('d-none', !show);
    document.getElementById('btn-remove').classList.toggle('d-flex', show);
    document.getElementById('btn-remove').classList.toggle('d-none', !show);
}

function addShortCut() {
    const name = elements.shortcutName.value;
    const url = elements.shortcutUrl.value.replace(/^https?:\/\//, '');
    if (name && url) {
        const newShortcut = {
            url: `https://${url}`,
            name,
            icon: `https://www.google.com/s2/favicons?domain=${url}&sz=48`
        };

        let localShortcuts = JSON.parse(localStorage.getItem('shortcut')) ?? [];
        if (!localShortcuts.some(item => item.url === newShortcut.url)) {
            localShortcuts.push(newShortcut);
            localStorage.setItem('shortcut', JSON.stringify(localShortcuts));
            loadShortcuts();
        } else {
            alert("This website is already added!");
        }

        elements.shortcutName.value = "";
        elements.shortcutUrl.value = "";
    }
}

function addTopSite(name, url) {
    elements.shortcutName.value = name;
    elements.shortcutUrl.value = url;
    loadTopSite();
}

function editShortcut() {
    const oldUrl = document.getElementById('edit-shortcut-oldurl').value;
    const url = document.getElementById('edit-shortcut-url').value;
    const name = document.getElementById('edit-shortcut-name').value;

    if (oldUrl && url && name) {
        let localShortcuts = JSON.parse(localStorage.getItem('shortcut')) || [];
        const index = localShortcuts.findIndex(item => item.url === oldUrl);

        if (index !== -1) {
            localShortcuts[index] = {
                name,
                url: `https://${url}`,
                icon: `https://www.google.com/s2/favicons?domain=${url}&sz=48`
            };

            localStorage.setItem('shortcut', JSON.stringify(localShortcuts));
            loadShortcuts();
        }
    }
}

function removeShortcut() {
    const oldUrl = document.getElementById('edit-shortcut-oldurl').value;
    let localShortcuts = JSON.parse(localStorage.getItem('shortcut')) || [];
    localShortcuts = localShortcuts.filter(item => item.url !== oldUrl);

    localStorage.setItem('shortcut', JSON.stringify(localShortcuts));
    loadShortcuts();
}

function notifyMe() {
    document.getElementById("notify").classList.remove('hide');
    document.getElementById("countdown").classList.add('hide');

    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification("Go home!");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Go home!");
                }
            });
        }
    } else {
        alert("This browser does not support desktop notification");
    }
}

function flipContainers(className, value) {
    const elements = document.getElementsByClassName(className);
    for (let element of elements) {
        const oldValue = element.innerText;
        element.innerText = value < 10 ? "0" + value : value.toString();
        if (oldValue != value) {
            document.getElementById(className + "Flip").classList.toggle("flipped");
        }
    }
}

function updateFlip(callback) {
    const now = new Date();
    const timeRemaining = targetDate - now;
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    flipContainers("hours", hours);
    flipContainers("minutes", minutes);
    flipContainers("seconds", seconds);

    if (timeRemaining > 0) {
        countdown = requestAnimationFrame(callback);
    } else {
        notifyMe();
    }
}

function setCountdown() {
    document.getElementById("notify").classList.add('hide');
    document.getElementById("countdown").classList.remove('hide');
    countdown = requestAnimationFrame(() => updateFlip(setCountdown));
}

function setClock() {
    function updateClock() {
        const now = new Date();
        flipContainers("hours", now.getHours());
        flipContainers("minutes", now.getMinutes());
        flipContainers("seconds", now.getSeconds());

        countdown = requestAnimationFrame(updateClock);
    }

    document.getElementById("notify").classList.add('hide');
    document.getElementById("countdown").classList.remove('hide');
    countdown = requestAnimationFrame(updateClock);
}

initialize();
