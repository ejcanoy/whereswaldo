import { useState } from "react";
import "./styles.css";

function Hotspot() {
  const [hotspotPosition, setHotspotPosition] = useState({ x: 0, y: 0 });

  function handleImageClick(e) {
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX
    const relativeY = e.pageY

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;

    setHotspotPosition({ x: hotspotX, y: hotspotY });

    const hotspotIcon = image.nextElementSibling;
    hotspotIcon.style.display = "block";
    hotspotIcon.style.top = hotspotY + "%";
    hotspotIcon.style.left = hotspotX + "%";
  }

  return (
    <div className="hotspot">
      <img
        src="/whereswaldoimage1.webp"
        alt="Hotspot Image"
        className="hotspot-img"
        onClick={handleImageClick}
      />
      <img
        src="/—Pngtree—square frame_5054164.png"
        alt="Hotspot Icon"
        className="hotspot-icon"
        style={{
          display: "none",
          position: "absolute",
          top: `${hotspotPosition.y}%`,
          left: `${hotspotPosition.x}%`,
          transform: "translate(-50%, -50%)"
        }}
      />
    </div>
  );
}

export default Hotspot;
