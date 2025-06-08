import { useState } from "react";
import { IS_OPEN_SEARCH_IN_NEW_TAB, SEARCH_ENGINE } from "../config/StorageKey";
const inputStyle = {
  border: "1px solid rgba(255,255,255,0.2)",
};

const searchEngine = {
  Google: "https://www.google.com/search",
  Bing: "https://www.bing.com/search",
  DuckDuckGo: "https://www.duckduckgo.com",
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="mt-8">
      <form
        className="relative"
        action={searchEngine[localStorage.getItem(SEARCH_ENGINE) || "Google"]}
        method="get"
        target={
          JSON.parse(localStorage.getItem(IS_OPEN_SEARCH_IN_NEW_TAB))
            ? "_blank"
            : "_self"
        }
      >
        <input
          type="search"
          placeholder={`Search with ${
            localStorage.getItem(SEARCH_ENGINE) || "Google"
          }`}
          className="searchbar w-full h-12 pl-12 pr-4 py-2 rounded-full placeholder:italic shadow-lg text-xl flex-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          style={inputStyle}
          value={query}
          autoComplete="off"
          name="q"
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
