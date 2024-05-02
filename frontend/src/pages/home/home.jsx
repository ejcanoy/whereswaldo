import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

function Home() {
    const [maps, setMaps] = useState([]);
    const apiURL = import.meta.env.VITE_URL;

    useEffect(() => {
        async function getMaps() {
            try {
                const response = await fetch(`${apiURL}/map`, {
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
            <div className="flex justify-center mb-5 md:mb-10">
                <h1 className="text-4xl">Where&apos;s Waldo?</h1>
            </div>
            <div className="flex flex-auto justify-around">
                {
                    maps.map((map) => (
                        <Link
                            key={map._id}
                            to={{ pathname: `/map/${map._id}`, state: map }}
                            className="border border-black w-[250px]"
                        >
                            <div className="w-full">
                                <img className="object-contain w-full h-full" src="/whereswaldoimage1.webp" alt="" />
                            </div>                            
                            <h1 className="text-center">{map.name}</h1>
                        </Link>
                    ))

                }
            </div>
        </>
    )
}

export default Home