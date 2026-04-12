import { useState, useEffect } from "react";
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

    useEffect(() => {
        const listShortcut = GetListShortcut();
        setApps(listShortcut);
    }, []);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = apps.findIndex((a) => a.id === active.id);
            const newIndex = apps.findIndex((a) => a.id === over.id);
            setApps(arrayMove(apps, oldIndex, newIndex));
            SaveListShortcut(apps);
        }
    };

    const onInstall = (newApps) => {
        // Avoid duplicates
        const existingIds = apps.map((a) => a.id);
        const merged = [
            ...apps,
            ...newApps.filter((a) => !existingIds.includes(a.id)),
        ];
        setApps(merged);
        SaveListShortcut(merged);
    };

    const onUninstall = (app) => {
        const updated = apps.filter((a) => a.id !== app.id);
        setApps(updated);
        SaveListShortcut(updated);
        setEditingApp(null);
    };

    const [editingApp, setEditingApp] = useState(null);
    const openEdit = (app) => {
        setEditingApp(app);
    };

    const onEdit = (updatedApp) => {
        debugger;
        updatedApp.icon = ICON_URL + updatedApp.url;
        var updatedApps = apps.map((a) =>
            a.id === updatedApp.id ? updatedApp : a,
        );
        setApps(updatedApps);
        SaveListShortcut(updatedApps);
        console.log(updatedApps);
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
                    <div className="grid grid-cols-8 gap-4 py-2 mt-4">
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
