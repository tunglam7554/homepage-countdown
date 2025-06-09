import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { IS_OPEN_LINK_IN_NEW_TAB } from "../config/StorageKey";

export default function WebItem({ app, isEditing, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: app.id,
      disabled: !isEditing,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isEditing ? "move" : "pointer",
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onEdit(app);
  };

  return (
    <AnimatePresence>
      <div
        className="shortcut text-sm"
        ref={setNodeRef}
        style={style}
        {...attributes}
        onContextMenu={handleContextMenu}
      >
        <div
          className="shortcut-icon-wrap"
          {...listeners}
          onClick={() => {
            if (!isEditing) {
              let isOpenLinkInNewTab = JSON.parse(
                localStorage.getItem(IS_OPEN_LINK_IN_NEW_TAB) || true
              );
              window.open(app.url, isOpenLinkInNewTab ? "_blank" : "_self");
            }
          }}
        >
          <div className="shortcut-icon-bg">
            <img src={app.icon} />
          </div>
          <span className="text-shadow-lg">{app.name}</span>
        </div>
        {isEditing && (
          <motion.button
            className="shortcut-edit-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(app);
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
            </svg>
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
}
