export default function ButtonClose({ onClose }) {
    return (
        <button
            className=" bg-white/10 text-gray-400 h-8 w-8 flex items-center justify-center rounded-full hover:bg-amber-50 hover:text-red-500 transition-colors"
            onClick={onClose}
            aria-label="Close"
        >
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
        </button>
    );
}
