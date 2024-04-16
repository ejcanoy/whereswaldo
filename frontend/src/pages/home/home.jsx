import { useEffect, useState } from "react"

function Home() {
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        async function getMaps() {
            try {
                const response = await fetch("https://localhost:3000/map", {
                    mode: "cors",
                    method: "GET"
                })
                const data = await response.json();
                setMaps(data);

            } catch (err) {
                console.log(err);
            }
        }

        getMaps();
    },[])
    return (
        <>
            <h1>home</h1>
            {
                maps.map((map) => (
                    <>
                    <h1 key={map.id}>{map.name}</h1>
                    </>
                ))
            }
        </>
    )
}

export default Home