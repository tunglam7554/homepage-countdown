import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const popupStyle = {
  padding: 20,
  borderRadius: 18,
  overflow: "hidden",
  backdropFilter: "blur(50px)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  width: 500,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  border: "1px solid rgba(255,255,255,0.2)",
};

const fieldRowStyle = {
  display: "flex",
  alignItems: "center",
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
};

const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.8,
  width: 80,
  flexShrink: 0,
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
};

const actionGroupStyle = {
  display: "flex",
  gap: 10,
};

const buttonStyle = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "none",
  fontSize: 14,
  cursor: "pointer",
};

const saveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#33cccc",
  color: "#fff",
};

const cancelButtonStyle = {
  ...buttonStyle,
  color: "#fff",
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#e53935",
  color: "#fff",
};

export default function EditWebSiteModal({ app, onClose, onSave, onDelete }) {
  const [name, setName] = useState(app.name);
  const [url, setUrl] = useState(app.url);

  return (
    <AnimatePresence>
      <div
        style={{
          color: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <motion.div
          style={popupStyle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex p-2 pb-4">
            <h3 className={`font-bold text-xl`}>Edit Shortcut</h3>
          </div>

          <div style={fieldRowStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              autocomplete="off"
            />
          </div>

          <div style={fieldRowStyle}>
            <label style={labelStyle}>URL</label>
            <input
              type="text"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={inputStyle}
              autocomplete="off"
            />
          </div>
          <div style={buttonRowStyle}>
            <button style={deleteButtonStyle} onClick={()=>onDelete(app)}>
              Delete
            </button>
            <div style={actionGroupStyle}>
              <button style={cancelButtonStyle} onClick={onClose}>
                Cancel
              </button>
              <button
                style={saveButtonStyle}
                onClick={() =>{onSave({ ...app, name, url })}}>
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
