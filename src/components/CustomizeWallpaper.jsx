import { useEffect, useState } from "react";
import CustomizeCheckbox from "./ui/CustomizeCheckbox";
import CustomizeModal from "./ui/CustomizeModal";
import moment from "moment";
import {
  LIST_WALLPAPER,
  LIST_WALLPAPER_UPDATED_AT,
  IS_REFRESH_WALLPAPER,
  CURRENT_WALLPAPER,
} from "../config/StorageKey";
import { wallpaperService } from "../utils/WallpaperService";

export default function CustomizeWalpaper({ setWallpaper }) {
  const [isRefreshWallpaper, setIsRefreshWallpaper] = useState(
    JSON.parse(localStorage.getItem(IS_REFRESH_WALLPAPER))
  );
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [listWallpaper, setListWallpaper] = useState([]);
  const [currentWallpaper, setCurrentWallpaper] = useState(
    JSON.parse(localStorage.getItem(CURRENT_WALLPAPER))?.url || ""
  );

  const handleFetchListWallpaper = () => {
    wallpaperService.fetchListWallpaper().then((result) => {
      setListWallpaper(result);
    });

    const currentTime = new Date();
    setLastUpdated(currentTime);
    localStorage.setItem(
      LIST_WALLPAPER_UPDATED_AT,
      JSON.stringify(currentTime)
    );
  };

  useEffect(() => {
    let listWallpaper = JSON.parse(localStorage.getItem(LIST_WALLPAPER)) || [];
    if (listWallpaper.length > 0) {
      setListWallpaper(listWallpaper);
    } else {
      handleFetchListWallpaper();
    }

    var currentWallpaper = localStorage.getItem(LIST_WALLPAPER_UPDATED_AT);
    if (currentWallpaper) {
      var updatedAt = JSON.parse(currentWallpaper);
      setLastUpdated(updatedAt);
    }
  }, []);

  return (
    <CustomizeModal>
      <CustomizeCheckbox
        text="Daily refresh wallpaper"
        isChecked={isRefreshWallpaper}
        onChange={() => {
          let value = !isRefreshWallpaper;
          setIsRefreshWallpaper(value);
          localStorage.setItem(IS_REFRESH_WALLPAPER, JSON.stringify(value));
        }}
      />
      <div
        className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
        onClick={() => {
          setIsFetching(true);
          handleFetchListWallpaper();
          setIsFetching(false);
        }}
      >
        <span>
          {isFetching ? "Fetching new wallpaper..." : "Fetch new wallpaper"}
        </span>
        <span className="text-xs text-gray-400">
          Last updated {moment(lastUpdated).fromNow()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {listWallpaper?.map((wallpaper, index) => (
          <div
            key={index}
            className={`${
              currentWallpaper === wallpaper ? "ring-2 ring-white" : ""
            } rounded-xl cursor-pointer`}
            onClick={() => {
              setCurrentWallpaper(wallpaper);
              setWallpaper(wallpaper);
            }}
          >
            <img
              className="w-full h-full object-cover rounded-xl"
              src={wallpaper}
              alt="wallpaper"
            />
          </div>
        ))}
      </div>
    </CustomizeModal>
  );
}
