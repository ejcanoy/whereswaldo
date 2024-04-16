import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

function Home() {
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        async function getMaps() {
            try {
                const response = await fetch("http://localhost:3000/map", {
                    mode: "cors",
                    method: "GET"
                });
                const data = await response.json();
                setMaps(data);

            } catch (err) {
                console.log(err);
            }
        }

        getMaps();
    }, [])
    return (
        <>
            <h1>home</h1>
            <div className="flex flex-auto">
                {
                    maps.map((map) => (
                        <Link key={map._id} to={`/map/${map._id}`} className="border border-black">
                            <h1>{map.name}</h1>
                        </Link>
                    ))

                }
            </div>
        </>
    )
}

export default Home