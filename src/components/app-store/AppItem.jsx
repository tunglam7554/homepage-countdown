import ButtonProgress from "../ui/ButtonProgress";

export default function AppItem({ app, isInstalled, onInstall, onView }) {
    const handleView = (e) => {
        e && e.stopPropagation && e.stopPropagation();
        if (onView) return onView(app);
        try {
            window.open(app.url, "_blank");
        } catch (err) {
            console.error("open url failed", err);
        }
    };

    const getSubtitle = () => {
        if (app.description) return app.description;
        try {
            return new URL(app.url).hostname;
        } catch (e) {
            return app.url;
        }
    };

    return (
        <div
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 cursor-default"
            role="button"
        >
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shortcut-icon-bg flex-shrink-0">
                    <img
                        src={
                            app.icon ||
                            `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${app.url}&size=48`
                        }
                        alt={app.name || app.url}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold text-white">{app.name}</div>
                    <div className="text-sm text-gray-300">{getSubtitle()}</div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {!isInstalled ? (
                    <ButtonProgress
                        onClick={() => onInstall(app)}
                        loadingText="Installing..."
                        text="Install"
                        successText="Open"
                    />
                ) : (
                    <button
                        className="px-3 py-1 rounded-full bg-white text-black text-sm"
                        onClick={handleView}
                    >
                        Open
                    </button>
                )}
            </div>
        </div>
    );
}
