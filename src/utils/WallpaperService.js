import { WALLPAPER_API } from "../config/constants";
import {
  CURRENT_WALLPAPER,
  IS_REFRESH_WALLPAPER,
  LIST_WALLPAPER,
} from "../config/StorageKey";

export const wallpaperService = {
  async fetchDailyWallpaper() {
    const cachedWallpaper = localStorage.getItem(CURRENT_WALLPAPER);
    const wallpaper = JSON.parse(cachedWallpaper) || null;
    const isRefreshWallpaper =
      JSON.parse(localStorage.getItem(IS_REFRESH_WALLPAPER)) || true;
    const today = new Date().toDateString();
    // Check cache first
    if (
      (!isRefreshWallpaper && wallpaper) ||
      (wallpaper && wallpaper.updatedAt === today)
    ) {
      return wallpaper.url;
    }

    try {
      const response = await fetch(WALLPAPER_API);
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        localStorage.setItem(
          CURRENT_WALLPAPER,
          JSON.stringify({ url: imageUrl, updatedAt: today })
        );
        return imageUrl;
      } else {
        throw new Error(`API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch wallpaper:", error);
      return null; // Return null to trigger fallback
    }
  },
  async fetchListWallpaper() {
    let listWallpaper = [];
    for (let index = 0; index < 6; index++) {
      try {
        // Replace with your API endpoint
        const response = await fetch(`${WALLPAPER_API}&index=${index}`);
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.url;
          listWallpaper.push(imageUrl);
        } else {
          throw new Error(`API responded with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to fetch wallpaper:", error);
        return null; // Return null to trigger fallback
      }
    }

    if (listWallpaper.length > 0) {
      localStorage.setItem(LIST_WALLPAPER, JSON.stringify(listWallpaper));
    }

    return listWallpaper;
  },
};
