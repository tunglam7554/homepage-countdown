import { useState, useRef, useEffect, createRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { topsite } from "../config/catalog";
import Category from "./ui/Category";
import CreateApp from "./app-store/CreateApp";
import InstalledApp from "./app-store/InstalledApp";
import GridApp from "./app-store/GridApp";

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
    padding: 10,
    borderRadius: 18,
    overflow: "hidden",
    backdropFilter: "blur(50px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "height 0.15s ease-in-out",
    border: "1px solid rgba(255,255,255,0.2)",
};

const inputStyle = {
    height: 45,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    width: "500px",
};

function AppStore({ onClose, onInstall, onEdit, onUninstall, installedApps }) {
    const [selectedCategory, setSelectedCategory] = useState("create-app");
    const gridContainerRef = useRef(null);
    const sectionRefs = useRef({});
    const suppressScrollRef = useRef(false);
    const scrollSuppressTimeoutRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    // ensure refs exist for each topsite category
    topsite.forEach((category) => {
        if (!sectionRefs.current[category.category])
            sectionRefs.current[category.category] = createRef();
    });

    const loadCategoryApps = topsite.map((category) => {
        return (
            <Category
                key={category.category}
                isSelected={category.category === selectedCategory}
                title={category.category}
                onClick={() => handleCategoryClick(category.category)}
            />
        );
    });

    useEffect(() => {
        // when selectedCategory changes to a topsite category, scroll to it
        const shouldAttach =
            selectedCategory &&
            selectedCategory !== "create-app" &&
            selectedCategory !== "installed";

        if (shouldAttach) {
            // allow the GridApp to mount then scroll
            const id = setTimeout(() => scrollToCategory(selectedCategory), 50);

            // attach scroll handler to update active category while user scrolls
            const attachScroll = () => {
                const container = gridContainerRef.current;
                if (!container) return;

                let ticking = false;
                const onScroll = () => {
                    if (ticking) return;
                    ticking = true;
                    requestAnimationFrame(() => {
                        // if we're suppressing programmatic scroll updates, skip
                        if (suppressScrollRef.current) {
                            ticking = false;
                            return;
                        }
                        const containerTop =
                            container.getBoundingClientRect().top;
                        let closest = null;
                        let min = Infinity;
                        topsite.forEach((cat) => {
                            const ref = sectionRefs.current[cat.category];
                            if (ref && ref.current) {
                                const offset =
                                    ref.current.getBoundingClientRect().top -
                                    containerTop;
                                const distance = Math.abs(offset);
                                if (distance < min) {
                                    min = distance;
                                    closest = cat.category;
                                }
                            }
                        });
                        if (closest && selectedCategory !== closest) {
                            setSelectedCategory(closest);
                        }
                        ticking = false;
                    });
                };

                container.addEventListener("scroll", onScroll, {
                    passive: true,
                });
                // save handler for cleanup
                container.__categoryScrollHandler = onScroll;
                // call once to set initial active (unless suppressed)
                if (!suppressScrollRef.current) onScroll();
            };

            // attach after a short delay so GridApp has rendered
            const attachId = setTimeout(attachScroll, 80);

            return () => {
                clearTimeout(id);
                clearTimeout(attachId);
                const container = gridContainerRef.current;
                if (container && container.__categoryScrollHandler) {
                    container.removeEventListener(
                        "scroll",
                        container.__categoryScrollHandler,
                    );
                    delete container.__categoryScrollHandler;
                }
                if (scrollSuppressTimeoutRef.current) {
                    clearTimeout(scrollSuppressTimeoutRef.current);
                    scrollSuppressTimeoutRef.current = null;
                }
                suppressScrollRef.current = false;
            };
        }
    }, [selectedCategory]);

    const scrollToCategory = (category) => {
        const ref = sectionRefs.current[category];
        const container = gridContainerRef.current;
        if (!ref || !ref.current || !container) return;
        const el = ref.current;
        const top =
            el.getBoundingClientRect().top -
            container.getBoundingClientRect().top +
            container.scrollTop;
        // suppress scroll-spy updates while we programmatically scroll
        suppressScrollRef.current = true;
        if (scrollSuppressTimeoutRef.current) {
            clearTimeout(scrollSuppressTimeoutRef.current);
            scrollSuppressTimeoutRef.current = null;
        }
        container.scrollTo({ top, behavior: "smooth" });
        // clear suppression shortly after the animated scroll should finish
        scrollSuppressTimeoutRef.current = setTimeout(() => {
            suppressScrollRef.current = false;
            scrollSuppressTimeoutRef.current = null;
        }, 700);
    };

    const handleCategoryClick = (category) => {
        // suppress scroll-spy while we switch to and programmatically scroll the content
        suppressScrollRef.current = true;
        if (scrollSuppressTimeoutRef.current)
            clearTimeout(scrollSuppressTimeoutRef.current);
        scrollSuppressTimeoutRef.current = setTimeout(() => {
            suppressScrollRef.current = false;
            scrollSuppressTimeoutRef.current = null;
        }, 800);

        setSelectedCategory(category);
        if (category === "create-app" || category === "installed") {
            // scroll to top for these sections
            if (gridContainerRef.current)
                gridContainerRef.current.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
        }
    };

    useEffect(() => {
        const q = (searchTerm || "").toLowerCase().trim();
        if (!q) return;

        if (selectedCategory === "installed") return;

        // Find the first topsite category that contains a match (skip installed apps)
        for (const cat of topsite) {
            const found = cat.listItem?.find((item) => {
                const hay = (
                    (item.name || "") +
                    " " +
                    (item.description || "") +
                    " " +
                    (item.url || "")
                ).toLowerCase();
                return hay.includes(q);
            });
            if (found) {
                handleCategoryClick(cat.category);
                return;
            }
        }
        // no match: do nothing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return (
        <AnimatePresence>
            <div style={overlayStyle}>
                <motion.div
                    className="shadow-lg"
                    style={{
                        ...popupStyle,
                        height: 720,
                        width: 1200,
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <div className="w-full flex justify-between items-center mb-4 px-4">
                        <h2 className="text-2xl font-bold">App Store</h2>
                        <input
                            type="text"
                            className="placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={inputStyle}
                            placeholder="Search apps..."
                            autocomplete="off"
                        />
                        <button
                            className="text-gray-400 h-8 w-8 flex items-center justify-center rounded-full hover:bg-amber-50 hover:text-red-500 transition-colors"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                    </div>
                    <div
                        className="flex flex-row gap-6"
                        style={{ height: "calc(100% - 64px)" }}
                    >
                        <div
                            className="w-64 overflow-y-auto pr-2"
                            style={{ maxHeight: "100%" }}
                        >
                            <div
                                className={`rounded-2xl flex flex-col mb-2 px-4 py-2 text-center cursor-pointer transition-colors ${
                                    "create-app" === selectedCategory
                                        ? "bg-blue-400 text-white"
                                        : "bg-white/10 text-white hover:bg-white hover:text-blue-400"
                                }`}
                                onClick={() =>
                                    handleCategoryClick("create-app")
                                }
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </svg>
                                    <span>Create App</span>
                                </span>
                            </div>
                            <Category
                                isSelected={"installed" === selectedCategory}
                                title="Installed"
                                onClick={() => handleCategoryClick("installed")}
                            />
                            {loadCategoryApps}
                        </div>
                        <div
                            className="flex-1"
                            style={{ maxHeight: "100%", overflow: "auto" }}
                        >
                            {selectedCategory === "create-app" && (
                                <CreateApp onSubmit={onInstall} />
                            )}
                            {selectedCategory === "installed" && (
                                <InstalledApp
                                    installedApps={installedApps}
                                    searchTerm={searchTerm}
                                    onEdit={onEdit}
                                    onUninstall={onUninstall}
                                />
                            )}
                            {selectedCategory !== "create-app" &&
                                selectedCategory !== "installed" && (
                                    <GridApp
                                        existingUrls={installedApps.map(
                                            (app) => app.url,
                                        )}
                                        onInstall={onInstall}
                                        containerRef={gridContainerRef}
                                        sectionRefs={sectionRefs.current}
                                        searchTerm={searchTerm}
                                    />
                                )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default AppStore;
