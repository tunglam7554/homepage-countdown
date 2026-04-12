export default function Category({ title, isSelected, onClick }) {
    return (
        <div
            className={`rounded-2xl flex flex-col mb-2 px-4 py-2 cursor-pointer transition-colors ${
                isSelected
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-white hover:text-black"
            }`}
            onClick={onClick}
        >
            <span>{title}</span>
        </div>
    );
}
