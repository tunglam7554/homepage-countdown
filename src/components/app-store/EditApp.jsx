import { useState, useRef, useEffect } from "react";
import { ICON_URL } from "../../config/constants";

const iconStyle = {
    border: "1px solid rgba(255,255,255,0.2)",
};

const buttonStyle = {
    padding: "8px 16px",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
};

const fieldRowStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 10,
};

const inputStyle = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    width: "100%",
};

const labelStyle = {
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.8,
    width: 80,
    flexShrink: 0,
};

const EditApp = ({ isModal, app, onEdit, onUninstall, onClose }) => {
    const [name, setName] = useState(app?.name || "");
    const [url, setUrl] = useState(app?.url || "https://");
    const [loading, setLoading] = useState(false);
    const [label, setLabel] = useState("Save Changes");
    const progressRef = useRef(null);
    const editedTimeoutRef = useRef(null);
    const resetTimeoutRef = useRef(null);

    const [uninstalling, setUninstalling] = useState(false);
    const [uninstallLabel, setUninstallLabel] = useState("Uninstall");
    const [uninstallProgress, setUninstallProgress] = useState(0);
    const uninstallIntervalRef = useRef(null);
    const uninstallTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (progressRef.current) clearInterval(progressRef.current);
            if (editedTimeoutRef.current)
                clearTimeout(editedTimeoutRef.current);
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
            if (uninstallIntervalRef.current)
                clearInterval(uninstallIntervalRef.current);
            if (uninstallTimeoutRef.current)
                clearTimeout(uninstallTimeoutRef.current);
        };
    }, []);

    const handleEdit = () => {
        if (
            loading ||
            name === "" ||
            url === "" ||
            !(url.startsWith("http://") || url.startsWith("https://"))
        )
            return;

        const editedApp = {
            id: url,
            name: name,
            url: url,
            icon: ICON_URL + url,
        };

        setLoading(true);
        setLabel("Saving...");

        const total = 3000;

        onEdit && onEdit(editedApp);

        editedTimeoutRef.current = setTimeout(() => {
            setLabel("Saved Changes!");
            resetTimeoutRef.current = setTimeout(() => {
                setLoading(false);
                setLabel("Save Changes");
            }, 2000);
        }, total);
    };

    const handleUninstallClick = () => {
        if (uninstalling || loading) return;
        setUninstalling(true);
        setUninstallLabel("Uninstalling...");
        setUninstallProgress(0);

        // Progress animation before calling onUninstall
        uninstallIntervalRef.current = setInterval(() => {
            setUninstallProgress((p) => {
                const np = Math.min(100, p + 6);
                if (np >= 100) {
                    if (uninstallIntervalRef.current) {
                        clearInterval(uninstallIntervalRef.current);
                        uninstallIntervalRef.current = null;
                    }
                    // brief pause at 100% then finalize
                    uninstallTimeoutRef.current = setTimeout(() => {
                        setUninstallLabel("Uninstalled");
                        setUninstalling(false);
                        setUninstallProgress(0);
                        onUninstall && onUninstall(app);
                    }, 300);
                }
                return np;
            });
        }, 120);
    };

    return (
        <div className="w-full h-full">
            <div
                className={`w-full p-4 flex ${isModal ? "justify-between" : "justify-start"}`}
            >
                {isModal && (
                    <div className="text-2xl font-semibold">Edit App</div>
                )}
                <button
                    className={
                        isModal
                            ? "text-gray-400 h-8 w-8 flex items-center justify-center rounded-full hover:bg-amber-50 hover:text-red-500 transition-colors"
                            : "text-gray-400 hover:text-gray-200 transition flex items-center"
                    }
                    onClick={onClose}
                    aria-label={
                        isModal ? "Close Edit Modal" : "Back to Installed Apps"
                    }
                >
                    {isModal ? (
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
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M19 12H6" />
                                <path d="M12 19L5 12L12 5" />
                            </svg>
                            <span className="ml-1">Back</span>
                        </>
                    )}
                </button>
            </div>
            <div
                className={`w-full flex flex-col items-center gap-4 ${isModal ? "p-6" : "px-40 pt-32"}`}
            >
                <div className="flex flex-row gap-4 w-full">
                    <div
                        className="flex justify-center items-center w-40 border-2 rounded-2xl"
                        style={iconStyle}
                    >
                        <img
                            className="w-12 h-12 object-cover"
                            src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=48`}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full">
                        <div style={fieldRowStyle}>
                            <label style={labelStyle}>Name</label>
                            <input
                                type="text"
                                className="placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                placeholder="Name"
                                autocomplete="off"
                            />
                        </div>

                        <div style={fieldRowStyle}>
                            <label style={labelStyle}>URL</label>
                            <input
                                type="text"
                                className="placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                style={inputStyle}
                                placeholder="https://"
                                autocomplete="off"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4" style={fieldRowStyle}>
                    <button
                        className={`rounded-2xl relative overflow-hidden flex items-center justify-center w-full ${
                            name === "" ||
                            url === "" ||
                            (name === app.name && url === app.url) ||
                            !(
                                url.startsWith("http://") ||
                                url.startsWith("https://")
                            )
                                ? " bg-gray-600 text-gray-500 cursor-not-allowed"
                                : `bg-white text-black ${loading || uninstalling ? "cursor-not-allowed" : "cursor-pointer"}`
                        }`}
                        style={buttonStyle}
                        onClick={handleEdit}
                        disabled={
                            loading ||
                            uninstalling ||
                            (name === app.name && url === app.url) ||
                            name === "" ||
                            url === "" ||
                            !(
                                url.startsWith("http://") ||
                                url.startsWith("https://")
                            )
                        }
                    >
                        <span className="flex items-center relative z-10">
                            {loading && (
                                <svg
                                    className="animate-spin h-4 w-4 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            {label}
                        </span>
                    </button>
                    <button
                        className={`rounded-2xl relative overflow-hidden flex items-center justify-center w-full bg-red-500 text-white ${loading || uninstalling ? "cursor-not-allowed" : "cursor-pointer"}`}
                        style={buttonStyle}
                        onClick={handleUninstallClick}
                        disabled={loading || uninstalling}
                    >
                        {/* progress background */}
                        {uninstalling && (
                            <div
                                className="absolute left-0 top-0 bottom-0 bg-white/20 z-0"
                                style={{
                                    width: `${uninstallProgress}%`,
                                    transition: "width 120ms linear",
                                }}
                            />
                        )}
                        <span className="flex items-center relative z-10">
                            {uninstalling && (
                                <svg
                                    className="animate-spin h-4 w-4 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            {uninstalling ? uninstallLabel : "Uninstall"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EditApp;
