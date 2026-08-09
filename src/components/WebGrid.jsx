import { useState, useEffect, useRef } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import AppStore from "./AppStore";
import EditAppModal from "./EditAppModal";
import WebItem from "./ui/WebItem";
import { motion, AnimatePresence } from "framer-motion";
import { SaveListShortcut, GetListShortcut } from "../utils/ShortcutHelper";
import { ICON_URL } from "../config/constants";

export default function WebGrid({
    isEditMode,
    isOpenAppStore,
    onOpenAppStore,
}) {
    const sensors = useSensors(useSensor(PointerSensor));
    const [apps, setApps] = useState([]);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const listShortcut = GetListShortcut();
        setApps(listShortcut);
    }, []);

    useEffect(() => {
        if (isFirstLoad.current) {
            // skip saving the just-loaded list right back over itself
            isFirstLoad.current = false;
            return;
        }
        SaveListShortcut(apps);
    }, [apps]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setApps((prevApps) => {
                const oldIndex = prevApps.findIndex((a) => a.id === active.id);
                const newIndex = prevApps.findIndex((a) => a.id === over.id);
                return arrayMove(prevApps, oldIndex, newIndex);
            });
        }
    };

    const onInstall = (newApps) => {
        setApps((prevApps) => {
            // Avoid duplicates
            const existingIds = prevApps.map((a) => a.id);
            return [
                ...prevApps,
                ...newApps.filter((a) => !existingIds.includes(a.id)),
            ];
        });
    };

    const onUninstall = (app) => {
        setApps((prevApps) => prevApps.filter((a) => a.id !== app.id));
        setEditingApp(null);
    };

    const [editingApp, setEditingApp] = useState(null);
    const openEdit = (app) => {
        setEditingApp(app);
    };

    const onEdit = (updatedApp) => {
        updatedApp.icon = ICON_URL + updatedApp.url;
        setApps((prevApps) =>
            prevApps.map((a) => (a.id === updatedApp.id ? updatedApp : a)),
        );
        setEditingApp(null);
    };

    return (
        <AnimatePresence>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={apps.map((a) => a.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-2 gap-y-4 sm:gap-4 py-2 mt-4 max-h-[42vh] sm:max-h-[46vh] md:max-h-[50vh] overflow-y-auto overflow-x-hidden pr-3 content-start">
                        {apps.map((app) => (
                            <WebItem
                                key={app.id}
                                app={app}
                                isEditing={isEditMode}
                                onEdit={openEdit}
                            />
                        ))}
                        {!isEditMode && (
                            <motion.div
                                className="shortcut"
                                onClick={() => onOpenAppStore(true)}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="shortcut-icon-bg">
                                    <img
                                        src="./assets/add.png"
                                        style={{ height: 24, width: 24 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
            {isOpenAppStore && (
                <AppStore
                    installedApps={apps}
                    onInstall={onInstall}
                    onUninstall={onUninstall}
                    onEdit={onEdit}
                    onClose={() => onOpenAppStore(false)}
                />
            )}
            {editingApp && (
                <EditAppModal
                    app={editingApp}
                    onEdit={onEdit}
                    onUninstall={onUninstall}
                    onClose={() => setEditingApp(null)}
                />
            )}
        </AnimatePresence>
    );
}
