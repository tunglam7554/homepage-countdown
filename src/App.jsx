import { useState, useEffect } from "react";
import OdometerClock from "./components/OdometerClock";
import { wallpaperService } from "./utils/WallpaperService";
import SearchBar from "./components/SearchBar";
import WebGrid from "./components/WebGrid";
import CustomizeBar from "./components/CustomizeBar";
import { CURRENT_WALLPAPER } from "./config/StorageKey";
function App() {
  const [wallpaper, setWallpaper] = useState();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const loadWallpaper = async () => {
      const wallpaperUrl = await wallpaperService.fetchDailyWallpaper();
      setWallpaper(wallpaperUrl || "");
    };

    loadWallpaper();
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setIsEditMode(!isEditMode);
  };

  const handleSetWallpaper = (wallpaperUrl) => {
    localStorage.setItem(
      CURRENT_WALLPAPER,
      JSON.stringify({
        url: wallpaperUrl,
        updatedAt: new Date().toDateString(),
      })
    );
    setWallpaper(wallpaperUrl || "");
  };

  return (
    <div
      className="h-screen w-screen"
      style={{
        background: wallpaper
          ? `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${wallpaper})`
          : "linear-gradient(135deg, rgba(15, 104, 235, 1) 0%, rgba(9, 98, 121, 1) 50%, rgba(72, 205, 227, 1) 100%)",
      }}
      onContextMenu={handleContextMenu}
    >
      <div className="w-full max-w-4xl ml-auto mr-auto pt-[150px]">
        <CustomizeBar
          isEditMode={isEditMode}
          setIsAddModalOpen={setIsAddModalOpen}
          setIsEditMode={setIsEditMode}
          setWallpaper={handleSetWallpaper}
        />
        <OdometerClock />
        <SearchBar />
        <WebGrid
          isEditMode={isEditMode}
          isAddModalOpen={isAddModalOpen}
          setIsEditMode={setIsEditMode}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      </div>
    </div>
  );
}

export default App;
