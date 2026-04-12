import { useState, useEffect, useRef } from "react";

export default function ButtonProgress({
    onClick,
    onSuccess,
    disabled = false,
    duration = 3000,
    text,
    loadingText,
    successText,
    className = "bg-white/10 px-3 py-1 text-sm",
    normalClassName = "text-white",
    loadingClassName = "text-black",
    progressClassName = "bg-white",
    isShowLoading = false,
}) {
    const total = duration;
    const tick = 50;
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [labelText, setLabelText] = useState(text);
    const progressRef = useRef(null);
    const installTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (progressRef.current) clearInterval(progressRef.current);
            if (installTimeoutRef.current)
                clearTimeout(installTimeoutRef.current);
        };
    }, []);

    const handleClick = async (e) => {
        e && e.stopPropagation && e.stopPropagation();
        if (loading) return;

        setLoading(true);
        setProgress(0);
        setLabelText(loadingText || text);

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
            await new Promise((resolve) => {
                installTimeoutRef.current = setTimeout(resolve, total);
            });

            setProgress(100);
            setLabelText(successText || text);

            const res = onClick ? onClick() : null;
            if (res && typeof res.then === "function") {
                await res;
            }
        } catch (err) {
            console.error(err);
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
                setLabelText(text);
                onSuccess && onSuccess();
            }, 3000);
        }
    };

    return (
        <button
            className={`flex rounded-2xl relative items-center justify-center overflow-hidden ${className} ${loading ? loadingClassName : normalClassName} ${disabled ? "cursor-not-allowed opacity-50" : "opacity-95 hover:opacity-100"}`}
            onClick={handleClick}
            disabled={disabled || loading}
            aria-busy={loading}
        >
            <div
                className={`absolute left-0 top-0 bottom-0 rounded-2xl ${loading ? progressClassName : "bg-transparent"}`}
                style={{
                    width: `${progress}%`,
                    transition: "width 50ms linear",
                    zIndex: 0,
                }}
            />
            <span className="relative z-10 flex items-center">
                {isShowLoading && loading && (
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
                {labelText}
            </span>
        </button>
    );
}
