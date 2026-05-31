export default function CustomizeButton({
    title,
    onClick,
    children,
    disabled = false,
}) {
    const base = "rounded-2xl flex flex-col mb-2 px-4 py-2";
    const enabled = "hover:bg-white hover:text-black cursor-pointer";
    const disabledClass = "opacity-50 cursor-not-allowed";
    return (
        <div
            className={`${base} ${disabled ? disabledClass : enabled}`}
            onClick={disabled ? undefined : onClick}
            aria-disabled={disabled}
        >
            <span>{title}</span>
            {children}
        </div>
    );
}
