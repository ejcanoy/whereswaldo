import { useEffect, useState } from "react"

function Scoreboard() {
    const [scores, setScores] = useState([])

    useEffect(() => {
        async function getScores() {
            try {
                const response = await fetch("http://localhost:3000/game", { mode: "cors" });
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
    }, [])

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
            <div>Scoreboard</div>
            <div>
                {
                    scores.map((score) => (
                        <>
                            <div>
                                <div className="flex justify-between">
                                    <p>Name: {score.name}</p>
                                    <p>Score: {score.score}</p>
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