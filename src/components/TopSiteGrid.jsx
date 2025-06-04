import { topsite } from "../config/catalog";
import { useState } from "react";
import { ICON_URL } from "../config/constants";

const buttonRowStyle = {
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  marginTop: 15,
};

const buttonStyle = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "none",
  fontSize: 14,
  cursor: "pointer",
  color: "#fff",
};

const TopSiteGrid = ({ onSubmit, onClose, existingUrls }) => {
  const [selectedUrls, setSelectedUrls] = useState(existingUrls ?? []);
  const handleToggle = (url) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleSubmit = () => {
    const selectedApps = [];
    topsite.forEach((category) => {
      category.listItem.forEach((item) => {
        if (
          selectedUrls?.includes(item.url) &&
          !existingUrls?.includes(item.url)
        ) {
          selectedApps.push({
            id: item.url,
            name: item.name,
            url: item.url,
            icon: item.icon || ICON_URL + item.url,
          });
        }
      });
    });

    onSubmit(selectedApps);
  };

  return (
    <>
      <div
        style={{
          width: 512,
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        {topsite.map((category) => (
          <div key={category.category} style={{ marginTop: 10 }}>
            <strong>{category.category}</strong>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {category.listItem.map((item) => {
                const isAdded = existingUrls?.includes(item.url);
                return (
                  <div key={item.url} className="shortcut">
                    <div
                      className="shortcut-icon-wrap"
                      onClick={() => handleToggle(item.url)}
                    >
                      <div className="shortcut-icon-bg">
                        <img
                          src={
                            item.icon ||
                            `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.url}&size=48`
                          }
                        />
                      </div>
                      <span className="text-shadow-lg">{item.name}</span>
                    </div>
                    <div className="shortcut-checkbox">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            disabled={isAdded}
                            checked={
                              isAdded || selectedUrls?.includes(item.url)
                            }
                            onChange={() => handleToggle(item.url)}
                          />
                          <div
                            className={`shortcut-checkbox-bg w-5 h-5 bg-white border-2 border-gray-300 rounded ${
                              isAdded
                                ? "peer-checked:bg-gray-300 peer-checked:border-gray-300"
                                : "peer-checked:bg-cyan-400 peer-checked:border-cyan-400"
                            } transition-all duration-200 group-hover:border-cyan-400`}
                          >
                            <svg
                              className="w-4 h-4 text-white absolute top-0.5 left-0.5 peer-checked:block"
                              fill="#fff"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={buttonRowStyle}>
        <button style={buttonStyle} onClick={onClose}>
          Cancel
        </button>
        <button
          className="bg-cyan-400 text-white"
          style={buttonStyle}
          onClick={handleSubmit}
          disabled={selectedUrls.length === 0}
        >
          Save
        </button>
      </div>
    </>
  );
};
export default TopSiteGrid;
