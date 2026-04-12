import { topsite } from "../../config/catalog";
import { ICON_URL } from "../../config/constants";
import AppItem from "./AppItem";

const GridApp = ({
    existingUrls,
    onInstall,
    containerRef,
    sectionRefs,
    searchTerm = "",
}) => {
    const handleInstall = (app) => {
        onInstall([
            {
                id: app.url,
                name: app.name,
                url: app.url,
                icon: app.icon || ICON_URL + app.url,
            },
        ]);
    };

    const q = (searchTerm || "").toLowerCase().trim();
    const matches = (item) => {
        if (!q) return true;
        const hay = (
            (item.name || "") +
            " " +
            (item.description || "") +
            " " +
            (item.url || "")
        ).toLowerCase();
        return hay.includes(q);
    };

    return (
        <div
            className="w-full h-full overflow-y-auto px-4 py-2"
            ref={containerRef}
        >
            {topsite.map((category) => {
                const items = category.listItem.filter(matches);
                if (!items || items.length === 0) return null;
                return (
                    <div
                        key={category.category}
                        style={{ marginTop: 10 }}
                        ref={
                            sectionRefs && sectionRefs[category.category]
                                ? sectionRefs[category.category]
                                : undefined
                        }
                        data-category={category.category}
                    >
                        <strong>{category.category}</strong>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {items.map((item) => {
                                const isAdded = existingUrls?.includes(
                                    item.url,
                                );
                                return (
                                    <AppItem
                                        app={item}
                                        key={item.url}
                                        isInstalled={isAdded}
                                        onInstall={() => handleInstall(item)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GridApp;
