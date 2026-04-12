export default function CustomizeButton({ title, onClick, children }) {
    return (
        <div
            className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
            onClick={onClick}
        >
            <span>{title}</span>
            {children}
        </div>
    );
}
