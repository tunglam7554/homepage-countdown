import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopSiteGrid from "./TopSiteGrid";
import AddCustomUrl from "./AddCustomUrl";

const overlayStyle = {
  color: "#fff",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};

const popupStyle = {
  padding: 20,
  borderRadius: 18,
  overflow: "hidden",
  backdropFilter: "blur(50px)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  transition: "height 0.15s ease-in-out",
  border: "1px solid rgba(255,255,255,0.2)",
};

const tabBarStyle = {
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px) saturate(125%)",
  backgroundColor: "rgba(41, 44, 46, 0.5)",
};

const tabStyle = {
  transition: "all 0.5s ease-in-out",
  zIndex: 2,
};

const tabSelectedStyle = {
  backgroundColor: "#fff",
  color: "#000",
  transition: "all 0.5s ease-in-out",
  zIndex: 2,
};

function AddWebSiteModal({ onClose, onAdd, existingUrls }) {
  const [isSelectFromTopSites, setIsSelectFromTopSites] = useState(true);

  const handleSubmit = (selectedApps) => {
    onAdd(selectedApps);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <div style={overlayStyle}>
        <motion.div
          className="shadow-lg"
          style={{ ...popupStyle, height: isSelectFromTopSites ? 656 : 306 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex justify-center mb-4">
            <div
              className="inline-flex gap-1 rounded-full p-1"
              style={tabBarStyle}
            >
              <motion.div
                className="absolute inset-y-1 rounded-full"
                initial={false}
                animate={{
                  x: isSelectFromTopSites ? 0 : "calc(50% + 60px)",
                  width: isSelectFromTopSites
                    ? "calc(50% - 6px)"
                    : "calc(50% - 6px)",
                  backgroundColor: "#fff",
                }}
                exit={{
                  backgroundColor: "transparent",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 300,
                }}
                style={{ zIndex: 1 }}
              />
              <motion.h3
                className={`px-4 py-1 font-normal text-lg cursor-pointer rounded-s-3xl rounded-e-3xl text-gray-500 hover:text-white transition-colors duration-300`}
                style={isSelectFromTopSites ? tabSelectedStyle : tabStyle}
                onClick={() => setIsSelectFromTopSites(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Top Sites
              </motion.h3>
              <motion.h3
                className={`px-4 py-1 font-normal text-lg cursor-pointer rounded-s-3xl rounded-e-3xl text-gray-500 hover:text-white transition-colors duration-300`}
                onClick={() => setIsSelectFromTopSites(false)}
                style={!isSelectFromTopSites ? tabSelectedStyle : tabStyle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Custom URL
              </motion.h3>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSelectFromTopSites ? "topSites" : "customUrl"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isSelectFromTopSites ? (
                <TopSiteGrid
                  onSubmit={handleSubmit}
                  onClose={handleClose}
                  existingUrls={existingUrls}
                />
              ) : (
                <AddCustomUrl onSubmit={handleSubmit} onClose={onClose} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AddWebSiteModal;
