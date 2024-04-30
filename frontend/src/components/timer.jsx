import { useEffect, useState } from "react";

const Timer = ({ startTime }) => {
    const [currentTime, setCurrentTime] = useState("00:00:00");

    useEffect(() => {
        let interval;

        const startTimer = () => {

            interval = setInterval(() => {
                const elapsed = new Date() - new Date(startTime);
                const formattedTime = formatTime(elapsed);
                setCurrentTime(formattedTime);
            }, 10);
        };

        startTimer();

        return () => {
            clearInterval(interval);
        };
    }, [startTime, currentTime]);

    const formatTime = (milliseconds) => {
        const minutes = Math.floor(milliseconds / (1000 * 60))
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
            .toString()
            .padStart(2, "0");
        const ms = Math.floor(milliseconds % 1000)
            .toString()
            .padStart(3, "0");

        return `${minutes}:${seconds}:${ms}`;
    };

    return (
        <div>
            <p>Score: {currentTime}</p>
        </div>
    );
};

export default Timer;