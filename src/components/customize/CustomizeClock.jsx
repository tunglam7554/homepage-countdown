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

export default function CustomizeClock() {
    const datePickerRef = useRef();
    const [isCountdown, setIsCountdown] = useState(
        JSON.parse(localStorage.getItem(IS_COUNTDOWN)),
    );
    const [countdownTime, setCountdownTime] = useState(
        JSON.parse(localStorage.getItem(COUNTDOWN_TIME)) || new Date(),
    );
    const [countdownMessage, setCountdownMessage] = useState(
        localStorage.getItem(COUNTDOWN_MESSAGE) || "Time's up!",
    );
    const [is12H, setIs12H] = useState(
        JSON.parse(localStorage.getItem(IS_12H)) || false,
    );

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

    const ChangeCountdownTimeHandler = () => {
        let value = datePickerRef.current.value;
        setCountdownTime(value);
        localStorage.setItem(COUNTDOWN_TIME, JSON.parse(value));
    };
    return (
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
                onClick={() => {
                    datePickerRef.current.click();
                }}
            >
                <input
                    type="datetime-local"
                    ref={datePickerRef}
                    className="focus:outline-none text-gray-400 text-shadow cursor-pointer"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                        let time = e.target.value;
                        if (!time) {
                            time = new Date().setHours(17, 15, 0);
                        }
                        setCountdownTime(time);
                        localStorage.setItem(
                            COUNTDOWN_TIME,
                            JSON.stringify(time),
                        );
                    }}
                    value={countdownTime}
                />
            </CustomizeButton>
            <CustomizeButton title="Message" onClick={ChangeCountdownMessage}>
                <span className="text-gray-400 text-shadow">
                    {countdownMessage}
                </span>
            </CustomizeButton>
        </CustomizeModal>
    );
}
