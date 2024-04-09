import { useState } from "react";
import "./styles.css";

function MapMarkers() {
  const [hotspotPositions, setHotspotPositions] = useState([]);

  function handleImageClick(e) {
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 100;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;
    console.log(hotspotX, hotspotY);

    const newHotspot = { x: hotspotX, y: hotspotY };

    if (verifyPosition(newHotspot)) {
      setHotspotPositions([...hotspotPositions, newHotspot]);
    }
  }


    function verifyPosition(newHotspot) {
      return newHotspot.x > 4 && newHotspot.x < 6 && newHotspot.y > 41 && newHotspot.y < 44
    }

  return (
    <>
      <div className="h-[100px] sticky bg-white z-40 top-0">
        <h1>wheres waldo</h1>
      </div>
      <div className="resize-x overflow-hidden w-full relative">
        <img
          src="/whereswaldoimage1.webp"
          alt="Hotspot Image"
          className="-z-10 w-full"
          onClick={handleImageClick}
        />
        {hotspotPositions.map((position, index) => (
          <div
            key={index}
            className="z-10 border-black border-2 w-[50px] h-[50px] absolute"
            style={{
              top: `${position.y}%`,
              left: `${position.x}%`,
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}
      </div>
    </>
  );
}

export default MapMarkers;
