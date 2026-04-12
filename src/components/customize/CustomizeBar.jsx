import CustomizeClock from "./CustomizeClock";
import CustomizeOption from "./CustomizeOption";
import CustomizeWallpaper from "./CustomizeWallpaper";
import DeveloperOptions from "./DeveloperOptions";
import { useEffect, useState } from "react";
import { UPDATE_CONFIG } from "../../config/StorageKey";
import { motion, AnimatePresence } from "framer-motion";
import { customizeOptions } from "../../config/customize-option";

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
    "flex-1 text-shadow-lg hover:text-gray-950 hover:bg-white hover:shadow-lg px-3 rounded-s-3xl rounded-e-3xl text-center";

export default function CustomizeBar({
    isEditMode,
    onOpenAppStore,
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
                    className="flex gap-2 text-sm"
                    style={CustomizeBarPosition}
                    key={isEditMode ? "editMode" : "normalMode"}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div
                        className="shadow-lg flex rounded-full"
                        style={CustomizeBarStyle}
                    >
                        <button
                            className={ButtonTabStyle}
                            onClick={() => {
                                setSelectedTab(0);
                                onOpenAppStore(true);
                            }}
                        >
                            + Add
                        </button>
                    </div>
                    <div
                        className="shadow-lg rounded-full flex gap-2 text-white justify-space-between"
                        style={{ ...CustomizeBarStyle }}
                    >
                        {customizeOptions.map((option, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`${ButtonTabStyle} ${
                                        selectedTab == option.id &&
                                        " bg-white text-gray-950"
                                    }`}
                                    onClick={() => setSelectedTab(option.id)}
                                >
                                    {option.name}
                                </button>
                            );
                        })}
                        <button
                            className={ButtonTabStyle}
                            onClick={handleExitEditMode}
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="flex gap-2 text-sm"
                    style={CustomizeBarPosition}
                    key={isEditMode ? "editMode" : "normalMode"}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="rounded-full" style={CustomizeButtonStyle}>
                        <button
                            className={ButtonTabStyle}
                            onClick={handleEnterEditMode}
                        >
                            Customize
                        </button>
                    </div>
                </motion.div>
            )}
            {selectedTab == 1 && <CustomizeClock />}
            {selectedTab == 2 && (
                <CustomizeWallpaper setWallpaper={setWallpaper} />
            )}
            {selectedTab == 3 && <CustomizeOption />}
            {selectedTab == 4 && <DeveloperOptions />}
        </AnimatePresence>
    );
}
