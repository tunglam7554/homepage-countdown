import { useState } from "react";
import CustomizeModal from "../ui/CustomizeModal";
import CustomizeButton from "../ui/CustomizeButton";
// import "./DatetimePicker.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function DatetimePicker({ datetime, onClose }) {
    const currentDate = datetime || new Date();

    const [date, setDate] = useState(currentDate);
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());
    const [hour, setHour] = useState(currentDate.getHours());
    const [minutes, setMinutes] = useState(currentDate.getMinutes());
    const [validationError, setValidationError] = useState("");

    const [mode, setMode] = useState(0);

    const modeName = ["Repeat everyday", "Select date"];

    const minusYear = () => {
        setYear(year - 1);
        setValidationError("");
    };
    const addYear = () => {
        setYear(year + 1);
        setValidationError("");
    };
    const minusMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
        setValidationError("");
    };
    const addMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
        setValidationError("");
    };

    const minusHour = () => {
        setHour(hour === 0 ? 23 : hour - 1);
        setValidationError("");
    };
    const addHour = () => {
        setHour(hour === 23 ? 0 : hour + 1);
        setValidationError("");
    };

    const minusMinutes = () => {
        setMinutes(minutes === 0 ? 59 : minutes - 1);
        setValidationError("");
    };
    const addMinutes = () => {
        setMinutes(minutes === 59 ? 0 : minutes + 1);
        setValidationError("");
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Add empty cells for days before month starts (adjust for Monday start)
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday=0 to Monday=0
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };
    const calendarDays = generateCalendarDays();
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const handleDateClick = (day) => {
        if (day) {
            const selectedDate = new Date(year, month, day);
            setDate(selectedDate);
            console.log("Selected date:", selectedDate);
            setValidationError("");
        }
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day &&
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        console.log(day);
        console.log(date);
        return (
            day &&
            day === date.getDate() &&
            month === date.getMonth() &&
            year === date.getFullYear()
        );
    };

    const formatTime = (value) => {
        return String(value).padStart(2, "0");
    };

    // Handle direct input for hours
    const handleHourInput = (e) => {
        let value = parseInt(e.target.value) || 0;
        if (value < 0) value = 0;
        if (value > 23) value = 23;
        setHour(value);
        setValidationError("");
    };

    // Handle direct input for minutes
    const handleMinutesInput = (e) => {
        let value = parseInt(e.target.value) || 0;
        if (value < 0) value = 0;
        if (value > 59) value = 59;
        setMinutes(value);
        setValidationError("");
    };

    const handleChangeMode = () => {
        setMode(mode == 0 ? 1 : 0);
        setValidationError("");
    };

    const formatDateTimeWithoutSeconds = () => {
        // For "Repeat everyday" preview the next occurrence; otherwise use the selected date
        let previewDate;
        if (mode === 0) {
            const now = new Date();
            previewDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hour,
                minutes,
                0,
                0,
            );
            if (previewDate <= now)
                previewDate.setDate(previewDate.getDate() + 1);
        } else {
            previewDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour,
                minutes,
                0,
                0,
            );
        }

        const y = previewDate.getFullYear();
        const mm = String(previewDate.getMonth() + 1).padStart(2, "0");
        const d = String(previewDate.getDate()).padStart(2, "0");
        const h = String(previewDate.getHours()).padStart(2, "0");
        const m = String(previewDate.getMinutes()).padStart(2, "0");

        return `${d}/${mm}/${y}, ${h}:${m}`;
    };

    const handleSaveDatetime = () => {
        const now = new Date();

        if (mode === 0) {
            // Repeat everyday: compute next occurrence from now
            let next = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hour,
                minutes,
                0,
                0,
            );
            if (next <= now) next.setDate(next.getDate() + 1);
            onClose(next);
            return;
        }

        const selectedDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minutes,
            0,
            0,
        );

        if (selectedDateTime <= now) {
            setValidationError(
                "Selected date/time is in the past. Please choose a future date/time.",
            );
            return;
        }

        onClose(selectedDateTime);
    };
    const nowForValidation = new Date();
    const selectedForValidation = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hour,
        minutes,
        0,
        0,
    );
    const isInvalid = mode === 1 && selectedForValidation <= nowForValidation;
    const validationMessage = isInvalid
        ? "Selected date/time is in the past. Please choose a future date/time."
        : validationError;

    return (
        <CustomizeModal>
            <p className="my-1 font-light text-sm">Select time</p>
            <div className="flex mb-1 w-full">
                <div className="flex gap-1 flex-1 justify-between">
                    <div
                        className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={minusHour}
                    >
                        <ChevronLeft size={16} />
                    </div>
                    <div className="leading-8 text-2xl font-semibold text-center">
                        {hour}
                    </div>
                    <div
                        className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={addHour}
                    >
                        <ChevronRight size={16} />
                    </div>
                </div>
                <div className="flex gap-1 flex-1 justify-between">
                    <div
                        className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={minusMinutes}
                    >
                        <ChevronLeft size={16} />
                    </div>
                    <div className="leading-8 text-2xl font-semibold">
                        {minutes}
                    </div>
                    <div
                        className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={addMinutes}
                    >
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl h-8 flex items-center mb-2">
                <p className="my-1 mr-4 font-light text-sm">Notification:</p>
                <div className="flex flex-1 justify-between">
                    <div
                        className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={handleChangeMode}
                    >
                        <ChevronLeft size={16} />
                    </div>
                    <div className="leading-8 text-sm font-semibold text-center">
                        {modeName[mode]}
                    </div>
                    <div
                        className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={handleChangeMode}
                    >
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
            {mode === 1 && (
                <>
                    <div className="flex justify-between mb-1 w-full">
                        <div className="flex gap-1">
                            <div
                                className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                                onClick={minusMonth}
                            >
                                <ChevronLeft size={16} />
                            </div>
                            <div className="leading-8 text-sm font-semibold w-24 text-center">
                                {monthNames[month]}
                            </div>
                            <div
                                className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                                onClick={addMonth}
                            >
                                <ChevronRight size={16} />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div
                                className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                                onClick={minusYear}
                            >
                                <ChevronLeft size={16} />
                            </div>
                            <div className="leading-8 text-sm font-semibold">
                                {year}
                            </div>
                            <div
                                className="rounded-2xl h-8 flex items-center hover:bg-white hover:text-black p-2 cursor-pointer"
                                onClick={addYear}
                            >
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        T2
                                    </th>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        T3
                                    </th>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        T4
                                    </th>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        T5
                                    </th>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        T6
                                    </th>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        T7
                                    </th>
                                    <th className="text-xs font-semibold text-gray-300 py-2 px-1 text-center">
                                        CN
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {weeks.map((week, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {week.map((day, colIndex) => (
                                            <td
                                                key={colIndex}
                                                onClick={() =>
                                                    handleDateClick(day)
                                                }
                                                className={`h-8 text-center text-sm rounded-2xl cursor-pointer transition-colors ${
                                                    day
                                                        ? isSelected(day)
                                                            ? "bg-white text-black font-semibold"
                                                            : isToday(day)
                                                              ? "bg-blue-500 text-white"
                                                              : "hover:bg-white hover:text-black"
                                                        : ""
                                                }`}
                                            >
                                                {day}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            <div className="p-1 rounded text-center text-sm">
                {!validationMessage ? (
                    <p className="text-gray-300">
                        Next notification on: {formatDateTimeWithoutSeconds()}
                    </p>
                ) : (
                    <p className="text-red-400 text-xs mt-1">
                        {validationMessage}
                    </p>
                )}
            </div>
            <CustomizeButton
                title="Done"
                onClick={handleSaveDatetime}
                disabled={Boolean(validationMessage)}
            ></CustomizeButton>
        </CustomizeModal>
    );
}

export default DatetimePicker;
