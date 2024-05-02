import { useEffect, useState } from "react"

function Scoreboard() {
    const [scores, setScores] = useState([])
    const apiURL = import.meta.env.VITE_URL;


    useEffect(() => {
        async function getScores() {
            try {
                const response = await fetch(`${apiURL}/game`, { mode: "cors" });
                const data = await response.json();
                const filteredData = data.filter(item => item.endTime !== null)

                const formattedScores = filteredData.map(item => {
                    const startTime = new Date(item.startTime).getTime();
                    const endTime = new Date(item.endTime).getTime();
                    const score = endTime - startTime;
                    return {
                        name: item.name,
                        score: formatTime(score)
                    };
                });

                const sortedScores = formattedScores.sort((a, b) => {
                    const scoreA = parseScoreStringToMilliseconds(a.score);
                    const scoreB = parseScoreStringToMilliseconds(b.score);
                    return scoreA - scoreB;
                });

                setScores(sortedScores);
            } catch (error) {
                console.error("Could not retrieve scores", error);
            }
        }

        getScores();
    }, [apiURL])

    const parseScoreStringToMilliseconds = (scoreString) => {
        const [minutes, seconds, milliseconds] = scoreString.split(':').map(Number);
        return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
    };

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
        <>
            <div className="flex justify-center">
                <h2 className="text-3xl">Scoreboard</h2>
            </div>
            <div className="mt-5">
                <div className="flex justify-between gap-5">
                    <p className="font-bold">Name</p>
                    <p className="font-bold">Score</p>
                </div>
                {
                    scores.map((score) => (
                        <>
                            <div>
                                <div className="flex justify-between gap-5">
                                    <p>{score.name}</p>
                                    <p>{score.score}</p>
                                </div>
                            </div>
                        </>
                    ))
                }
            </div>
        </>
    )
}

export default Scoreboard