import { motion, AnimatePresence } from "framer-motion";
const popupStyle = {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px) saturate(125%)",
    backgroundColor: "rgba(41, 44, 46, 0.5)",
    position: "fixed",
    height: "min(431px, calc(100vh - 76px))",
    width: "min(334px, calc(100vw - 16px))",
    top: 56,
    right: 8,
    color: "#fff",
    zIndex: 80,
    overflowY: "auto",
};

export default function CustomizeModal({ children }) {
    return (
        <AnimatePresence>
            <motion.div
                style={popupStyle}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
