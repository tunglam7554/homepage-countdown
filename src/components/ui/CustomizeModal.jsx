const popupStyle = {
  paddingLeft: 15,
  paddingRight: 15,
  paddingTop: 20,
  paddingBottom: 20,
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px) saturate(125%)",
  backgroundColor: "rgba(41, 44, 46, 0.5)",
  position: "fixed",
  height: 431,
  width: 358,
  top: 56,
  right: 20,
  bottom: 0,
  color: "#fff",
  zIndex: 80,
  overflowY: "auto",
};

export default function CustomizeModal({ children }) {
  return <div style={popupStyle}>{children}</div>;
}
