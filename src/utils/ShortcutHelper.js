import { SHORT_CUTS } from "../config/StorageKey";

export const SaveListShortcut = (apps) =>{
    if (apps && apps.length > 0) {
        localStorage.setItem(SHORT_CUTS, JSON.stringify(apps));
    } else {
        localStorage.setItem(SHORT_CUTS, []);
    }
}

export const GetListShortcut = () =>{
    const listShortcut = localStorage.getItem(SHORT_CUTS);
    return listShortcut ? JSON.parse(listShortcut) : [];
}