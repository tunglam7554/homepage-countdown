import CustomizeClock from "./CustomizeClock";
import CustomizeOption from "./CustomizeOption";
import CustomizeWalpaper from "./CustomizeWallpaper";
import { useEffect, useState } from "react";
import { UPDATE_CONFIG } from "../config/StorageKey";
import { motion, AnimatePresence, color } from "framer-motion";

const CustomizeBarPosition = {
  margin: 16,
  padding: 4,
  position: "fixed",
  top: 0,
  right: 0,
};

const CustomizeBarStyle = {
  padding: 4,
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px) saturate(125%)",
  backgroundColor: "rgba(41, 44, 46, 0.5)",
  color: "#fff",
};

const CustomizeButtonStyle = {
  padding: 4,
  border: "1px solid transparent",
  color: "#fff",
};

const ButtonTabStyle =
  "text-shadow-lg hover:text-gray-950 hover:bg-white px-3 rounded-s-3xl rounded-e-3xl text-center";

export default function CustomizeBar({
  isEditMode,
  setIsAddModalOpen,
  setIsEditMode,
  setWallpaper,
}) {
  const [selectedTab, setSelectedTab] = useState(-1);

  useEffect(() => {
    setSelectedTab(-1);
    localStorage.setItem(UPDATE_CONFIG, JSON.stringify(new Date()));
  }, [isEditMode]);

  const handleExitEditMode = () => {
    setSelectedTab(-1);
    setIsEditMode(false);
  };

  const handleEnterEditMode = () => {
    setSelectedTab(-1);
    setIsEditMode(true);
  };

  return (
    <AnimatePresence>
      {isEditMode ? (
        <motion.div
          className="flex gap-2"
          style={CustomizeBarPosition}
          key={isEditMode ? "editMode" : "normalMode"}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="shadow-lg rounded-full" style={CustomizeBarStyle}>
            <button
              className={ButtonTabStyle}
              onClick={() => {
                setSelectedTab(0);
                setIsAddModalOpen(true);
              }}
            >
              + Add
            </button>
          </div>
          <div className="shadow-lg rounded-full" style={CustomizeBarStyle}>
            <div className="flex gap-2 text-white">
              <button
                className={`${ButtonTabStyle} ${
                  selectedTab == 1 && " bg-white text-gray-950"
                }`}
                onClick={() => setSelectedTab(1)}
              >
                Clock
              </button>
              <button
                className={`${ButtonTabStyle} ${
                  selectedTab == 2 && " bg-white text-gray-950"
                }`}
                onClick={() => setSelectedTab(2)}
              >
                Wallpaper
              </button>
              <button
                className={`${ButtonTabStyle} ${
                  selectedTab == 3 && " bg-white text-gray-950"
                }`}
                onClick={() => setSelectedTab(3)}
              >
                Options
              </button>
              <button className={ButtonTabStyle} onClick={handleExitEditMode}>
                Done
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="flex gap-2"
          style={CustomizeBarPosition}
          key={isEditMode ? "editMode" : "normalMode"}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="shadow-lg rounded-full" style={CustomizeButtonStyle}>
            <button className={ButtonTabStyle} onClick={handleEnterEditMode}>
              Customize
            </button>
          </div>
        </motion.div>
      )}
      {selectedTab == 1 && <CustomizeClock />}
      {selectedTab == 2 && <CustomizeWalpaper setWallpaper={setWallpaper} />}
      {selectedTab == 3 && <CustomizeOption />}
    </AnimatePresence>
  );
}
