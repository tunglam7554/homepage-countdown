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

const fieldRowStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  gap: 10,
};

const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.8,
  width: 80,
  flexShrink: 0,
};

const AddCustomUrl = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if(name === '' || url === '' || !(url.startsWith('http://') || url.startsWith('https://'))) return;
    const selectedApps = [];
    selectedApps.push({
      id: url,
      name: name,
      url: url,
      icon: ICON_URL + url,
    });
    onSubmit(selectedApps);
  };

  return (
    <>
      <div
        style={{
          width: 512,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={fieldRowStyle}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            className="placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            placeholder="Name"
            autocomplete="off"
          />
        </div>

        <div style={fieldRowStyle}>
          <label style={labelStyle}>URL</label>
          <input
            type="text"
            className="placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
            placeholder="https://"
            autocomplete="off"
          />
        </div>
      </div>
      <div style={buttonRowStyle}>
        <button style={buttonStyle} onClick={onClose}>
          Cancel
        </button>
        <button
         className={name === '' || url === '' || !(url.startsWith('http://') || url.startsWith('https://')) ? "bg-gray-400" : "bg-cyan-400"}
          style={buttonStyle}
          onClick={handleSubmit}
          disabled={name === '' || url === '' || !(url.startsWith('http://') || url.startsWith('https://'))}
        >
          Save
        </button>
      </div>
    </>
  );
};
export default AddCustomUrl;
