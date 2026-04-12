import CustomizeModal from "../ui/CustomizeModal";
import CustomizeButton from "../ui/CustomizeButton";
import { SYNC_KEY } from "../../config/StorageKey";
import {
    saveSettingsToFirebase,
    loadSettingsFromFirebase,
} from "../../services/firebaseServices";
import { SaveListShortcut } from "../../utils/ShortcutHelper";
import { useState } from "react";
export default function DeveloperOptions() {
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [syncKey, setSyncKey] = useState(
        localStorage.getItem(SYNC_KEY) || "",
    );
    const [syncAction, setSyncAction] = useState(""); // "upload" or "download"

    const ChangeSyncSettings = () => {
        setShowSyncModal(true);
    };

    const handleUpload = async () => {
        let syncKey = localStorage.getItem(SYNC_KEY);
        if (!syncKey) {
            syncKey =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            localStorage.setItem(SYNC_KEY, syncKey);
        }
        const settings = {
            shortcuts: JSON.parse(localStorage.getItem("shortcut") || "[]"),
        };
        await saveSettingsToFirebase(syncKey, settings);
        setSyncKey(syncKey);
        setSyncAction("uploaded");
    };

    const handleDownload = async () => {
        if (syncKey) {
            const settings = await loadSettingsFromFirebase(syncKey);
            if (settings) {
                // Apply settings
                if (settings.shortcuts) {
                    SaveListShortcut(settings.shortcuts);
                }
                localStorage.setItem(SYNC_KEY, syncKey);
                setSyncAction("downloaded");
            } else {
                setSyncAction("invalid");
            }
        }
    };

    const handleCloseSyncModal = () => {
        if (syncAction === "downloaded") {
            setShowSyncModal(false);
            setSyncAction("");
            window.location.reload();
        } else {
            setShowSyncModal(false);
            setSyncAction("");
        }
    };

    return (
        <>
            <CustomizeModal>
                <CustomizeButton
                    title="Sync shortcuts..."
                    onClick={ChangeSyncSettings}
                />
            </CustomizeModal>
            {showSyncModal && (
                <CustomizeModal>
                    <p className="mb-2 font-light text-sm">Sync Shortcuts</p>
                    <div
                        className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
                        onClick={handleUpload}
                    >
                        <span>Upload Shortcuts</span>
                    </div>

                    <div
                        className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
                        onClick={handleDownload}
                    >
                        <span>Download Shortcuts</span>
                    </div>

                    <div className="mb-4">
                        <p className="mb-2 font-light text-sm">Sync Key</p>
                        <input
                            type="text"
                            placeholder="Enter sync key"
                            value={syncKey}
                            onChange={(e) => setSyncKey(e.target.value)}
                            className="w-full rounded-2xl px-4 py-2 text-gray-400 text-shadow hover:outline-none hover:bg-white hover:text-black"
                        />
                    </div>
                    {syncAction === "uploaded" && (
                        <p className="mb-2 font-light text-sm">
                            Shortcuts uploaded! Copy the key above.
                        </p>
                    )}
                    {syncAction === "downloaded" && (
                        <p className="mb-2 font-light text-sm">
                            Shortcuts downloaded! Refresh the page.
                        </p>
                    )}
                    {syncAction === "invalid" && (
                        <p className="mb-2 font-light text-sm">
                            Invalid sync key.
                        </p>
                    )}
                    <div
                        className="rounded-2xl flex flex-col mb-2 hover:bg-white hover:text-black px-4 py-2 cursor-pointer"
                        onClick={handleCloseSyncModal}
                    >
                        <span>Done</span>
                    </div>
                </CustomizeModal>
            )}
        </>
    );
}
