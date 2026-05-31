import CustomizeModal from "../ui/CustomizeModal";
import CustomizeCheckbox from "../ui/CustomizeCheckbox";
import {
    IS_COUNTDOWN,
    COUNTDOWN_MESSAGE,
    COUNTDOWN_TIME,
    IS_12H,
} from "../../config/StorageKey";
import { useState, useRef } from "react";
import CustomizeButton from "../ui/CustomizeButton";
import DatetimePicker from "./DateTimePicker";

export default function CustomizeClock() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef();

    const [isCountdown, setIsCountdown] = useState(() => {
        try {
            const raw = localStorage.getItem(IS_COUNTDOWN);
            return raw ? JSON.parse(raw) : false;
        } catch (e) {
            return false;
        }
    });

    const [countdownTime, setCountdownTime] = useState(() => {
        try {
            const raw = localStorage.getItem(COUNTDOWN_TIME);
            if (!raw) return new Date();
            const parsed = JSON.parse(raw);
            // parsed may be an ISO string, timestamp, or null
            return parsed ? new Date(parsed) : new Date();
        } catch (e) {
            // Fallback: try raw string as date
            try {
                const raw2 = localStorage.getItem(COUNTDOWN_TIME);
                return raw2 ? new Date(raw2) : new Date();
            } catch (err) {
                return new Date();
            }
        }
    });

    const [countdownMessage, setCountdownMessage] = useState(() => {
        try {
            return localStorage.getItem(COUNTDOWN_MESSAGE) || "Time's up!";
        } catch (e) {
            return "Time's up!";
        }
    });

    const [is12H, setIs12H] = useState(() => {
        try {
            const raw = localStorage.getItem(IS_12H);
            return raw ? JSON.parse(raw) : false;
        } catch (e) {
            return false;
        }
    });

    const ChangeCountdownHandler = () => {
        let value = !isCountdown;
        setIsCountdown(value);
        localStorage.setItem(IS_COUNTDOWN, JSON.stringify(value));
    };

    const ChangeCountdownMessage = () => {
        let message = prompt("Countdown message", countdownMessage);
        if (message == null || message == "") {
            message = "Time's up!";
        }
        setCountdownMessage(message);
        localStorage.setItem(COUNTDOWN_MESSAGE, message);
    };

    const ChangeFormatHandler = () => {
        let value = !is12H;
        setIs12H(value);
        localStorage.setItem(IS_12H, JSON.stringify(value));
    };

    const ChangeCountdownTimeHandler = (dateTime) => {
        if (showDatePicker) {
            setShowDatePicker(false);
            if (dateTime) {
                console.log(dateTime);
                setCountdownTime(dateTime);
                // localStorage.setItem(COUNTDOWN_TIME, JSON.stringify(dateTime));
            }
        } else {
            setShowDatePicker(true);
        }
    };

    return (
        <>
            <CustomizeModal>
                <p className="mb-2 font-light text-sm">Clock type</p>
                <CustomizeCheckbox
                    text="Clock"
                    isChecked={!isCountdown}
                    onChange={ChangeCountdownHandler}
                />
                <CustomizeCheckbox
                    text="Countdown"
                    isChecked={isCountdown}
                    onChange={ChangeCountdownHandler}
                />
                <p className="mb-2 font-light text-sm">Clock settings</p>
                <CustomizeCheckbox
                    text="12H"
                    isChecked={is12H}
                    onChange={ChangeFormatHandler}
                />
                <CustomizeCheckbox
                    text="24H"
                    isChecked={!is12H}
                    onChange={ChangeFormatHandler}
                />
                <p className="mb-2 font-light text-sm">Countdown settings</p>
                <CustomizeButton
                    title="Time"
                    onClick={ChangeCountdownTimeHandler}
                >
                    <span className="text-gray-400 text-shadow">
                        {countdownTime.toLocaleString()}
                    </span>
                </CustomizeButton>
                <CustomizeButton
                    title="Message"
                    onClick={ChangeCountdownMessage}
                >
                    <span className="text-gray-400 text-shadow">
                        {countdownMessage}
                    </span>
                </CustomizeButton>
            </CustomizeModal>
            {showDatePicker && (
                <DatetimePicker
                    datetime={countdownTime}
                    onClose={ChangeCountdownTimeHandler}
                />
            )}
        </>
    );
}
