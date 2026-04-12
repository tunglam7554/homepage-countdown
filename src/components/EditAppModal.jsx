import { motion, AnimatePresence } from "framer-motion";
import EditApp from "./app-store/EditApp";

const popupStyle = {
    padding: 0,
    borderRadius: 18,
    overflow: "hidden",
    backdropFilter: "blur(50px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    width: 500,
    border: "1px solid rgba(255,255,255,0.2)",
};

export default function EditAppModal({ app, onClose, onEdit, onUninstall }) {
    return (
        <AnimatePresence>
            <div
                style={{
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
                }}
            >
                <motion.div
                    style={popupStyle}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <EditApp
                        isModal={true}
                        app={app}
                        onEdit={onEdit}
                        onUninstall={onUninstall}
                        onClose={onClose}
                    />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
