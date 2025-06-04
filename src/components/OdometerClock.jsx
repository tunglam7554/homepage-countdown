import { useState, useEffect } from "react";
import {
  IS_12H,
  UPDATE_CONFIG,
  IS_COUNTDOWN,
  COUNTDOWN_TIME,
  COUNTDOWN_MESSAGE,
} from "../config/StorageKey";

const OdometerDigit = ({ value, isAnimating }) => {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="relative w-10 h-16 overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          isAnimating ? "transform" : ""
        }`}
        style={{
          transform: `translateY(-${value * 64}px)`,
        }}
      >
        {digits.concat(digits).map((digit, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-full h-16 text-7xl font-normal text-white ${
              value == digit ? "text-shadow-lg" : ""
            } `}
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

const OdometerClock = () => {
  const [isCountDown, setIsCountDown] = useState(() => {
    const saved = localStorage.getItem(IS_COUNTDOWN);
    return saved ? JSON.parse(saved) : false;
  });
  const [countdownTarget, setCountdownTarget] = useState(() => {
    const saved = localStorage.getItem(COUNTDOWN_TIME);
    return saved ? new Date(saved) : null;
  });
  const [countdownMessage, setCountdownMessage] = useState(() => {
    const saved = localStorage.getItem(COUNTDOWN_MESSAGE);
    return saved ? saved : "Time's up!";
  });
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());
  const [is12HourFormat, setIs12HourFormat] = useState(() => {
    const saved = localStorage.getItem(IS_12H);
    return saved ? JSON.parse(saved) : false;
  });
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    // Request notification permission on component mount
    if ("Notification" in window && Notification.permission != "granted") {
      requestNotificationPermission();
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }
    return "denied";
  };

  const showNotification = (title, message) => {
    if (notificationPermission === "granted") {
      const notification = new Notification(title, {
        body: message,
        icon: "/favicon.ico", // You can customize this
        badge: "/favicon.ico",
        requireInteraction: true, // Keeps notification visible until user interacts
        tag: "countdown-alert", // Prevents duplicate notifications
      });

      // Play notification sound (optional)
      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfAzWH0fPTgjMGJ3zM7+ONQQEXYS/q8KZWFBFI/jN+uj8B"
        ); // Simple beep sound
        audio.play().catch(() => {}); // Ignore errors if audio fails
      } catch (error) {
        // Audio failed, continue without sound
      }

      // Auto-close notification after 10 seconds (optional)
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
    return null;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevTime(time);
      const newTime = new Date();
      setTime(newTime);

      // Check if countdown just expired and send notification
      if (isCountDown && countdownTarget && !hasNotified) {
        const timeRemaining = countdownTarget.getTime() - newTime.getTime();
        const wasPositive = countdownTarget.getTime() - time.getTime() > 0;

        // If countdown just expired (crossed from positive to zero/negative)
        if (wasPositive && timeRemaining <= 0) {
          setHasNotified(true);
          const message = countdownMessage || "Time's up!";
          showNotification("Countdown Alert", message);

          // Also show browser alert as fallback
          if (notificationPermission !== "granted") {
            alert(`🚨 ${message}`);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    time,
    isCountDown,
    countdownTarget,
    countdownMessage,
    hasNotified,
    notificationPermission,
  ]);

  useEffect(() => {
    var isCountDownMode = JSON.parse(
      localStorage.getItem(IS_COUNTDOWN) || false
    );
    if (isCountDownMode) {
      setHasNotified(false);
    }
    setIsCountDown(isCountDownMode);
    setIs12HourFormat(JSON.parse(localStorage.getItem(IS_12H)));

    const savedTarget = JSON.parse(localStorage.getItem(COUNTDOWN_TIME));
    if (savedTarget) {
      setCountdownTarget(new Date(savedTarget));
    }

    setCountdownMessage(
      localStorage.getItem(COUNTDOWN_MESSAGE) || "Time's up!"
    );
  }, [localStorage.getItem(UPDATE_CONFIG)]);

  const formatTime = (date) => {
    let hours12 = date.getHours();
    let ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12;
    hours12 = hours12 ? hours12 : 12;
    hours12 = hours12.toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = `${date.toLocaleString("default", { month: "long" })}`;
    const year = date.getFullYear().toString();
    return { hours, minutes, seconds, day, month, year, hours12, ampm };
  };

  const formatCountdown = (targetDate) => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        isExpired: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, "0");
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0");

    return { days, hours, minutes, seconds, isExpired: false };
  };

  const current = !isCountDown
    ? formatTime(time)
    : countdownTarget
    ? formatCountdown(countdownTarget)
    : null;
  const previous = !isCountDown
    ? formatTime(prevTime)
    : countdownTarget
    ? formatCountdown(countdownTarget)
    : null;

  const hasChanged = (currentVal, prevVal) => currentVal !== prevVal;

  if (isCountDown && countdownTarget) {
    const countdown = current;

    if (countdown && countdown.isExpired) {
      return (
        <div className="w-full flex flex-col items-center space-y-4 text-white text-4xl font-bold text-shadow-lg">
          {countdownMessage || "Time's Up!"}
        </div>
      );
    }

    if (countdown) {
      return (
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            {/* Days */}
            {parseInt(countdown.days) > 0 && (
              <div className="flex flex-col">
                <div className="flex mb-2 justify-center">
                  <OdometerDigit
                    value={parseInt(countdown.days[0])}
                    isAnimating={hasChanged(
                      countdown.days[0],
                      previous?.days[0]
                    )}
                  />
                  <OdometerDigit
                    value={parseInt(countdown.days[1])}
                    isAnimating={hasChanged(
                      countdown.days[1],
                      previous?.days[1]
                    )}
                  />
                </div>
                <div className="text-center text-white text-sm text-shadow-lg">
                  Days
                </div>
              </div>
            )}

            {/* Hours */}
            <div className="flex flex-col">
              <div className="flex mb-2 justify-center">
                <OdometerDigit
                  value={parseInt(countdown.hours[0])}
                  isAnimating={hasChanged(
                    countdown.hours[0],
                    previous?.hours[0]
                  )}
                />
                <OdometerDigit
                  value={parseInt(countdown.hours[1])}
                  isAnimating={hasChanged(
                    countdown.hours[1],
                    previous?.hours[1]
                  )}
                />
              </div>
              <div className="text-center text-white text-sm text-shadow-lg">
                Hours
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col">
              <div className="flex mb-2 justify-center">
                <OdometerDigit
                  value={parseInt(countdown.minutes[0])}
                  isAnimating={hasChanged(
                    countdown.minutes[0],
                    previous?.minutes[0]
                  )}
                />
                <OdometerDigit
                  value={parseInt(countdown.minutes[1])}
                  isAnimating={hasChanged(
                    countdown.minutes[1],
                    previous?.minutes[1]
                  )}
                />
              </div>
              <div className="text-center text-white text-sm text-shadow-lg">
                Minutes
              </div>
            </div>

            {/* Seconds */}
            <div className="flex flex-col">
              <div className="flex mb-2 justify-center">
                <OdometerDigit
                  value={parseInt(countdown.seconds[0])}
                  isAnimating={hasChanged(
                    countdown.seconds[0],
                    previous?.seconds[0]
                  )}
                />
                <OdometerDigit
                  value={parseInt(countdown.seconds[1])}
                  isAnimating={hasChanged(
                    countdown.seconds[1],
                    previous?.seconds[1]
                  )}
                />
              </div>
              <div className="text-center text-white text-sm text-shadow-lg">
                Seconds
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-full flex items-center">
      <div className="flex items-center space-x-4">
        {/* Hours */}
        <div className="flex flex-col">
          <div className="flex mb-2 justify-center">
            {is12HourFormat ? (
              <>
                <OdometerDigit
                  value={parseInt(current.hours12[0])}
                  isAnimating={hasChanged(
                    current.hours12[0],
                    previous.hours12[0]
                  )}
                />
                <OdometerDigit
                  value={parseInt(current.hours12[1])}
                  isAnimating={hasChanged(
                    current.hours12[1],
                    previous.hours12[1]
                  )}
                />
              </>
            ) : (
              <>
                <OdometerDigit
                  value={parseInt(current.hours[0])}
                  isAnimating={hasChanged(current.hours[0], previous.hours[0])}
                />
                <OdometerDigit
                  value={parseInt(current.hours[1])}
                  isAnimating={hasChanged(current.hours[1], previous.hours[1])}
                />
              </>
            )}
          </div>
          <div className="text-left text-white text-sm text-shadow-lg">
            Hours
          </div>
        </div>
        {/* Minutes */}
        <div className="flex flex-col">
          <div className="flex mb-2 justify-center">
            <OdometerDigit
              value={parseInt(current.minutes[0])}
              isAnimating={hasChanged(current.minutes[0], previous.minutes[0])}
            />
            <OdometerDigit
              value={parseInt(current.minutes[1])}
              isAnimating={hasChanged(current.minutes[1], previous.minutes[1])}
            />
          </div>
          <div className="text-left text-white text-sm text-shadow-lg">
            Minutes
          </div>
        </div>

        {/* Seconds */}
        <div className="flex flex-col">
          <div className="flex mb-2 justify-center">
            <OdometerDigit
              value={parseInt(current.seconds[0])}
              isAnimating={hasChanged(current.seconds[0], previous.seconds[0])}
            />
            <OdometerDigit
              value={parseInt(current.seconds[1])}
              isAnimating={hasChanged(current.seconds[1], previous.seconds[1])}
            />
          </div>
          <div className="text-left text-white text-sm text-shadow-lg">
            Seconds
          </div>
        </div>

        {/* AM/PM */}
        {is12HourFormat && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-white text-3xl font-normal text-shadow-lg">
              {current.ampm}
            </div>
          </div>
        )}

        {/* Date Display */}
        <div className="flex flex-col justify-center text-white text-2xl text-shadow-lg">
          <div className="text-left">
            {current.day} {current.month}
          </div>
          <div className="text-left">{current.year}</div>
        </div>
      </div>
    </div>
  );
};

export default OdometerClock;
