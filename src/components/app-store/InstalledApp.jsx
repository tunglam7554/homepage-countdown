import { useState } from "react";
import { ICON_URL } from "../../config/constants";
import EditApp from "./EditApp";

const InstalledApp = ({
    installedApps,
    searchTerm = "",
    onEdit,
    onUninstall,
}) => {
    const [apps, setApps] = useState(installedApps || []);
    const q = (searchTerm || "").toLowerCase().trim();
    const matches = (item) => {
        if (!q) return true;
        const hay = ((item.name || "") + " " + (item.url || "")).toLowerCase();
        return hay.includes(q);
    };
    const [editingApp, setEditingApp] = useState(null);

    const handleRemove = (app) => {
        const updated = apps.filter((a) => a.id !== app.id);
        setApps(updated);
        onUninstall && onUninstall(app);
        setEditingApp(null);
    };

    const handleEdit = (app) => {
        setEditingApp(app);
    };

    const handleSaveEdit = (updatedApp) => {
        const updatedApps = apps.map((a) =>
            a.id === updatedApp.id
                ? { ...updatedApp, icon: ICON_URL + updatedApp.url }
                : a,
        );
        setApps(updatedApps);
        onEdit && onEdit(updatedApp);
        setEditingApp(null);
    };

    return editingApp ? (
        <EditApp
            app={editingApp}
            onEdit={handleSaveEdit}
            onUninstall={handleRemove}
            onClose={() => setEditingApp(null)}
        />
    ) : (
        <div className="w-full grid grid-cols-5 mt-2">
            {apps.filter(matches).map((item) => (
                <div
                    className="flex items-center justify-center h-32"
                    key={item.id || item.url}
                >
                    <div
                        className="shortcut shortcut-icon-wrap"
                        onClick={() => handleEdit(item)}
                    >
                        <div className="shortcut-icon-bg">
                            <img
                                src={
                                    item.icon ||
                                    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.url}&size=48`
                                }
                                alt={item.name || item.url}
                            />
                        </div>
                        <span className="text-shadow-lg">{item.name}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InstalledApp;
