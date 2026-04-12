import { useState, useRef, useEffect, use } from "react";
import { ICON_URL } from "../../config/constants";
import ButtonClose from "../ui/ButtonClose";
import ButtonProgress from "../ui/ButtonProgress";

const iconStyle = {
    border: "1px solid rgba(255,255,255,0.2)",
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
    const [isValid, setIsValid] = useState(false);

    const handleEdit = () => {
        if (!isValid) return;

        const editedApp = {
            id: url,
            name: name,
            url: url,
            icon: ICON_URL + url,
        };

        onEdit && onEdit(editedApp);
    };

    useEffect(() => {
        let isChanged =
            (name !== app.name || url !== app.url) &&
            name !== "" &&
            url !== "" &&
            (url.startsWith("http://") || url.startsWith("https://"));
        setIsValid(isChanged);
    }, [name, url]);

    return (
        <div className="w-full h-full">
            <div
                className={`w-full p-4 flex ${isModal ? "justify-between" : "justify-start"}`}
            >
                {isModal ? (
                    <>
                        <div className="text-2xl font-semibold">Edit App</div>
                        <ButtonClose onClose={onClose} />
                    </>
                ) : (
                    <button
                        className="text-gray-400 hover:text-gray-200 transition flex items-center"
                        onClick={onClose}
                        aria-label="Back to Installed Apps"
                    >
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
                    </button>
                )}
            </div>
            <div
                className={`w-full flex flex-col items-center gap-4 ${isModal ? "p-6" : "px-40 pt-32"}`}
            >
                <div className="flex flex-row gap-4 w-full">
                    <div
                        className="flex w-40 border-2 rounded-2xl justify-center items-center"
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
                                className="placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition opacity-50"
                                value={url}
                                disabled={true}
                                onChange={(e) => setUrl(e.target.value)}
                                style={inputStyle}
                                placeholder="https://"
                                autocomplete="off"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4" style={fieldRowStyle}>
                    <ButtonProgress
                        disabled={!isValid}
                        onClick={handleEdit}
                        text="Save Changes"
                        loadingText="Saving..."
                        successText="Changes Saved"
                        progressClassName="bg-white/20"
                        normalClassName=""
                        loadingClassName=""
                        className="bg-white text-black w-full px-4 py-2"
                        isShowLoading={true}
                    />
                    <ButtonProgress
                        onClick={() => onUninstall(app)}
                        text="Uninstall"
                        loadingText="Uninstalling..."
                        successText="Uninstalled"
                        progressClassName="bg-white/20"
                        normalClassName=""
                        loadingClassName=""
                        className="bg-red-500 text-white w-full px-4 py-2"
                        isShowLoading={true}
                    />
                </div>
            </div>
        </div>
    );
};
export default EditApp;
