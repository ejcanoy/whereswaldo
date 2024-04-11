import { useEffect, useState } from "react";
import "./styles.css";

function MapMarkers() {
  const [hotspotPositions, setHotspotPositions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPostion] = useState(null);
  const [charLocations, setCharLocations] = useState({
    "raftman": { x: [3.5, 5.5], y: [41, 44] },
    "dragon": { x: [64.98, 67.98], y: [41.21, 44.21] },
    "wizard": { x: [74.35, 77.35], y: [64.62, 67.62] }
  })
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    let timeoutId;

    if (showNotification) {
      timeoutId = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showNotification]);

  function handleImageClick(e) {
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 100;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;

    setPopupPostion({ x: hotspotX, y: hotspotY });
    setShowPopup(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const selectedValue = e.target.querySelector('button[type="submit"]:focus').value;
    if (verifyPosition(popupPosition, charLocations[selectedValue])) {
      setHotspotPositions([...hotspotPositions, popupPosition]);

      const updatedCharLocations = { ...charLocations };
      delete updatedCharLocations[selectedValue];
      setCharLocations(updatedCharLocations);
      setNotificationMessage("Correct!");
    } else {
      setNotificationMessage("Not Correct!");
    }
    setShowNotification(true);
    setShowPopup(false);
    setPopupPostion(null);
  }

  function verifyPosition(newHotspot, ranges) {
    return newHotspot.x > ranges.x[0] && newHotspot.x < ranges.x[1] && newHotspot.y > ranges.y[0] && newHotspot.y < ranges.y[1]
  }

  return (
    <>

      <div className="h-[100px] flex justify-between sticky bg-white z-30 top-0">
        <div>
          <h1>wheres waldo</h1>
        </div>
        {showNotification &&
          <>
            <div className="bg-black text-white w-[100px] h-[50px]">
              <h3>{notificationMessage}</h3>
            </div>
          </>
        }
        <div className="flex items-center w-[300px] h-full">
          <div>
            <h2>find these characters!</h2>
          </div>
          <div className="flex justify-around w-[200px]">
            {Object.keys(charLocations).map((charname) => (
              <div key={charname}>
                <img className="w-[50px] h-[50px]" src={`/${charname}.png`} alt={`${charname}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="resize-x overflow-hidden w-full relative">
        <img
          src="/whereswaldoimage1.webp"
          alt="Hotspot Image"
          className="-z-10 w-full"
          onClick={handleImageClick}
        />
        {showPopup && (
          <div className="absolute flex" style={{ top: `${popupPosition.y}%`, left: `${popupPosition.x}%` }}>
            <div className="z-10 border-black border-2 w-[25px] h-[25px] md:w-[50px] md:h-[50px] relative -translate-x-1/2 -translate-y-1/2" >
            </div>
            <form className="grid justify-around bg-white w-[75px] h-[150px] relative -translate-x-1/4 sm:-translate-x-1/8 -translate-y-1/2" onSubmit={handleSubmit}>
              {Object.keys(charLocations).map((charname) => (
                <div key={charname}>

                  <button className="grid justify-items-center" type="submit" value={`${charname}`}>
                    <img className="w-[25px] h-[25px]" src={`/${charname}.png`} alt={`${charname}`} />
                    <span>{charname}</span>
                  </button>
                </div>
              ))}
            </form>
          </div>
        )}


        {hotspotPositions.map((position, index) => (
          <>
            <div
              key={index}
              className="z-10 border-black border-2 w-[25px] h-[25px] md:w-[50px] md:h-[50px] absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${position.y}%`,
                left: `${position.x}%`,
              }}
            />
          </>
        ))}
      </div >
    </>
  );
}

export default MapMarkers;
