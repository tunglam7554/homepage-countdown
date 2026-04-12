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

const CreateApp = ({ onInstall }) => {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("https://");
    const [loading, setLoading] = useState(false);
    const [label, setLabel] = useState("Create App");
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);
    const createdTimeoutRef = useRef(null);
    const resetTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (progressRef.current) clearInterval(progressRef.current);
            if (createdTimeoutRef.current)
                clearTimeout(createdTimeoutRef.current);
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, []);

    const handleCreateApp = () => {
        if (
            loading ||
            name === "" ||
            url === "" ||
            !(url.startsWith("http://") || url.startsWith("https://"))
        )
            return;

        const newApp = {
            id: url,
            name: name,
            url: url,
            icon: ICON_URL + url,
        };

        setLoading(true);
        setLabel("Creating...");
        setProgress(0);

        const total = 3000;
        const tick = 50;
        const start = Date.now();
        progressRef.current = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min(100, Math.round((elapsed / total) * 100));
            setProgress(p);
            if (elapsed >= total) {
                clearInterval(progressRef.current);
                progressRef.current = null;
            }
        }, tick);

        onInstall && onInstall([newApp]);

        createdTimeoutRef.current = setTimeout(() => {
            setLabel("Created!");
            setProgress(100);
            resetTimeoutRef.current = setTimeout(() => {
                setName("");
                setUrl("https://");
                setLoading(false);
                setLabel("Create App");
                setProgress(0);
            }, 2000);
        }, total);
    };

    return (
        <>
            <div className="w-full p-40 flex flex-col items-center gap-4">
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
                            !(
                                url.startsWith("http://") ||
                                url.startsWith("https://")
                            )
                                ? " bg-gray-600 text-gray-500 cursor-not-allowed"
                                : `bg-white text-black ${loading ? "cursor-not-allowed" : "cursor-pointer"}`
                        }`}
                        style={buttonStyle}
                        onClick={handleCreateApp}
                        disabled={
                            loading ||
                            name === "" ||
                            url === "" ||
                            !(
                                url.startsWith("http://") ||
                                url.startsWith("https://")
                            )
                        }
                    >
                        <div
                            className="absolute left-0 top-0 bottom-0 rounded-2xl"
                            style={{
                                width: `${progress}%`,
                                background: loading
                                    ? "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(96,165,250,0.15))"
                                    : "transparent",
                                transition: "width 50ms linear",
                                zIndex: 0,
                            }}
                        />
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
                </div>
            </div>
        </>
    );
};
export default CreateApp;
