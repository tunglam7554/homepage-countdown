import CustomizeModal from "./ui/CustomizeModal";
import CustomizeCheckbox from "./ui/CustomizeCheckbox";
import {
  IS_OPEN_LINK_IN_NEW_TAB,
  IS_OPEN_SEARCH_IN_NEW_TAB,
  SEARCH_ENGINE,
  IS_SHOW_WEATHER,
  IS_CELSIUS,
  LOCATION,
  SYNC_KEY,
} from "../config/StorageKey";
import {
  saveSettingsToFirebase,
  loadSettingsFromFirebase,
} from "../services/firebaseServices";
import { SaveListShortcut } from "../utils/ShortcutHelper";
import { useState } from "react";
import { s } from "framer-motion/client";
export default function CustomizeOption() {
  const [isOpenLinkInNewTab, setIsOpenLinkInNewTab] = useState(
    JSON.parse(localStorage.getItem(IS_OPEN_LINK_IN_NEW_TAB) || true),
  );
  const [isOpenSearchInNewTab, setIsOpenSearchInNewTab] = useState(
    JSON.parse(localStorage.getItem(IS_OPEN_SEARCH_IN_NEW_TAB)),
  );
  const [isShowWeather, setIsShowWeather] = useState(
    JSON.parse(localStorage.getItem(IS_SHOW_WEATHER)),
  );
  const [isCelsius, setIsCelsius] = useState(
    JSON.parse(localStorage.getItem(IS_CELSIUS) || true),
  );

  const [location, setLocation] = useState(
    localStorage.getItem(LOCATION) || "London",
  );

  const [searchEngine, setSearchEngine] = useState(
    localStorage.getItem(SEARCH_ENGINE) || "Google",
  );

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncKey, setSyncKey] = useState(localStorage.getItem(SYNC_KEY) || "");
  const [syncAction, setSyncAction] = useState(""); // "upload" or "download"

  const ChangeOpenLinkInNewTabHandler = () => {
    let value = !isOpenLinkInNewTab;
    setIsOpenLinkInNewTab(value);
    localStorage.setItem(IS_OPEN_LINK_IN_NEW_TAB, JSON.stringify(value));
  };

  const ChangeOpenSearchInNewTabHandler = () => {
    let value = !isOpenSearchInNewTab;
    setIsOpenSearchInNewTab(value);
    localStorage.setItem(IS_OPEN_SEARCH_IN_NEW_TAB, JSON.stringify(value));
  };

  const ChangeShowWeatherHandler = () => {
    let value = !isShowWeather;
    setIsShowWeather(value);
    localStorage.setItem(IS_SHOW_WEATHER, JSON.stringify(value));
  };

  const ChangeCelsiusHandler = () => {
    let value = !isCelsius;
    setIsCelsius(value);
    localStorage.setItem(IS_CELSIUS, JSON.stringify(value));
  };

  const ChangeLocation = () => {
    let value = prompt("Location", location);
    if (value == null || value == "") {
      value = "London";
    }
    setLocation(value);
    localStorage.setItem(LOCATION, value);
  };

  const ChangeSearchEngine = (value) => {
    const validSearchEngines = ["Google", "Bing", "DuckDuckGo"];
    if (!validSearchEngines.includes(value)) {
      value = "Google";
    }
    setSearchEngine(value);
    localStorage.setItem(SEARCH_ENGINE, value);
  };

  const ChangeSyncSettings = () => {
    setShowSyncModal(true);
  };

  const handleUpload = async () => {
    let syncKey = localStorage.getItem(SYNC_KEY);
    if (!syncKey) {
      syncKey =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem(SYNC_KEY, syncKey);
    }
    const settings = {
      shortcuts: JSON.parse(localStorage.getItem("shortcut") || "[]"),
    };
    await saveSettingsToFirebase(syncKey, settings);
    setSyncKey(syncKey);
    setSyncAction("uploaded");
  };

  const handleDownload = async () => {
    if (syncKey) {
      const settings = await loadSettingsFromFirebase(syncKey);
      if (settings) {
        // Apply settings
        if (settings.shortcuts) {
          SaveListShortcut(settings.shortcuts);
        }
        localStorage.setItem(SYNC_KEY, syncKey);
        setSyncAction("downloaded");
      } else {
        setSyncAction("invalid");
      }
    }
  };

  const handleCloseSyncModal = () => {
    if (syncAction === "downloaded") {
      setShowSyncModal(false);
      setSyncAction("");
      window.location.reload();
    } else {
      setShowSyncModal(false);
      setSyncAction("");
    }
  };

  return (
    <>
      <CustomizeModal>
        <p className="mb-2 font-light text-sm">Open in new tab</p>
        <CustomizeCheckbox
          text="Open shortcut in new tab"
          isChecked={isOpenLinkInNewTab}
          onChange={ChangeOpenLinkInNewTabHandler}
        />
        <CustomizeCheckbox
          text="Open search in new tab"
          isChecked={isOpenSearchInNewTab}
          onChange={ChangeOpenSearchInNewTabHandler}
        />
        <p className="mb-2 font-light text-sm">Search engine</p>
        <CustomizeCheckbox
          text="Google"
          isChecked={searchEngine == "Google"}
          onChange={() => ChangeSearchEngine("Google")}
        />
        <CustomizeCheckbox
          text="Bing"
          isChecked={searchEngine == "Bing"}
          onChange={() => ChangeSearchEngine("Bing")}
        />
        <CustomizeCheckbox
          text="Duck Duck Go"
          isChecked={searchEngine == "DuckDuckGo"}
          onChange={() => ChangeSearchEngine("DuckDuckGo")}
        />
        <p className="mb-2 font-light text-sm">Weather</p>
        <CustomizeCheckbox
          text="Show weather"
          isChecked={isShowWeather}
          onChange={ChangeShowWeatherHandler}
        />
        <CustomizeCheckbox
          text="Celsius"
          isChecked={isCelsius}
          onChange={ChangeCelsiusHandler}
        />
        <CustomizeCheckbox
          text="Fahrenheit"
          isChecked={!isCelsius}
          onChange={ChangeCelsiusHandler}
        />
        <div
          className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
          onClick={ChangeLocation}
        >
          <span>Location</span>
          <span className="text-gray-400 text-shadow">{location}</span>
        </div>
        <p className="mb-2 font-light text-sm">Sync</p>
        <div
          className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
          onClick={ChangeSyncSettings}
        >
          <span>Sync shortcuts...</span>
        </div>
      </CustomizeModal>
      {showSyncModal && (
        <CustomizeModal>
          <p className="mb-2 font-light text-sm">Sync Shortcuts</p>
          <div
            className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
            onClick={handleUpload}
          >
            <span>Upload Shortcuts</span>
          </div>

          <div
            className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
            onClick={handleDownload}
          >
            <span>Download Shortcuts</span>
          </div>

          <div className="mb-4">
            <p className="mb-2 font-light text-sm">Sync Key</p>
            <input
              type="text"
              placeholder="Enter sync key"
              value={syncKey}
              onChange={(e) => setSyncKey(e.target.value)}
              className="w-full rounded-2xl px-4 py-2 text-gray-400 text-shadow hover:outline-none hover:bg-white hover:text-black"
            />
          </div>
          {syncAction === "uploaded" && (
            <p className="mb-2 font-light text-sm">
              Shortcuts uploaded! Copy the key above.
            </p>
          )}
          {syncAction === "downloaded" && (
            <p className="mb-2 font-light text-sm">
              Shortcuts downloaded! Refresh the page.
            </p>
          )}
          {syncAction === "invalid" && (
            <p className="mb-2 font-light text-sm">Invalid sync key.</p>
          )}
          <div
            className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
            onClick={handleCloseSyncModal}
          >
            <span>Done</span>
          </div>
        </CustomizeModal>
      )}
    </>
  );
}
