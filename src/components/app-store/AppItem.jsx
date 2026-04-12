import { useState, useEffect, useRef } from "react";

export default function AppItem({ app, isInstalled, onInstall, onView }) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);
    const installTimeoutRef = useRef(null);
    useEffect(() => {
        return () => {
            if (progressRef.current) clearInterval(progressRef.current);
            if (installTimeoutRef.current)
                clearTimeout(installTimeoutRef.current);
        };
    }, []);

    const handleInstall = async (e) => {
        e && e.stopPropagation && e.stopPropagation();
        if (loading) return;

        setLoading(true);
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

        try {
            // wait simulated install duration
            await new Promise((resolve) => {
                installTimeoutRef.current = setTimeout(resolve, total);
            });

            // ensure progress finishes
            setProgress(100);

            // call onInstall after simulated delay; await if it returns a promise
            const res = onInstall ? onInstall(app) : null;
            if (res && typeof res.then === "function") {
                await res;
            }
        } catch (err) {
            console.error("install failed", err);
        } finally {
            if (progressRef.current) {
                clearInterval(progressRef.current);
                progressRef.current = null;
            }
            if (installTimeoutRef.current) {
                clearTimeout(installTimeoutRef.current);
                installTimeoutRef.current = null;
            }
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 300);
        }
    };

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
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer"
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
                    <button
                        className={`px-3 py-1 rounded-full text-sm relative overflow-hidden bg-white/10 ${loading ? "text-black cursor-not-allowed" : "text-white cursor-pointer"}`}
                        onClick={handleInstall}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        <div
                            className="absolute left-0 top-0 bottom-0 rounded-full"
                            style={{
                                width: `${progress}%`,
                                background: loading ? "white" : "transparent",
                                transition: "width 50ms linear",
                                zIndex: 0,
                            }}
                        />
                        <span className="relative z-10">
                            {loading ? "Installing..." : "Install"}
                        </span>
                    </button>
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
