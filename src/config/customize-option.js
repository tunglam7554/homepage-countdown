import CustomizeClock from "../components/customize/CustomizeClock";
import CustomizeWalpaper from "../components/customize/CustomizeWallpaper";
import CustomizeOption from "../components/customize/CustomizeOption";
import DeveloperOptions from "../components/customize/DeveloperOptions";

export const customizeOptions = [
    {
        id: 1,
        name: "Clock",
        description: "Customize clock type, format and countdown",
        element: CustomizeClock,
    },
    {
        id: 2,
        name: "Wallpaper",
        description: "Customize wallpaper and refresh interval",
        element: CustomizeWalpaper,
    },
    {
        id: 3,
        name: "Options",
        description: "Customize various options of the homepage",
        element: CustomizeOption,
    },
    {
        id: 4,
        name: "Developer",
        description: "Developer options for debugging and testing",
        element: DeveloperOptions,
    },
];
