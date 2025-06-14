import { useState, useEffect } from "react";

export default function CustomizeCheckbox({ isChecked, onChange, text }) {
  const [isValueChecked, setIsValueChecked] = useState(isChecked);

  const onValueChange = () => {
    setIsValueChecked(!isValueChecked);
    onChange(!isValueChecked);
  };

  useEffect(() => {
    setIsValueChecked(isChecked);
  }, [isChecked]);

  return (
    <div
      className="rounded-2xl h-8 flex items-center space-between mb-2 hover:bg-white hover:text-black px-4"
      onClick={onValueChange}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={isChecked}
        onChange={onValueChange}
      />
      <label
        className="flex items-center w-full h-full cursor-pointer"
        htmlFor="customCheckbox"
      >
        {text}
      </label>
      {isValueChecked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}
