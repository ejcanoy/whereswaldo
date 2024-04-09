import { useState } from "react";
import "./styles.css";

function MapMarkers() {
  const [hotspotPositions, setHotspotPositions] = useState([]);

  function handleImageClick(e) {
    console.log(hotspotPositions);
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 100;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;

    const newHotspot = { x: hotspotX, y: hotspotY };

    setHotspotPositions([...hotspotPositions, newHotspot]);
  }

  console.log(hotspotPositions);
  return (
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
  );
}

export default MapMarkers;
