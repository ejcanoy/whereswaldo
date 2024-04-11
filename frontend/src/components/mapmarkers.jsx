import { useState } from "react";
import "./styles.css";

function MapMarkers() {
  const [hotspotPositions, setHotspotPositions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPostion] = useState(null);
  const charLocations = {
    "raftman" : {x : [3.5, 5.5], y: [41, 44]},
    "dragon" : {x: [64.98, 67.98], y: [41.21, 44.21]},
    "wizard" : {x: [74.35, 77.35], y: [64.62, 67.62]}
  }

  function handleImageClick(e) {
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 100;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;

    console.log(hotspotX, hotspotY)


    setPopupPostion({ x: hotspotX, y: hotspotY });
    setShowPopup(true);
  }

  /*
    new handleclick function
      // display the pop up

    handleModalClick
      // get which character they selected -> object key so we can verify
      // verify the position for that character using the function
        set the location if it true
  */

  function handleSubmit(e) {
    e.preventDefault();
    const selectedValue = e.target.querySelector('button[type="submit"]:focus').value;
    if (verifyPosition(popupPosition, charLocations[selectedValue])) {
      setHotspotPositions([...hotspotPositions, popupPosition]);
    }
    setShowPopup(false);
    setPopupPostion(null);
  }
  
  function verifyPosition(newHotspot, ranges) {
    return newHotspot.x > ranges.x[0] && newHotspot.x < ranges.x[1] && newHotspot.y > ranges.y[0] && newHotspot.y < ranges.y[1]
  }

  return (
    <>
      <div className="h-[100px] flex justify-between sticky bg-white z-40 top-0">
        <div>
          <h1>wheres waldo</h1>
        </div>
        <div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
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
            <form className="grid bg-white w-[50px] h-[75px] relative -translate-x-1/4 sm:-translate-x-1/2 -translate-y-1/2" onSubmit={handleSubmit}>
              <button type="submit" className="bg-black text-white" value="raftman">raftman</button>
              <button type="submit" className="bg-black text-white" value="dragon">dragon</button>
              <button type="submit" className="bg-black text-white" value="wizard">wizard</button>
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
