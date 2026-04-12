import { useState, useEffect } from "react";
import { ICON_URL } from "../../config/constants";
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

const CreateApp = ({ onInstall }) => {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("https://");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        let isChanged =
            name !== "" &&
            url !== "" &&
            (url.startsWith("http://") || url.startsWith("https://"));
        setIsValid(isChanged);
    }, [name, url]);

    const handleCreateApp = () => {
        if (!isValid) return;

        const newApp = {
            id: url,
            name: name,
            url: url,
            icon: ICON_URL + url,
        };

        onInstall && onInstall([newApp]);
    };

    const onInstallSuccess = () => {
        setName("");
        setUrl("https://");
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
                    <ButtonProgress
                        disabled={!isValid}
                        onClick={handleCreateApp}
                        onSuccess={onInstallSuccess}
                        text="Create App"
                        loadingText="Creating..."
                        successText="App Created"
                        progressClassName="bg-progress"
                        normalClassName=""
                        loadingClassName=""
                        className="bg-white text-black w-full px-4 py-2"
                        isShowLoading={true}
                    />
                </div>
            </div>
        </>
    );
};
export default CreateApp;
