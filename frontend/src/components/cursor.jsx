import { useEffect, useState } from "react"

function Cursor() {
    const [coordinates, setCoordinates] = useState([]);

    function handleMouseMove(e) {
        const coordinates = [e.clientX, e.clientY];
        setCoordinates(coordinates);
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return (() => {
            window.removeEventListener('mousemove', handleMouseMove);
        })
    },[])


    return coordinates
}

export default Cursor
